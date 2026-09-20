import {
  type Answer,
  type ChoiceAnswer,
  type ClassificationResult,
  type NoulAnswer,
  type PrimitiveType,
  type RunRecord,
  type ScoreAnswer,
} from '@/lib/engine'
import { cn } from '@/lib/utils'
import TypeBadge from '@/sections/TypeBadge'
import NextSteps from '@/sections/NextSteps'
import { TYPE_BAR } from '@/lib/type-style'

interface OutputPanelProps {
  runs: RunRecord[]
  running: boolean
  pendingQuestions: number
  contextKeys: string[]
  onAddQuestion: (t: PrimitiveType) => void
  onFocusContext: () => void
}

export default function OutputPanel({
  runs,
  running,
  pendingQuestions,
  contextKeys,
  onAddQuestion,
  onFocusContext,
}: OutputPanelProps) {
  const latest = runs[runs.length - 1]
  if (!running && !latest) return null

  return (
    <div>
      {running && <Thinking count={pendingQuestions} />}

      {latest && !running && (
        <>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-zinc-400 uppercase">
              Result
            </span>
            <span className="text-[14px] text-zinc-400">
              {latest.results.length} {latest.results.length === 1 ? 'answer' : 'answers'} ·{' '}
              {(latest.totalLatencyMs / 1000).toFixed(2)}s ·{' '}
              <span className="font-mono text-[12.5px]">{latest.model}</span>
              {latest.usage?.input_tokens ? (
                <span className="font-mono text-[12.5px] text-zinc-300">
                  {' '}
                  · {latest.usage.input_tokens}+{latest.usage.output_tokens} tok
                </span>
              ) : null}
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {latest.results.map((r) => (
              <ResultCard key={r.questionId} result={r} />
            ))}
          </div>

          <NextSteps
            run={latest}
            contextKeys={contextKeys}
            onAddQuestion={onAddQuestion}
            onFocusContext={onFocusContext}
          />
        </>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Results — one card shape per primitive                           */
/* ---------------------------------------------------------------- */

function ResultCard({ result: r }: { result: ClassificationResult }) {
  return (
    <div className="rise-in flex flex-col rounded-2xl border border-zinc-900/15 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-2.5">
        <TypeBadge type={r.question.type} />
        <span className="min-w-0 flex-1 text-[13px] leading-snug text-zinc-500">
          {r.question.instructions}
        </span>
      </div>

      <div className="mt-5">
        <AnswerBody answer={r.answer} />
      </div>
    </div>
  )
}

function AnswerBody({ answer }: { answer: Answer }) {
  if (answer.type === 'noul') return <NoulBody a={answer} />
  if (answer.type === 'choice') return <ChoiceBody a={answer} />
  return <ScoreBody a={answer} />
}

/* ---------------------------------------------------------------- */

/**
 * A Noul is one number carrying both the answer and the certainty: near 1 is a
 * strong yes, near 0 a strong no, and 0.5 means the model genuinely cannot
 * tell. Showing it as True/False would throw away exactly that information.
 */
function NoulBody({ a }: { a: NoulAnswer }) {
  const pct = Math.round(a.noul * 100)
  const leaning = a.noul >= 0.65 ? 'yes' : a.noul <= 0.35 ? 'no' : 'uncertain'
  const tone =
    leaning === 'yes'
      ? 'text-emerald-600'
      : leaning === 'no'
        ? 'text-rose-500'
        : 'text-amber-600'

  return (
    <div>
      <div className="flex items-end gap-3">
        <span
          className={cn(
            'font-display text-[44px] leading-none font-medium tracking-[-0.03em] sm:text-[52px]',
            tone,
          )}
        >
          {a.noul.toFixed(2)}
        </span>
        <span className="pb-1.5 text-[14px] text-zinc-500">
          {leaning === 'yes' ? 'likely true' : leaning === 'no' ? 'likely false' : 'genuinely unsure'}
        </span>
      </div>

      {/* the scale is the point: 0 ..... 0.5 ..... 1 */}
      <div className="relative mt-5 h-2 rounded-full bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100">
        <span
          aria-hidden
          className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900"
          style={{ left: `${Math.min(100, Math.max(0, pct))}%` }}
        />
        <span aria-hidden className="absolute left-1/2 h-2 w-px bg-white/70" />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] tracking-[0.1em] text-zinc-400 uppercase">
        <span>No · 0</span>
        <span>Unsure · .5</span>
        <span>Yes · 1</span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function ChoiceBody({ a }: { a: ChoiceAnswer }) {
  const entries = Object.entries(a.probabilities).sort((x, y) => y[1] - x[1])

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <span className="font-display text-[34px] leading-none font-medium tracking-[-0.03em] break-all text-zinc-900 sm:text-[40px]">
            {a.choice}
          </span>
          <p className="mt-2 font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
            Choice
          </p>
        </div>
        <ConfidencePill value={a.confidence} />
      </div>

      <div className="mt-5 space-y-2">
        {entries.map(([label, p]) => (
          <ProbRow key={label} label={label} value={p} winner={label === a.choice} type="choice" />
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function ScoreBody({ a }: { a: ScoreAnswer }) {
  const keys = Object.keys(a.legend).sort((x, y) => Number(x) - Number(y))
  const top = keys.length - 1
  const nearest = String(Math.round(a.score))

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div>
          <span className="font-display text-[44px] leading-none font-medium tracking-[-0.03em] text-zinc-900 sm:text-[52px]">
            {a.score.toFixed(2)}
          </span>
          <span className="ml-1 font-display text-[22px] text-zinc-400">/ {top}</span>
          <p className="mt-2 font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
            {a.legend[nearest] ? `Closest to “${a.legend[nearest]}”` : 'Score'}
          </p>
        </div>
        <ConfidencePill value={a.confidence} />
      </div>

      <div className="mt-5 space-y-2">
        {keys.map((k) => (
          <ProbRow
            key={k}
            label={`${k} · ${a.legend[k]}`}
            value={a.probabilities[k] ?? 0}
            winner={k === nearest}
            type="score"
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function ConfidencePill({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const low = value < 0.5
  return (
    <div>
      <span
        className={cn(
          'font-display text-[26px] leading-none font-medium tracking-[-0.03em]',
          low ? 'text-amber-600' : 'text-zinc-900',
        )}
      >
        {pct}
        <span className="text-[16px] text-zinc-400">%</span>
      </span>
      <p className="mt-2 font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
        Confidence{low ? ' · low' : ''}
      </p>
    </div>
  )
}

function ProbRow({
  label,
  value,
  winner,
  type,
}: {
  label: string
  value: number
  winner: boolean
  type: PrimitiveType
}) {
  const pct = Math.round(value * 1000) / 10
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'w-36 shrink-0 truncate text-[12.5px]',
          winner ? 'font-medium text-zinc-900' : 'text-zinc-500',
        )}
        title={label}
      >
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={cn('h-full rounded-full', winner ? TYPE_BAR[type] : 'bg-zinc-300')}
          style={{ width: `${Math.max(pct, 0)}%` }}
        />
      </div>
      <span className="w-11 shrink-0 text-right font-mono text-[11px] text-zinc-400">{pct}%</span>
    </div>
  )
}

function Thinking({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-3 text-[15px] text-zinc-400">
      <span className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-zinc-300"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      Asking Jev {count} {count === 1 ? 'question' : 'questions'}…
    </div>
  )
}
