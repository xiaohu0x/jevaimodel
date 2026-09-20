import { X } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Context — describe the world',
    body: 'Write state as JSON: the facts the classifier should reason over. Every answer is grounded strictly in this object.',
  },
  {
    title: 'Noul — truth evaluation',
    body: 'Ask how true a proposition is. Returns true/false, a confidence percentage, and a rationale anchored to specific state keys.',
  },
  {
    title: 'Score — rubric grading',
    body: 'Grade a subject against your own rubric, with a per-dimension breakdown on a 0–max scale.',
  },
  {
    title: 'Choice — multiple choice',
    body: 'Pick the best option from the set you provide and see the probability distribution across all options.',
  },
  {
    title: 'Referencing state',
    body: 'Use `backticks` inside a question to reference a state key, e.g. "Is `food` a sandwich?". References keep questions reusable across contexts.',
  },
]

interface DocsDialogProps {
  open: boolean
  onClose: () => void
}

export default function DocsDialog({ open, onClose }: DocsDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/30" onClick={onClose} />
      <div className="rise-in relative max-h-[85vh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/10 sm:rounded-2xl sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <h2 className="font-display text-[20px] leading-snug font-medium text-zinc-900">
          How JEV AI Model works
        </h2>
        <div className="mt-5 space-y-5">
          {SECTIONS.map((s, i) => (
            <div key={s.title} className="flex gap-3">
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
    </div>
  )
}
