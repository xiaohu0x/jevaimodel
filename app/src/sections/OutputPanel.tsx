import { useEffect, useRef } from 'react'
import { ArrowUpRight, CircleCheck, CircleX } from 'lucide-react'
import {
  LESSONS,
  PRIMITIVE_META,
  USE_CASES,
  type ClassificationResult,
  type Preset,
  type PrimitiveType,
  type RunRecord,
} from '@/lib/engine'
import { cn } from '@/lib/utils'

const TYPE_TEXT: Record<PrimitiveType, string> = {
  noul: 'text-emerald-700',
  score: 'text-amber-700',
  choice: 'text-sky-700',
}

const BAR: Record<PrimitiveType, string> = {
  noul: 'bg-emerald-500',
  score: 'bg-amber-400',
  choice: 'bg-sky-400',
}

interface OutputPanelProps {
  runs: RunRecord[]
  running: boolean
  pendingQuestions: number
  onLoadPreset: (p: Preset) => void
}

export default function OutputPanel({ runs, running, pendingQuestions, onLoadPreset }: OutputPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [runs.length, running])

  const empty = runs.length === 0 && !running

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      {empty ? (
        <ExamplesView onLoadPreset={onLoadPreset} />
      ) : (
        <div className="mx-auto max-w-[560px] space-y-8 px-6 py-6">
          {runs.map((run) => (
            <RunBlock key={run.id} run={run} />
          ))}
          {running && <ThinkingBlock count={pendingQuestions} />}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Line-art illustrations                                           */
/* ---------------------------------------------------------------- */

function HotdogArt() {
  return (
    <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
      <path d="M14 46c0-9 5-15 12-17l28-8c6-1.7 12 2 12 8.5S62 42 56 43.5L26 52c-7 2-12-1.5-12-6Z" stroke="#a1a1aa" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M18 40c8-2 14-3.5 22-5.5S56 29 60 28.5" stroke="#52525b" strokeWidth="5" strokeLinecap="round" />
      <path d="M24 38.5c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0 4 2.6 6 0" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function SkyArt() {
  return (
    <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
      <circle cx="52" cy="24" r="9" stroke="#a1a1aa" strokeWidth="2.4" />
      <path d="M52 9v4M67 24h-4M64 12l-3 3M40 12l3 3" stroke="#a1a1aa" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 52a9 9 0 0 1 2-17.8A13 13 0 0 1 45 30a10 10 0 0 1 13 9.6A8 8 0 0 1 56 52H18Z" stroke="#52525b" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  )
}

function CameraArt() {
  return (
    <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
      <rect x="10" y="26" width="60" height="36" rx="8" stroke="#52525b" strokeWidth="2.4" />
      <path d="M28 26l4-8h16l4 8" stroke="#52525b" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="40" cy="44" r="11" stroke="#52525b" strokeWidth="2.6" />
      <circle cx="43.5" cy="40.5" r="2" fill="#a1a1aa" />
      <circle cx="60" cy="34" r="2.4" fill="#a1a1aa" />
    </svg>
  )
}

const LESSON_ART: Record<string, () => React.ReactNode> = {
  hotdog: HotdogArt,
  sky: SkyArt,
  monkeys: CameraArt,
}

/* ---------------------------------------------------------------- */
/*  Examples (initial state)                                         */
/* ---------------------------------------------------------------- */

function ExamplesView({ onLoadPreset }: { onLoadPreset: (p: Preset) => void }) {
  return (
    <div className="mx-auto max-w-[560px] px-6 py-10">
      <h1 className="font-serif text-[30px] leading-tight font-medium tracking-[-0.01em] text-zinc-900">
        Learn to Classify
      </h1>
      <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
        Write state as JSON, attach typed questions, and get structured answers.
        Pick a lesson to load it into the editor.
      </p>

      <div className="mt-8 space-y-2">
        {LESSONS.map((p) => {
          const Art = LESSON_ART[p.id]
          return (
            <button
              key={p.id}
              onClick={() => onLoadPreset(p)}
              className="group flex w-full items-center gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition-colors hover:border-zinc-400"
            >
              <span className="shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
                {Art ? <Art /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-zinc-800">{p.title}</span>
                <span className="mt-0.5 block text-[11.5px] text-zinc-400 italic">{p.subtitle}</span>
              </span>
              <span className={cn('text-[10px] font-bold tracking-[0.1em] uppercase', TYPE_TEXT[p.kind])}>
                {PRIMITIVE_META[p.kind].name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="eyebrow mt-10">USE CASES</div>
      <div className="mt-3 divide-y divide-zinc-100 border-y border-zinc-100">
        {USE_CASES.map((p) => (
          <button
            key={p.id}
            onClick={() => onLoadPreset(p)}
            className="group flex w-full items-baseline gap-3 py-3 text-left"
          >
            <span className="text-[12.5px] font-semibold text-zinc-700 group-hover:text-zinc-900">
              {p.title}
            </span>
            <span className="truncate text-[11.5px] text-zinc-400">{p.subtitle}</span>
            <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 self-center text-zinc-300 group-hover:text-zinc-600" strokeWidth={2} />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Run results                                                      */
/* ---------------------------------------------------------------- */

function RunBlock({ run }: { run: RunRecord }) {
  return (
    <div className="rise-in">
      {/* request */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-xl rounded-br-sm bg-zinc-900 px-3.5 py-2.5">
          {run.questions.map((q) => (
            <div key={q.id} className="font-mono text-[11.5px] leading-snug text-zinc-100">
              {q.question || <span className="text-zinc-500 italic">(empty)</span>}
            </div>
          ))}
        </div>
      </div>

      {/* results */}
      <div className="mt-3 space-y-2.5">
        {run.results.map((r) => (
          <ResultCard key={r.questionId} result={r} />
        ))}
      </div>
    </div>
  )
}

function ResultCard({ result: r }: { result: ClassificationResult }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-baseline gap-2">
        <span className={cn('text-[10px] font-bold tracking-[0.1em] uppercase', TYPE_TEXT[r.type])}>
          {PRIMITIVE_META[r.type].name}
        </span>
        <span className="truncate font-mono text-[10.5px] text-zinc-400">{r.question}</span>
        <span className="ml-auto shrink-0 font-mono text-[9.5px] text-zinc-300">
          {r.latencyMs}ms
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        {r.type === 'noul' ? (
          <span
            className={cn(
              'flex items-center gap-1.5 font-serif text-[20px] font-medium',
              r.answer === 'True' ? 'text-emerald-600' : 'text-rose-500',
            )}
          >
            {r.answer === 'True' ? (
              <CircleCheck className="h-[18px] w-[18px]" strokeWidth={1.8} />
            ) : (
              <CircleX className="h-[18px] w-[18px]" strokeWidth={1.8} />
            )}
            {r.answer}
          </span>
        ) : (
          <span className="font-serif text-[20px] font-medium text-zinc-900">{r.answer}</span>
        )}
        <span className="font-mono text-[10.5px] text-zinc-400">{r.confidence}% conf.</span>
      </div>

      {r.breakdown && (
        <div className="mt-3 space-y-1.5">
          {r.breakdown.map((b, i) => {
            const max =
              r.type === 'choice' ? 100 : Math.max(...r.breakdown!.map((x) => x.value), 1)
            const pct = Math.min(100, (b.value / max) * 100)
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-[10.5px] text-zinc-500">
                  {b.label}
                </span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={cn('h-full rounded-full', BAR[r.type])}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-[9.5px] text-zinc-400">
                  {r.type === 'choice' ? `${b.value}%` : b.value}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-3 text-[11.5px] leading-relaxed text-zinc-500">{r.rationale}</p>
    </div>
  )
}

function ThinkingBlock({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2.5 text-[11.5px] text-zinc-400">
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
