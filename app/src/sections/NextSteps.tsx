import { type PrimitiveType, type RunRecord } from '@/lib/engine'
import { formatMessage } from '@/lib/locale'
import { TYPE_DOT } from '@/lib/type-style'
import { useLocale } from '@/lib/useLocale'
import { cn } from '@/lib/utils'

interface NextStepsProps {
  run: RunRecord
  /** Field names in the current context, used to suggest a concrete tweak. */
  contextKeys: string[]
  onAddQuestion: (t: PrimitiveType) => void
  onFocusContext: () => void
}

/**
 * A result is a dead end unless it suggests what to try next. These are the
 * two moves that teach the model's behaviour fastest: change one fact and see
 * the answer move, or ask the same context a differently-typed question.
 */
export default function NextSteps({
  run,
  contextKeys,
  onAddQuestion,
  onFocusContext,
}: NextStepsProps) {
  const { copy } = useLocale()
  const used = new Set(run.results.map((r) => r.question.type))
  const unused = (['noul', 'score', 'choice'] as PrimitiveType[]).filter((t) => !used.has(t))
  const tweakKey = contextKeys[0]

  if (!tweakKey && !unused.length) return null

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-5">
      <p className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
        {copy.next.title}
      </p>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {tweakKey && (
          <button
            onClick={onFocusContext}
            className="group flex items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-left transition-colors hover:border-zinc-900"
          >
            <span className="text-[15px] text-zinc-700">
              {formatMessage(copy.next.changeAndRun, { field: tweakKey })}
            </span>
            <span className="font-mono text-[11px] text-zinc-400 group-hover:text-zinc-600">
              {copy.next.seeMove}
            </span>
          </button>
        )}

        {unused.map((t) => {
          const m = copy.primitives[t]
          return (
            <button
              key={t}
              onClick={() => onAddQuestion(t)}
              className="group flex items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-left transition-colors hover:border-zinc-900"
            >
              <span className={cn('h-2 w-2 shrink-0 rounded-full', TYPE_DOT[t])} />
              <span className="text-[15px] text-zinc-700">
                {formatMessage(copy.next.alsoAsk, { question: m.ask })}
              </span>
              <span className="font-mono text-[11px] text-zinc-400 group-hover:text-zinc-600">
                {m.answerShape}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
