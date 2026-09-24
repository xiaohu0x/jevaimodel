/** Limits and contracts shared by the editor and the paid API proxy. */
export const LIMITS = { questions: 8, state: 8_000, instructions: 600, criteria: 10, key: 64, description: 600, bodyBytes: 262_144 } as const

export interface ApiQuestion {
  type: 'noul' | 'score' | 'choice'
  instructions: string
  criteria?: Record<string, string> | string[]
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function validateRequest(body: unknown):
  | { ok: true; state: unknown; questions: Record<string, ApiQuestion> }
  | { ok: false; error: string } {
  if (!isRecord(body)) return { ok: false, error: 'Body must be an object.' }
  const { state, questions } = body
  if (state === null || !['string', 'object'].includes(typeof state) || typeof state === 'string' && !state.trim()) {
    return { ok: false, error: 'Add context as text, a JSON object, or an array.' }
  }
  if (JSON.stringify(state).length > LIMITS.state) return { ok: false, error: `Context is too large (max ${LIMITS.state} characters).` }
  if (!isRecord(questions)) return { ok: false, error: 'Questions must be keyed by id.' }
  const entries = Object.entries(questions)
  if (!entries.length || entries.length > LIMITS.questions) return { ok: false, error: `Use between 1 and ${LIMITS.questions} questions.` }
  const clean: [string, ApiQuestion][] = []
  for (const [id, raw] of entries) {
    if (!id || id.length > LIMITS.key || !isRecord(raw)) return { ok: false, error: 'A question is malformed.' }
    if (raw.type !== 'noul' && raw.type !== 'score' && raw.type !== 'choice') return { ok: false, error: 'Choose a supported question type.' }
    if (typeof raw.instructions !== 'string' || !raw.instructions.trim() || raw.instructions.length > LIMITS.instructions) {
      return { ok: false, error: `Each question needs instructions of at most ${LIMITS.instructions} characters.` }
    }
    const question: ApiQuestion = { type: raw.type, instructions: raw.instructions.trim() }
    if (raw.type === 'choice') {
      if (!isRecord(raw.criteria)) return { ok: false, error: 'Choice questions need named options.' }
      const options = Object.entries(raw.criteria)
      if (options.length < 2 || options.length > LIMITS.criteria || options.some(([key, value]) =>
        !key.trim() || key.trim().length > LIMITS.key || typeof value !== 'string' || !value.trim() || value.length > LIMITS.description)) {
        return { ok: false, error: `Fill in 2–${LIMITS.criteria} options, with names up to ${LIMITS.key} and descriptions up to ${LIMITS.description} characters.` }
      }
      if (new Set(options.map(([key]) => key.trim())).size !== options.length) return { ok: false, error: 'Choice option names must be unique.' }
      question.criteria = Object.fromEntries(options.map(([key, value]) => [key.trim(), (value as string).trim()]))
    }
    if (raw.type === 'score') {
      const levels = raw.criteria
      if (!Array.isArray(levels) || levels.length < 2 || levels.length > LIMITS.criteria || levels.some((level) =>
        typeof level !== 'string' || !level.trim() || level.length > LIMITS.description)) {
        return { ok: false, error: `Fill in 2–${LIMITS.criteria} score levels, each at most ${LIMITS.description} characters.` }
      }
      question.criteria = levels.map((level: string) => level.trim())
    }
    clean.push([id, question])
  }
  return { ok: true, state, questions: Object.fromEntries(clean) }
}

function probability(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
}

/** Reject missing or malformed answers; never silently drop a paid question. */
export function validAnswers(questions: Record<string, ApiQuestion>, answers: unknown): boolean {
  if (!isRecord(answers)) return false
  return Object.entries(questions).every(([id, question]) => {
    const answer = answers[id]
    if (!Object.hasOwn(answers, id) || !isRecord(answer) || answer.type !== question.type) return false
    if (answer.type === 'noul') return probability(answer.noul)
    if (!probability(answer.confidence) || !isRecord(answer.probabilities)) return false
    const probabilities = Object.entries(answer.probabilities)
    if (!probabilities.length || !probabilities.every(([, value]) => probability(value))) return false
    if (answer.type === 'choice') {
      const keys = Object.keys(question.criteria ?? {})
      return typeof answer.choice === 'string' && keys.includes(answer.choice)
        && keys.every((key) => Object.hasOwn(answer.probabilities as object, key))
    }
    const count = (question.criteria as string[]).length
    return typeof answer.score === 'number' && Number.isFinite(answer.score) && answer.score >= 0 && answer.score <= count - 1
      && isRecord(answer.legend) && Array.from({ length: count }, (_, i) => String(i)).every((key) =>
        typeof (answer.legend as Record<string, unknown>)[key] === 'string' && Object.hasOwn(answer.probabilities as object, key))
  })
}
