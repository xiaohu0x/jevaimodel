import { DEFAULT_STATE, toApiQuestion, type Question, type RunRecord } from './engine.ts'
import { isRecord, LIMITS, validAnswers, type ApiQuestion } from '../../shared/classification.ts'

export const DRAFT_KEY = 'jev.draft.v1'
export interface PlaygroundDraft { state: string; questions: Question[]; runs: RunRecord[] }
export function emptyDraft(): PlaygroundDraft { return { state: DEFAULT_STATE, questions: [], runs: [] } }

function isQuestion(value: unknown): value is Question {
  return isRecord(value) && typeof value.id === 'string' && typeof value.instructions === 'string'
    && ['noul', 'score', 'choice'].includes(String(value.type))
    && (value.levels === undefined || Array.isArray(value.levels) && value.levels.length <= LIMITS.criteria && value.levels.every((level) => typeof level === 'string'))
    && (value.options === undefined || Array.isArray(value.options) && value.options.length <= LIMITS.criteria && value.options.every((option) =>
      isRecord(option) && typeof option.key === 'string' && typeof option.description === 'string'))
}

function isRun(value: unknown): value is RunRecord {
  return isRecord(value) && typeof value.id === 'string' && typeof value.state === 'string'
    && typeof value.model === 'string' && typeof value.startedAt === 'number' && Number.isFinite(value.startedAt)
    && typeof value.totalLatencyMs === 'number' && Number.isFinite(value.totalLatencyMs)
    && Array.isArray(value.results) && value.results.length <= LIMITS.questions && value.results.every((result) =>
      isRecord(result) && typeof result.questionId === 'string' && isQuestion(result.question)
      && validAnswers({ [result.questionId]: toApiQuestion(result.question) as unknown as ApiQuestion }, { [result.questionId]: result.answer }))
}

export function readDraft(storage: Pick<Storage, 'getItem'>): PlaygroundDraft | null {
  try {
    const raw = storage.getItem(DRAFT_KEY)
    if (!raw || raw.length > 1_000_000) return null
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || value.version !== 1 || typeof value.state !== 'string'
      || !Array.isArray(value.questions) || value.questions.length > LIMITS.questions
      || !value.questions.every(isQuestion)
      || new Set(value.questions.map((question) => question.id)).size !== value.questions.length) return null
    const latest = Array.isArray(value.runs) ? value.runs.at(-1) : null
    return { state: value.state, questions: value.questions, runs: isRun(latest) ? [latest] : [] }
  } catch { return null }
}

export function saveDraft(storage: Pick<Storage, 'setItem'>, draft: PlaygroundDraft): boolean {
  try {
    storage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, ...draft, runs: draft.runs.slice(-1) }))
    return true
  } catch { return false }
}
