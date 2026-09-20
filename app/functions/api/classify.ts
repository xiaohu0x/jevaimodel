/**
 * Server-side proxy to the TypeSafe System One API.
 *
 * The API key is a Cloudflare secret and must never reach the browser, so the
 * playground calls this route instead of api.typesafe.ai directly. The caps
 * below are enforced here rather than in the UI: the client-side run counter
 * is trivially bypassable, and every call downstream costs real money.
 */

import { authorizeClassify, type QuotaSnapshot, type UsageEnv } from './_usage'

const UPSTREAM = 'https://api.typesafe.ai/v1/systemone'
const DEFAULT_MODEL = 'jev-latest'

/** Guard rails on a publicly reachable route that spends a paid API key. */
const MAX_QUESTIONS = 8
const MAX_STATE_CHARS = 8_000
const MAX_INSTRUCTION_CHARS = 600
const MAX_CRITERIA = 10
const UPSTREAM_TIMEOUT_MS = 30_000

interface Env extends UsageEnv {
  TYPESAFE_API_KEY?: string
  TYPESAFE_MODEL?: string
}

type QuestionType = 'noul' | 'choice' | 'score'

interface IncomingQuestion {
  type: QuestionType
  instructions: string
  /** choice: {key: description}. score: ordered level descriptions. */
  criteria?: Record<string, string> | string[]
}

function json(
  data: unknown,
  status = 200,
  headers: HeadersInit = {},
  cookies: string[] = [],
): Response {
  const responseHeaders = new Headers(headers)
  responseHeaders.set('Content-Type', 'application/json; charset=utf-8')
  responseHeaders.set('Cache-Control', 'no-store')
  for (const cookie of cookies) responseHeaders.append('Set-Cookie', cookie)

  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders,
  })
}

function bad(message: string): Response {
  return json({ error: message }, 400)
}

function usageErrorResponse(
  error: {
    code: string
    status: number
    message: string
    quota?: QuotaSnapshot
    retryAfterSeconds?: number
    cookies: string[]
  },
): Response {
  const headers = new Headers()
  if (error.retryAfterSeconds) headers.set('Retry-After', String(error.retryAfterSeconds))
  return json(
    { error: error.message, code: error.code, quota: error.quota },
    error.status,
    headers,
    error.cookies,
  )
}

