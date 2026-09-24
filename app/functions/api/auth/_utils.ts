/** Shared helpers for the Google sign-in routes. Files starting with `_` are not routed. */

export interface DatabaseEnv {
  DB: D1Database
}

export interface Env extends DatabaseEnv {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  /** Canonical public origin, e.g. https://jevaimodel.app (used to build OAuth redirect URIs). */
  PUBLIC_ORIGIN?: string
}

/** The origin Google should redirect back to — always the canonical one when set. */
export function publicOrigin(request: Request, env: Env): string {
  const url = new URL(request.url)
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return url.origin
  const configured = env.PUBLIC_ORIGIN?.trim()
  if (configured) return configured.replace(/\/+$/, '')
  return new URL(request.url).origin
}

export const SESSION_COOKIE = 'jev_sid'
export const STATE_COOKIE = 'jev_oauth_state'
export const NEXT_COOKIE = 'jev_oauth_next'
export const PKCE_COOKIE = 'jev_oauth_pkce'
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

export interface AccountUser {
  id: string
  email: string
  name: string | null
  picture: string | null
}

export interface SessionUserResult {
  user: AccountUser | null
  /** A cookie was supplied but no current session matched it. */
  clearSession: boolean
}

export function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Builds the S256 challenge used to bind an OAuth callback to this browser. */
export async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  const binary = String.fromCharCode(...new Uint8Array(digest))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie') || ''
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    if (part.slice(0, idx).trim() === name) {
      try { return decodeURIComponent(part.slice(idx + 1).trim()) } catch { return null }
    }
  }
  return null
}

export function serializeCookie(
  name: string,
  value: string,
  opts: { maxAge?: number; secure?: boolean } = {},
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax']
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`)
  if (opts.secure) parts.push('Secure')
  return parts.join('; ')
}

export function clearCookie(name: string, secure: boolean): string {
  return serializeCookie(name, '', { maxAge: 0, secure })
}

export function isSecure(request: Request): boolean {
  return new URL(request.url).protocol === 'https:'
}

/** Resolves the opaque session cookie without trusting client-side account state. */
export async function getSessionUser(
  request: Request,
  env: DatabaseEnv,
  now = Date.now(),
): Promise<SessionUserResult> {
  const sid = getCookie(request, SESSION_COOKIE)
  if (!sid) return { user: null, clearSession: false }

  const db = env.DB.withSession('first-primary')
  const row = await db.prepare(
    `SELECT u.id AS id, u.email AS email, u.name AS name, u.picture AS picture,
            s.expires_at AS expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = ?`,
  )
    .bind(sid)
    .first<AccountUser & { expires_at: number }>()

  if (!row) return { user: null, clearSession: true }
  if (row.expires_at >= now) {
    return {
      user: { id: row.id, email: row.email, name: row.name, picture: row.picture },
      clearSession: false,
    }
  }

  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sid).run()
  return { user: null, clearSession: true }
}

export function json(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  })
}

/** Only allow canonical, same-site relative redirects. */
export function safeNext(next: string | null): string {
  const hasUnsafeCharacter = next
    ? Array.from(next).some((char) => {
        const code = char.charCodeAt(0)
        return char === '\\' || code <= 31 || code === 127
      })
    : false

  if (
    !next ||
    next.length > 2048 ||
    !next.startsWith('/') ||
    hasUnsafeCharacter ||
    /%(?:2f|5c)/i.test(next)
  ) {
    return '/'
  }

  try {
    const base = new URL('https://redirect.invalid')
    const target = new URL(next, base)
    if (target.origin !== base.origin) return '/'
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return '/'
  }
}
