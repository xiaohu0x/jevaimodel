import {
  SESSION_COOKIE,
  clearCookie,
  getCookie,
  getSessionUser,
  isSecure,
  randomToken,
  serializeCookie,
  type AccountUser,
  type DatabaseEnv,
} from './auth/_utils.ts'

export const GUEST_RUN_LIMIT = 3
export const USER_DAILY_RUN_LIMIT = 30
export const COOLDOWN_MS = 10_000

const GUEST_COOKIE = 'jev_gid'
const GUEST_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 365

export type UsageEnv = DatabaseEnv

export interface QuotaSnapshot {
  authenticated: boolean
  period: 'lifetime' | 'day'
  limit: number
  used: number
  remaining: number
  retryAfterSeconds: number
  resetAt: string | null
  canRun: boolean
}

export type UsageErrorCode = 'LOGIN_REQUIRED' | 'RATE_LIMITED' | 'DAILY_LIMIT'

export interface UsageError {
  ok: false
  code: UsageErrorCode
  status: number
  message: string
  quota: QuotaSnapshot
  retryAfterSeconds?: number
  cookies: string[]
}

export interface UsageActor {
  key: string
  authenticated: boolean
  user: AccountUser | null
  bucketKey: string
  period: QuotaSnapshot['period']
  limit: number
  resetAt: string | null
}

export interface UsageSuccess {
  ok: true
  actor: UsageActor
  quota: QuotaSnapshot
  cookies: string[]
}

export interface UsageStatus {
  actor: UsageActor
  quota: QuotaSnapshot
  cookies: string[]
}

interface UsageRow {
  request_count: number
  last_request_at: number
}

export const RESERVE_USAGE_SQL = `
  INSERT INTO usage_buckets (
    actor_key, bucket_key, request_count, last_request_at, created_at, updated_at
  ) VALUES (?, ?, 1, ?, ?, ?)
  ON CONFLICT(actor_key, bucket_key) DO UPDATE SET
    request_count = usage_buckets.request_count + 1,
    last_request_at = excluded.last_request_at,
    updated_at = excluded.updated_at
  WHERE usage_buckets.request_count < ?
    AND excluded.last_request_at - usage_buckets.last_request_at >= ?
  RETURNING request_count, last_request_at
`

function utcDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10)
}

function nextUtcDay(now: number): string {
  const date = new Date(now)
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
  ).toISOString()
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function quotaFromRow(actor: UsageActor, row: UsageRow | null, now: number): QuotaSnapshot {
  const used = row?.request_count ?? 0
  const remaining = Math.max(0, actor.limit - used)
  const retryAfterSeconds =
    remaining > 0 && row
      ? Math.max(0, Math.ceil((row.last_request_at + COOLDOWN_MS - now) / 1000))
      : 0

  return {
    authenticated: actor.authenticated,
    period: actor.period,
    limit: actor.limit,
    used,
    remaining,
    retryAfterSeconds,
    resetAt: actor.resetAt,
    canRun: remaining > 0 && retryAfterSeconds === 0,
  }
}

async function resolveActor(request: Request, env: UsageEnv, now: number): Promise<{
  actor: UsageActor
  cookies: string[]
}> {
  const session = await getSessionUser(request, env, now)
  const cookies: string[] = []

  if (session.user) {
    return {
      actor: {
        key: `user:${session.user.id}`,
        authenticated: true,
        user: session.user,
        bucketKey: `day:${utcDay(now)}`,
        period: 'day',
        limit: USER_DAILY_RUN_LIMIT,
        resetAt: nextUtcDay(now),
      },
      cookies,
    }
  }

  if (session.clearSession) {
    cookies.push(clearCookie(SESSION_COOKIE, isSecure(request)))
  }

  let guestToken = getCookie(request, GUEST_COOKIE)
  if (!guestToken || !/^[a-f0-9]{64}$/.test(guestToken)) {
    guestToken = randomToken()
    cookies.push(
      serializeCookie(GUEST_COOKIE, guestToken, {
        maxAge: GUEST_COOKIE_TTL_SECONDS,
        secure: isSecure(request),
      }),
    )
  }

  return {
    actor: {
      key: `guest:${await sha256Hex(guestToken)}`,
      authenticated: false,
      user: null,
      bucketKey: 'lifetime',
      period: 'lifetime',
      limit: GUEST_RUN_LIMIT,
      resetAt: null,
    },
    cookies,
  }
}

async function readUsage(
  db: D1Database | D1DatabaseSession,
  actor: UsageActor,
): Promise<UsageRow | null> {
  return db
    .prepare(
      `SELECT request_count, last_request_at
         FROM usage_buckets
        WHERE actor_key = ? AND bucket_key = ?`,
    )
    .bind(actor.key, actor.bucketKey)
    .first<UsageRow>()
}

export async function getUsageStatus(
  request: Request,
  env: UsageEnv,
  now = Date.now(),
): Promise<UsageStatus> {
  const { actor, cookies } = await resolveActor(request, env, now)
  const row = await readUsage(env.DB.withSession('first-primary'), actor)
  return { actor, quota: quotaFromRow(actor, row, now), cookies }
}

export async function authorizeClassify(
  request: Request,
  env: UsageEnv,
  now = Date.now(),
): Promise<UsageSuccess | UsageError> {
  const { actor, cookies } = await resolveActor(request, env, now)
  const session = env.DB.withSession('first-primary')
  const row = await session
    .prepare(RESERVE_USAGE_SQL)
    .bind(actor.key, actor.bucketKey, now, now, now, actor.limit, COOLDOWN_MS)
    .first<UsageRow>()

  if (row) {
    return { ok: true, actor, quota: quotaFromRow(actor, row, now), cookies }
  }

  const quota = quotaFromRow(actor, await readUsage(session, actor), now)
  if (quota.remaining <= 0) {
    if (!actor.authenticated) {
      return {
        ok: false,
        code: 'LOGIN_REQUIRED',
        status: 401,
        message: 'You have used your 3 free runs. Sign in to keep going.',
        quota,
        cookies,
      }
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((new Date(actor.resetAt!).getTime() - now) / 1000),
    )
    return {
      ok: false,
      code: 'DAILY_LIMIT',
      status: 429,
      message: 'You have used today\'s 30 runs. Come back tomorrow.',
      quota,
      retryAfterSeconds,
      cookies,
    }
  }

  const retryAfterSeconds = Math.max(1, quota.retryAfterSeconds)
  return {
    ok: false,
    code: 'RATE_LIMITED',
    status: 429,
    message: `Please wait ${retryAfterSeconds} seconds before running again.`,
    quota,
    retryAfterSeconds,
    cookies,
  }
}

export function userUsageKey(userId: string): string {
  return `user:${userId}`
}