/** Rejects anything malformed before it can reach the paid upstream. */
function validate(body: unknown):
  | { ok: true; state: unknown; questions: Record<string, IncomingQuestion> }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Body must be an object.' }

  const { state, questions } = body as { state?: unknown; questions?: unknown }

  // State may be a string, object, or array of text — but never unbounded.
  if (state === undefined || state === null) return { ok: false, error: 'Missing state.' }
  const stateSize = JSON.stringify(state)?.length ?? 0
  if (stateSize > MAX_STATE_CHARS) {
    return { ok: false, error: `State is too large (max ${MAX_STATE_CHARS} characters).` }
  }

  if (!questions || typeof questions !== 'object' || Array.isArray(questions)) {
    return { ok: false, error: 'questions must be an object keyed by question id.' }
  }

  const entries = Object.entries(questions as Record<string, unknown>)
  if (!entries.length) return { ok: false, error: 'Ask at least one question.' }
  if (entries.length > MAX_QUESTIONS) {
    return { ok: false, error: `Too many questions (max ${MAX_QUESTIONS}).` }
  }

  const clean: Record<string, IncomingQuestion> = {}
  for (const [id, raw] of entries) {
    if (!raw || typeof raw !== 'object') return { ok: false, error: `Question "${id}" is malformed.` }
    const q = raw as Partial<IncomingQuestion>

    if (q.type !== 'noul' && q.type !== 'choice' && q.type !== 'score') {
      return { ok: false, error: `Question "${id}" has an unknown type.` }
    }
    if (typeof q.instructions !== 'string' || !q.instructions.trim()) {
      return { ok: false, error: `Question "${id}" needs instructions.` }
    }
    if (q.instructions.length > MAX_INSTRUCTION_CHARS) {
      return { ok: false, error: `Question "${id}" is too long.` }
    }

    const out: IncomingQuestion = { type: q.type, instructions: q.instructions.trim() }

    if (q.type === 'choice') {
      const c = q.criteria
      if (!c || Array.isArray(c) || typeof c !== 'object') {
        return { ok: false, error: `Choice question "${id}" needs options.` }
      }
      const opts = Object.entries(c).filter(([k, v]) => k.trim() && typeof v === 'string')
      if (opts.length < 2) return { ok: false, error: `Choice question "${id}" needs 2+ options.` }
      if (opts.length > MAX_CRITERIA) {
        return { ok: false, error: `Choice question "${id}" has too many options.` }
      }
      out.criteria = Object.fromEntries(opts.map(([k, v]) => [k.trim(), String(v).trim()]))
    }

    if (q.type === 'score') {
      const c = q.criteria
      if (!Array.isArray(c)) return { ok: false, error: `Score question "${id}" needs levels.` }
      const levels = c.filter((l) => typeof l === 'string' && l.trim()).map((l) => l.trim())
      if (levels.length < 2) return { ok: false, error: `Score question "${id}" needs 2+ levels.` }
      if (levels.length > MAX_CRITERIA) {
        return { ok: false, error: `Score question "${id}" has too many levels.` }
      }
      out.criteria = levels
    }

    clean[id] = out
  }

  return { ok: true, state, questions: clean }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const request = context.request
  const env = context.env
  const key = env.TYPESAFE_API_KEY?.trim()
  if (!key) {
    // Configuration problem, not a user problem — say so without leaking detail.
    return json({ error: 'The classifier is not configured on this deployment.' }, 503)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return bad('Request body must be valid JSON.')
  }

  const parsed = validate(body)
  if (!parsed.ok) return bad(parsed.error)

  let authorization: Awaited<ReturnType<typeof authorizeClassify>>
  try {
    authorization = await authorizeClassify(request, env)
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'classify_guard_error',
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    return json({ error: 'The classifier request guard is temporarily unavailable.' }, 503)
  }
  if (!authorization.ok) return usageErrorResponse(authorization)

  const started = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  let upstream: Response
  try {
    upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: parsed.state,
        model: env.TYPESAFE_MODEL?.trim() || DEFAULT_MODEL,
        questions: parsed.questions,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    const aborted = err instanceof Error && err.name === 'AbortError'
    console.error(
      JSON.stringify({
        event: 'classify_upstream_error',
        authenticated: authorization.actor.authenticated,
        questionCount: Object.keys(parsed.questions).length,
        error: aborted ? 'timeout' : err instanceof Error ? err.message : String(err),
      }),
    )
    return json(
      {
        error: aborted ? 'The classifier timed out.' : 'Could not reach the classifier.',
        code: aborted ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE',
        quota: authorization.quota,
      },
      504,
      {},
      authorization.cookies,
    )
  }
  clearTimeout(timer)

  const text = await upstream.text()

  if (!upstream.ok) {
    // Surface the status so the UI can explain rate limits or bad input,
    // but never echo headers or anything that could carry the key back.
    let detail = ''
    try {
      const parsedErr = JSON.parse(text) as { error?: unknown; message?: unknown }
      const raw = parsedErr.error ?? parsedErr.message
      if (typeof raw === 'string') detail = raw.slice(0, 200)
    } catch {
      /* upstream did not return JSON */
    }
    const retryAfter = upstream.headers.get('Retry-After')
    const retryAfterSeconds = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) : undefined
    return json(
      {
        error:
          upstream.status === 429
            ? 'Rate limited by the classifier — try again in a moment.'
            : detail || 'The classifier rejected this request.',
        code: upstream.status === 429 ? 'UPSTREAM_RATE_LIMITED' : 'UPSTREAM_REJECTED',
        status: upstream.status,
        quota: authorization.quota,
      },
      upstream.status === 429 ? 429 : 502,
      retryAfterSeconds ? { 'Retry-After': String(retryAfterSeconds) } : {},
      authorization.cookies,
    )
  }

  let payload: unknown
  try {
    payload = JSON.parse(text)
  } catch {
    return json(
      {
        error: 'The classifier returned an unreadable response.',
        code: 'UPSTREAM_INVALID_RESPONSE',
        quota: authorization.quota,
      },
      502,
      {},
      authorization.cookies,
    )
  }

  const { model, answers, usage } = (payload ?? {}) as {
    model?: unknown
    answers?: unknown
    usage?: unknown
  }
  if (!answers || typeof answers !== 'object') {
    return json(
      {
        error: 'The classifier returned no answers.',
        code: 'UPSTREAM_INVALID_RESPONSE',
        quota: authorization.quota,
      },
      502,
      {},
      authorization.cookies,
    )
  }

  const latencyMs = Date.now() - started
  const tokenUsage =
    usage && typeof usage === 'object' ? (usage as Record<string, unknown>) : {}
  console.log(
    JSON.stringify({
      event: 'classify_complete',
      authenticated: authorization.actor.authenticated,
      questionCount: Object.keys(parsed.questions).length,
      inputTokens:
        typeof tokenUsage.input_tokens === 'number' ? tokenUsage.input_tokens : undefined,
      outputTokens:
        typeof tokenUsage.output_tokens === 'number' ? tokenUsage.output_tokens : undefined,
      latencyMs,
    }),
  )

  return json(
    { model, answers, usage, latencyMs, quota: authorization.quota },
    200,
    {},
    authorization.cookies,
  )
}
