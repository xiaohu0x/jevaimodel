import { CircleCheck, CircleX } from 'lucide-react'
import { type ClassificationResult, type RunRecord } from '@/lib/engine'
import { cn } from '@/lib/utils'
import TypeBadge from '@/sections/TypeBadge'
import { TYPE_BAR } from '@/lib/type-style'

interface OutputPanelProps {
  runs: RunRecord[]
  running: boolean
  pendingQuestions: number
}

export default function OutputPanel({ runs, running, pendingQuestions }: OutputPanelProps) {
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
              {(latest.totalLatencyMs / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {latest.results.map((r) => (
              <ResultCard key={r.questionId} result={r} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Results                                                          */
/* ---------------------------------------------------------------- */

function ResultCard({ result: r }: { result: ClassificationResult }) {
  return (
    <div className="rise-in rounded-2xl border border-zinc-900/15 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <TypeBadge type={r.type} />
        <span className="truncate font-mono text-[12px] text-zinc-400">{r.question}</span>
        <span className="ml-auto shrink-0 font-mono text-[11px] text-zinc-300">{r.latencyMs}ms</span>
      </div>

      {/* big-number treatment: answer as display type, confidence alongside */}
      <div className="mt-5 flex flex-wrap items-end gap-x-7 gap-y-3">
        <div>
          {r.type === 'noul' ? (
            <span
              className={cn(
                'flex items-center gap-2.5 font-display text-[40px] leading-none font-medium tracking-[-0.03em] sm:text-[48px]',
                r.answer === 'True' ? 'text-emerald-600' : 'text-rose-500',
              )}
            >
              {r.answer === 'True' ? (
                <CircleCheck className="h-8 w-8 shrink-0" strokeWidth={1.8} />
              ) : (
                <CircleX className="h-8 w-8 shrink-0" strokeWidth={1.8} />
              )}
              {r.answer}
            </span>
          ) : (
            <span className="font-display text-[40px] leading-none font-medium tracking-[-0.03em] text-zinc-900 sm:text-[48px]">
              {r.answer}
            </span>
          )}
          <p className="mt-2 font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
            Answer
          </p>
        </div>

        <div>
          <span className="font-display text-[32px] leading-none font-medium tracking-[-0.03em] text-zinc-900">
            {r.confidence}
            <span className="text-[20px] text-zinc-400">%</span>
          </span>
          <p className="mt-2 font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
            Confidence
          </p>
        </div>
      </div>

      {r.breakdown && (
        <div className="mt-6 space-y-2">
          {r.breakdown.map((b, i) => {
            const max = r.type === 'choice' ? 100 : Math.max(...r.breakdown!.map((x) => x.value), 1)
            const pct = Math.min(100, (b.value / max) * 100)
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-[12.5px] text-zinc-500">{b.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div className={cn('h-full rounded-full', TYPE_BAR[r.type])} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-[11px] text-zinc-400">
                  {r.type === 'choice' ? `${b.value}%` : b.value}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-5 border-t border-zinc-100 pt-4 text-[14px] leading-[1.65] text-zinc-500">
        {r.rationale}
      </p>
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
      Evaluating {count} {count === 1 ? 'question' : 'questions'}…
    </div>
  )
}
