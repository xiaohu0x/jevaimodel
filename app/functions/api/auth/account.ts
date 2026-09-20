import { userUsageKey } from '../_usage'
import { SESSION_COOKIE, clearCookie, getCookie, isSecure, json, type Env } from './_utils'

/** Permanently deletes the signed-in account and all of its sessions. */
export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const sid = getCookie(request, SESSION_COOKIE)

  if (sid) {
    const session = await env.DB.prepare(
      'SELECT user_id FROM sessions WHERE id = ? AND expires_at >= ?',
    )
      .bind(sid, Date.now())
      .first<{ user_id: string }>()

    if (session) {
      await env.DB.batch([
        env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(session.user_id),
        env.DB.prepare('DELETE FROM usage_buckets WHERE actor_key = ?').bind(userUsageKey(session.user_id)),
        env.DB.prepare('DELETE FROM users WHERE id = ?').bind(session.user_id),
      ])
    }
  }

  const response = json({ ok: true })
  response.headers.append('Set-Cookie', clearCookie(SESSION_COOKIE, isSecure(request)))
  return response
}
