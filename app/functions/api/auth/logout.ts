import { SESSION_COOKIE, clearCookie, getCookie, isSecure, json, type Env } from './_utils'

/** Clears the session cookie and removes it from D1. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sid = getCookie(request, SESSION_COOKIE)
  if (sid) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sid).run()
  }
  const res = json({ ok: true })
  res.headers.append('Set-Cookie', clearCookie(SESSION_COOKIE, isSecure(request)))
  return res
}
