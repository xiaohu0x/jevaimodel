import {
  NEXT_COOKIE,
  PKCE_COOKIE,
  STATE_COOKIE,
  isSecure,
  json,
  pkceChallenge,
  publicOrigin,
  randomToken,
  safeNext,
  serializeCookie,
  type Env,
} from './_utils'

/** Kicks off the Google OAuth flow. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)

  if (!env.GOOGLE_CLIENT_ID) {
    return json({ error: 'google_login_not_configured' }, 500)
  }

  const state = randomToken(16)
  const verifier = randomToken()
  const challenge = await pkceChallenge(verifier)
  const redirectUri = `${publicOrigin(request, env)}/api/auth/callback`
  const next = safeNext(url.searchParams.get('next'))
  const secure = isSecure(request)

  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  auth.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)
  auth.searchParams.set('redirect_uri', redirectUri)
  auth.searchParams.set('response_type', 'code')
  auth.searchParams.set('scope', 'openid email profile')
  auth.searchParams.set('state', state)
  auth.searchParams.set('code_challenge', challenge)
  auth.searchParams.set('code_challenge_method', 'S256')
  auth.searchParams.set('prompt', 'select_account')
  auth.searchParams.set('access_type', 'online')
  auth.searchParams.set('include_granted_scopes', 'true')

  const headers = new Headers({
    Location: auth.toString(),
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
  })
  headers.append('Set-Cookie', serializeCookie(STATE_COOKIE, state, { maxAge: 600, secure }))
  headers.append('Set-Cookie', serializeCookie(NEXT_COOKIE, next, { maxAge: 600, secure }))
  headers.append('Set-Cookie', serializeCookie(PKCE_COOKIE, verifier, { maxAge: 600, secure }))
  return new Response(null, { status: 302, headers })
}
