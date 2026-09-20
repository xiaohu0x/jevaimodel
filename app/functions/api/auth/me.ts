import { getUsageStatus } from '../_usage'
import { json, type Env } from './_utils'

/** Returns the server-authoritative account and classifier allowance. */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const status = await getUsageStatus(context.request, context.env)
    const response = json({ user: status.actor.user, quota: status.quota })
    for (const cookie of status.cookies) response.headers.append('Set-Cookie', cookie)
    return response
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'account_status_error',
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    return json({ error: 'account_status_unavailable' }, 503)
  }
}
