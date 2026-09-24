import Modal from '@/components/Modal'

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
    <Modal open={open} onClose={onClose} title="How JEV AI Model works" description="Define context and choose the shape of the answer you need.">
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
    </Modal>
  )
}
