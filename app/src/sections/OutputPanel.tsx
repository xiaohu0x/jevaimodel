import { ArrowUpRight, CircleCheck, CircleX } from 'lucide-react'
import {
  LESSONS,
  USE_CASES,
  type ClassificationResult,
  type Preset,
  type RunRecord,
} from '@/lib/engine'
import { cn } from '@/lib/utils'
import {
  CameraArt,
  HotdogArt,
  SkyArt,
  UseCaseTile,
} from '@/sections/Illustrations'
import TypeBadge from '@/sections/TypeBadge'
import { TYPE_BAR } from '@/lib/type-style'

const LESSON_ART: Record<string, (p: { className?: string }) => React.ReactNode> = {
  hotdog: HotdogArt,
  sky: SkyArt,
  monkeys: CameraArt,
}

interface OutputPanelProps {
  runs: RunRecord[]
  running: boolean
  pendingQuestions: number
  onLoadPreset: (p: Preset) => void
}

export default function OutputPanel({
  runs,
  running,
  pendingQuestions,
  onLoadPreset,
}: OutputPanelProps) {
  const latest = runs[runs.length - 1]

  if (!running && !latest) {
    return <ExamplesView onLoadPreset={onLoadPreset} />
  }

  return (
    <div className="mx-auto max-w-[620px] px-6 py-8">
      {running && <Thinking count={pendingQuestions} />}

      {latest && !running && (
        <>
          <div className="flex items-baseline gap-3">
            <span className="eyebrow">RESULT</span>
            <span className="text-[11px] text-zinc-400">
              {latest.results.length} {latest.results.length === 1 ? 'answer' : 'answers'} ·{' '}
              {(latest.totalLatencyMs / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {latest.results.map((r) => (
              <ResultCard key={r.questionId} result={r} />
            ))}
          </div>

          <button
            onClick={() => onLoadPreset(LESSONS[0])}
            className="mt-5 text-[11.5px] font-medium text-zinc-400 underline underline-offset-4 hover:text-zinc-700"
          >
            Start from an example instead
          </button>
        </>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Examples                                                         */
/* ---------------------------------------------------------------- */

function ExamplesView({ onLoadPreset }: { onLoadPreset: (p: Preset) => void }) {
  return (
    <div className="mx-auto max-w-[620px] px-6 py-8">
      <div className="eyebrow">EXAMPLE REQUESTS</div>
      <h2 className="mt-2.5 font-display text-[32px] leading-[1.08] font-medium tracking-[-0.015em] text-zinc-900">
        Learn to use JEV AI Model
      </h2>
      <p className="mt-2.5 max-w-[440px] text-[13px] leading-relaxed text-zinc-500">
        Pick a request to load it into the editor, then adjust the state and questions to
        make it your own.
      </p>

      <div className="eyebrow mt-9">WALKTHROUGH LESSONS</div>
      <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
        {LESSONS.map((p) => {
          const Art = LESSON_ART[p.id]
          return (
            <button
              key={p.id}
              onClick={() => onLoadPreset(p)}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/[0.07]"
            >
              <div className="flex h-[88px] items-center justify-center overflow-hidden rounded-xl border border-zinc-100 bg-gradient-to-b from-zinc-50 to-white">
                {Art ? <Art className="h-[70px] w-[70px] transition-transform duration-200 group-hover:scale-[1.06]" /> : null}
              </div>
              <TypeBadge type={p.kind} className="mt-3 self-start" />
              <div className="mt-2 text-[13px] leading-snug font-semibold text-zinc-800">
                {p.title}
              </div>
              <div className="mt-0.5 text-[11.5px] leading-snug text-zinc-400">{p.subtitle}</div>
            </button>
          )
        })}
      </div>

      <div className="eyebrow mt-10">REAL-LIFE USE CASES</div>
      <div className="mt-3.5 space-y-2">
        {USE_CASES.map((p) => (
          <button
            key={p.id}
            onClick={() => onLoadPreset(p)}
            className="group flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3.5 py-3 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50/60"
          >
            <UseCaseTile id={p.id} />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-zinc-800">{p.title}</span>
              <span className="mt-0.5 block truncate text-[11.5px] text-zinc-400">
                {p.subtitle}
              </span>
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-600"
              strokeWidth={2}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Results                                                          */
/* ---------------------------------------------------------------- */

function ResultCard({ result: r }: { result: ClassificationResult }) {
  return (
    <div className="rise-in rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <TypeBadge type={r.type} />
        <span className="truncate font-mono text-[10.5px] text-zinc-400">{r.question}</span>
        <span className="ml-auto shrink-0 font-mono text-[9.5px] text-zinc-300">{r.latencyMs}ms</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {r.type === 'noul' ? (
          <span
            className={cn(
              'flex items-center gap-1.5 font-display text-[22px] font-medium',
              r.answer === 'True' ? 'text-emerald-600' : 'text-rose-500',
            )}
          >
            {r.answer === 'True' ? (
              <CircleCheck className="h-[19px] w-[19px]" strokeWidth={1.8} />
            ) : (
              <CircleX className="h-[19px] w-[19px]" strokeWidth={1.8} />
            )}
            {r.answer}
          </span>
        ) : (
          <span className="font-display text-[22px] font-medium text-zinc-900">{r.answer}</span>
        )}
        <span className="font-mono text-[10.5px] text-zinc-400">{r.confidence}% conf.</span>
      </div>

      {r.breakdown && (
        <div className="mt-4 space-y-1.5">
          {r.breakdown.map((b, i) => {
            const max = r.type === 'choice' ? 100 : Math.max(...r.breakdown!.map((x) => x.value), 1)
            const pct = Math.min(100, (b.value / max) * 100)
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-[10.5px] text-zinc-500">{b.label}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div className={cn('h-full rounded-full', TYPE_BAR[r.type])} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-[9.5px] text-zinc-400">
                  {r.type === 'choice' ? `${b.value}%` : b.value}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-3.5 text-[12px] leading-relaxed text-zinc-500">{r.rationale}</p>
    </div>
  )
}

function Thinking({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2.5 text-[12.5px] text-zinc-400">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      Evaluating {count} {count === 1 ? 'question' : 'questions'}…
    </div>
  )
}
