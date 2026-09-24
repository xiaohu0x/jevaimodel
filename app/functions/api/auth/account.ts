import { userUsageKey } from '../_usage.ts'
import { SESSION_COOKIE, clearCookie, getCookie, isSecure, json, type Env } from './_utils.ts'

/** Permanently deletes the signed-in account and all of its sessions. */
export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const sid = getCookie(request, SESSION_COOKIE)

  const session = sid ? await env.DB.withSession('first-primary').prepare(
    'SELECT user_id FROM sessions WHERE id = ? AND expires_at >= ?',
  ).bind(sid, Date.now()).first<{ user_id: string }>() : null

  if (!session) {
    const response = json({ error: 'authentication_required' }, 401)
    response.headers.append('Set-Cookie', clearCookie(SESSION_COOKIE, isSecure(request)))
    return response
  }

  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(session.user_id),
    env.DB.prepare('DELETE FROM usage_buckets WHERE actor_key = ?').bind(userUsageKey(session.user_id)),
    env.DB.prepare('DELETE FROM users WHERE id = ?').bind(session.user_id),
  ])

  const response = json({ ok: true })
  response.headers.append('Set-Cookie', clearCookie(SESSION_COOKIE, isSecure(request)))
  return response
}
