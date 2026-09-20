import { ArrowRight } from 'lucide-react'
import { LESSONS, USE_CASES, type Preset } from '@/lib/engine'
import { TYPE_DOT } from '@/lib/type-style'
import { cn } from '@/lib/utils'

/** Three teaching lessons plus one real-world case — enough to show the range. */
const RAIL: Preset[] = [...LESSONS, USE_CASES[0]]

interface ExampleRailProps {
  activeId: string | null
  onLoadPreset: (p: Preset) => void
}

export default function ExampleRail({ activeId, onLoadPreset }: ExampleRailProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-zinc-400 uppercase">
          New here? Start with an example
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-zinc-300" strokeWidth={2.2} />
        <span className="text-[14px] text-zinc-400">
          each one fills in the context and the question below
        </span>
      </div>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {RAIL.map((p) => {
          const active = p.id === activeId
          return (
            <button
              key={p.id}
              onClick={() => onLoadPreset(p)}
              aria-pressed={active}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-3 text-[15px] font-medium transition-colors',
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-900',
              )}
            >
              <span aria-hidden className="text-[17px] leading-none">
                {p.emoji}
              </span>
              {p.title}
              <span
                aria-hidden
                className={cn(
                  'h-2 w-2 rounded-full',
                  active ? 'bg-white/50' : TYPE_DOT[p.kind],
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
