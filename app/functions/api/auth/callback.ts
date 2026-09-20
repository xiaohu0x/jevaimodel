import {
  NEXT_COOKIE,
  PKCE_COOKIE,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  STATE_COOKIE,
  clearCookie,
  getCookie,
  isSecure,
  publicOrigin,
  randomToken,
  safeNext,
  serializeCookie,
  type Env,
} from './_utils'

interface GoogleProfile {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
}

/** Google redirects here with ?code & ?state. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const secure = isSecure(request)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const oauthError = url.searchParams.get('error')
  const expectedState = getCookie(request, STATE_COOKIE)
  const verifier = getCookie(request, PKCE_COOKIE)
  const next = safeNext(getCookie(request, NEXT_COOKIE))

  // Always clear the short-lived OAuth cookies.
  const finish = (location: string, extra: string[] = []) => {
    const headers = new Headers({
      Location: location,
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    })
    for (const c of [
      clearCookie(STATE_COOKIE, secure),
      clearCookie(NEXT_COOKIE, secure),
      clearCookie(PKCE_COOKIE, secure),
      ...extra,
    ]) {
      headers.append('Set-Cookie', c)
    }
    return new Response(null, { status: 302, headers })
  }

  if (oauthError) return finish(`/?auth_error=${encodeURIComponent(oauthError)}`)
  if (!code || !state || !expectedState || state !== expectedState || !verifier) {
    return finish('/?auth_error=invalid_state')
  }

  // 1. Exchange the authorization code for an access token.
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${publicOrigin(request, env)}/api/auth/callback`,
      grant_type: 'authorization_code',
      code_verifier: verifier,
    }),
  })
  if (!tokenRes.ok) {
    return finish('/?auth_error=token_exchange_failed')
  }
  const tokens = (await tokenRes.json()) as { access_token?: string }
  if (!tokens.access_token) return finish('/?auth_error=no_access_token')

  // 2. Read the Google profile.
  const profileRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  if (!profileRes.ok) return finish('/?auth_error=profile_fetch_failed')
  const profile = (await profileRes.json()) as GoogleProfile
  if (!profile.sub || !profile.email) return finish('/?auth_error=incomplete_profile')
  if (profile.email_verified !== true) return finish('/?auth_error=unverified_email')

  // 3. Upsert the user into D1.
  const now = Date.now()
  await env.DB.prepare(
    `INSERT INTO users (id, google_sub, email, name, picture, created_at, last_login_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(google_sub) DO UPDATE SET
       email = excluded.email,
       name = excluded.name,
       picture = excluded.picture,
       last_login_at = excluded.last_login_at`,
  )
    .bind(
      crypto.randomUUID(),
      profile.sub,
      profile.email,
      profile.name ?? null,
      profile.picture ?? null,
      now,
      now,
    )
    .run()

  const user = await env.DB.prepare('SELECT id FROM users WHERE google_sub = ?')
    .bind(profile.sub)
    .first<{ id: string }>()
  if (!user) return finish('/?auth_error=user_upsert_failed')

  // 4. Create a session and set the cookie.
  const sid = randomToken()
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now),
    env.DB.prepare(
      'INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)',
    ).bind(sid, user.id, now, now + SESSION_TTL_MS),
  ])

  return finish(next, [
    serializeCookie(SESSION_COOKIE, sid, { maxAge: SESSION_TTL_MS / 1000, secure }),
  ])
}
