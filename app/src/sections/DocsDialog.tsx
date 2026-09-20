import { X } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Context — describe the situation',
    body: 'State is what Jev evaluates: a JSON object of facts, or a plain passage of text. Every answer is grounded strictly in it.',
  },
  {
    title: 'Noul — how likely is it true?',
    body: 'Write a statement and get back one number from 0 to 1. Near 1 is a strong yes, near 0 a strong no, and 0.5 means the model genuinely cannot tell.',
  },
  {
    title: 'Score — rate against levels',
    body: 'Define ordered levels, lowest first. You get a number on that scale — 1.4 sits between level 1 and 2 — plus a probability for each level.',
  },
  {
    title: 'Choice — pick one option',
    body: 'Give each option a description; that is what the model reads. You get the winning option, a probability for every option, and a confidence value.',
  },
  {
    title: 'Confidence',
    body: 'Choice and Score return confidence separately from the answer. Low confidence is a signal to route the case to a person rather than act on it.',
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
