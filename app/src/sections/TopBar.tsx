import { Play, LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  running: boolean
  progress: { done: number; total: number } | null
  questionCount: number
  onRun: () => void
  onClear: () => void
}

export default function TopBar({
  running,
  progress,
  questionCount,
  onRun,
  onClear,
}: TopBarProps) {
  return (
    <header className="flex h-[52px] shrink-0 items-center border-b border-zinc-200 bg-white px-5">
      <span className="text-[13px] font-semibold text-zinc-900">Playground</span>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onClear}
          className="text-[12px] font-medium text-zinc-500 hover:text-zinc-800"
        >
          Clear
        </button>

        <button
          onClick={onRun}
          disabled={running || questionCount === 0}
          className={cn(
            'btn-ink flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[12.5px] font-semibold',
            (running || questionCount === 0) && 'pointer-events-none opacity-30',
          )}
        >
          {running ? (
            <>
              <LoaderCircle className="h-3 w-3 animate-spin" strokeWidth={2.4} />
              {progress ? `${progress.done}/${progress.total}` : 'Running'}
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current" strokeWidth={2} />
              Run
            </>
          )}
        </button>
      </div>
    </header>
  )
}
