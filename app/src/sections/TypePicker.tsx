import { PRIMITIVE_META, type PrimitiveType } from '@/lib/engine'
import { TYPE_DOT } from '@/lib/type-style'
import { cn } from '@/lib/utils'

const TYPES: PrimitiveType[] = ['noul', 'score', 'choice']

interface TypePickerProps {
  onAdd: (t: PrimitiveType) => void
  /** Compact row used once questions exist; the full cards teach first-timers. */
  compact?: boolean
}

/**
 * The three primitives differ in one way that matters to a newcomer: the shape
 * of the answer you get back. Leading with that — and with the plain question
 * a person actually has — turns "what is a Noul" into "I want a yes or no".
 */
export default function TypePicker({ onAdd, compact = false }: TypePickerProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
          Add
        </span>
        {TYPES.map((t) => {
          const m = PRIMITIVE_META[t]
          return (
            <button
              key={t}
              onClick={() => onAdd(t)}
              title={`${m.ask} → ${m.answerShape}`}
              className="flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', TYPE_DOT[t])} />
              {m.name}
              <span className="font-normal text-zinc-400">{m.ask}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {TYPES.map((t) => {
        const m = PRIMITIVE_META[t]
        return (
          <button
            key={t}
            onClick={() => onAdd(t)}
            className="group flex flex-col rounded-xl border border-zinc-300 bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-md hover:shadow-zinc-900/[0.06]"
          >
            <div className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', TYPE_DOT[t])} />
              <span className="font-mono text-[10.5px] font-bold tracking-[0.1em] text-zinc-900 uppercase">
                {m.name}
              </span>
            </div>

            <span className="mt-2.5 text-[16px] leading-tight font-medium text-zinc-900">
              {m.ask}
            </span>

            <span className="mt-3 font-mono text-[10px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
              You get
            </span>
            <span className="mt-1 font-display text-[19px] leading-none font-medium tracking-[-0.02em] text-zinc-700">
              {m.answerShape}
            </span>
          </button>
        )
      })}
    </div>
  )
}
