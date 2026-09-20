import { ArrowRight } from 'lucide-react'
import type { AccountUser } from '@/lib/useAccount'
import type { RunRecord } from '@/lib/engine'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Home                                                               */
/* ------------------------------------------------------------------ */

export function HomePage({
  user,
  runs,
  onOpenPlayground,
}: {
  user: AccountUser | null
  runs: RunRecord[]
  onOpenPlayground: () => void
}) {
  const totalAnswers = runs.reduce((a, r) => a + r.results.length, 0)
  return (
    <div className="mx-auto max-w-[640px] px-8 py-12">
      <h1 className="font-serif text-[34px] leading-[1.15] font-medium tracking-[-0.01em] text-zinc-900">
        {user
          ? `Welcome back, ${user.name.split(' ')[0]}.`
          : 'Structured answers from messy context.'}
      </h1>
      <p className="mt-3 text-[13.5px] leading-relaxed text-zinc-500">
        Describe the world as JSON state, ask typed questions — Noul, Score, Choice —
        and get grounded answers with confidence scores.
      </p>

      <button
        onClick={onOpenPlayground}
        className="btn-ink group mt-7 flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold"
      >
        Open Playground
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
      </button>

      <div className="mt-12 flex gap-10 border-t border-zinc-100 pt-6">
        <Stat label="Runs this session" value={String(runs.length)} />
        <Stat label="Answers produced" value={String(totalAnswers)} />
      </div>

      <div className="mt-12 space-y-5">
        {[
          {
            name: 'Noul',
            tint: 'text-emerald-700',
            desc: 'Evaluate how true something is — true/false with confidence and rationale.',
          },
          {
            name: 'Score',
            tint: 'text-amber-700',
            desc: 'Grade against your own rubric, with a per-dimension breakdown.',
          },
          {
            name: 'Choice',
            tint: 'text-sky-700',
            desc: 'Pick from your options, with the full probability distribution.',
          },
        ].map((c) => (
          <div key={c.name} className="flex items-baseline gap-4">
            <span className={cn('w-16 shrink-0 text-[13px] font-bold', c.tint)}>{c.name}</span>
            <p className="text-[12.5px] leading-relaxed text-zinc-500">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mt-1.5 font-serif text-[22px] font-medium text-zinc-900">{value}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Usage                                                              */
/* ------------------------------------------------------------------ */

export function UsagePage({ runs }: { runs: RunRecord[] }) {
  const byType = runs
    .flatMap((r) => r.results)
    .reduce<Record<string, number>>((acc, r) => {
      acc[r.type] = (acc[r.type] ?? 0) + 1
      return acc
    }, {})
  return (
    <div className="mx-auto max-w-[560px] px-8 py-12">
      <h1 className="font-serif text-[28px] font-medium tracking-[-0.01em] text-zinc-900">Usage</h1>

      <div className="mt-8 flex gap-10">
        <Stat label="Noul answers" value={String(byType.noul ?? 0)} />
        <Stat label="Score answers" value={String(byType.score ?? 0)} />
        <Stat label="Choice answers" value={String(byType.choice ?? 0)} />
      </div>

      {runs.length > 0 ? (
        <div className="mt-10">
          <div className="eyebrow">RECENT RUNS</div>
          <div className="mt-3 divide-y divide-zinc-100 border-y border-zinc-100">
            {[...runs].reverse().slice(0, 8).map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2.5">
                <span className="font-mono text-[10.5px] text-zinc-400">{r.id}</span>
                <span className="text-[11.5px] text-zinc-600">
                  {r.results.length} {r.results.length === 1 ? 'answer' : 'answers'}
                </span>
                <span className="ml-auto font-mono text-[10.5px] text-zinc-400">
                  {(r.totalLatencyMs / 1000).toFixed(1)}s
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-10 text-[12px] text-zinc-400">
          Nothing yet — activity from the Playground shows up here.
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Docs                                                               */
/* ------------------------------------------------------------------ */

export function DocsPage() {
  const sections = [
    {
      title: 'Concepts',
      body: 'A request pairs state (a JSON object describing the world) with one or more typed questions. Classify evaluates every question strictly against the state you provide.',
    },
    {
      title: 'Noul — truth evaluation',
      body: 'Noul answers how true a proposition is: true or false, a confidence percentage, and a rationale anchored to specific state keys.',
    },
    {
      title: 'Score — rubric grading',
      body: 'Score grades a subject against your rubric on a 0–max scale, with a per-dimension breakdown.',
    },
    {
      title: 'Choice — multiple choice',
      body: 'Choice selects the best option from the set you provide and returns the probability distribution across all options.',
    },
    {
      title: 'Referencing state',
      body: 'Use `backticks` inside a question to reference a state key, e.g. "Is `food` a sandwich?". References make questions reusable across states.',
    },
  ]
  return (
    <div className="mx-auto max-w-[560px] px-8 py-12">
      <h1 className="font-serif text-[28px] font-medium tracking-[-0.01em] text-zinc-900">
        How Classify works
      </h1>
      <div className="mt-8 space-y-6">
        {sections.map((s, i) => (
          <div key={s.title} className="flex gap-4">
            <span className="shrink-0 font-mono text-[11px] text-zinc-300">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-[13px] font-bold text-zinc-800">{s.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
