import { SESSION_COOKIE, clearCookie, getCookie, isSecure, json, type Env } from './_utils'

/** Returns the signed-in user for the current session cookie. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sid = getCookie(request, SESSION_COOKIE)
  if (!sid) return json({ user: null })

  const row = await env.DB.prepare(
    `SELECT u.id AS id, u.email AS email, u.name AS name, u.picture AS picture,
            s.expires_at AS expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.id = ?`,
  )
    .bind(sid)
    .first<{
      id: string
      email: string
      name: string | null
      picture: string | null
      expires_at: number
    }>()

  if (!row) return json({ user: null })

  if (row.expires_at < Date.now()) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sid).run()
    const res = json({ user: null })
    res.headers.append('Set-Cookie', clearCookie(SESSION_COOKIE, isSecure(request)))
    return res
  }

  return json({
    user: { id: row.id, email: row.email, name: row.name, picture: row.picture },
  })
}
