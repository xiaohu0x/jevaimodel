import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  PRIMITIVE_META,
  type PrimitiveType,
  type Question,
  uid,
} from '@/lib/engine'
import { cn } from '@/lib/utils'

const TYPE_TEXT: Record<PrimitiveType, string> = {
  noul: 'text-emerald-700',
  score: 'text-amber-700',
  choice: 'text-sky-700',
}

interface QuestionsEditorProps {
  questions: Question[]
  onChange: (qs: Question[]) => void
}

export default function QuestionsEditor({ questions, onChange }: QuestionsEditorProps) {
  const addQuestion = (type: PrimitiveType) => {
    onChange([
      ...questions,
      {
        id: uid(),
        type,
        question: '',
        ...(type === 'score' ? { rubric: '', maxScore: 10 } : {}),
        ...(type === 'choice' ? { options: ['', ''] } : {}),
      },
    ])
  }

  const update = (id: string, patch: Partial<Question>) =>
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const remove = (id: string) => onChange(questions.filter((q) => q.id !== id))

  return (
    <section className="flex min-h-0 flex-[1.2] flex-col">
      <div className="flex items-baseline gap-2 px-0.5 pb-2">
        <h2 className="eyebrow">QUESTIONS</h2>
        <div className="ml-auto">
          <AddQuestionMenu onAdd={addQuestion} />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5 pb-1">
        {questions.length === 0 && (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 text-center">
            <p className="text-[12px] text-zinc-400">No questions yet — add one, or load a lesson.</p>
            <div className="mt-3">
              <AddQuestionMenu onAdd={addQuestion} />
            </div>
          </div>
        )}

        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onUpdate={(patch) => update(q.id, patch)}
            onRemove={() => remove(q.id)}
            onChangeType={(t) =>
              update(q.id, {
                type: t,
                ...(t === 'score' ? { rubric: q.rubric ?? '', maxScore: q.maxScore ?? 10 } : {}),
                ...(t === 'choice' ? { options: q.options?.length ? q.options : ['', ''] } : {}),
              })
            }
          />
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */

function AddQuestionMenu({ onAdd }: { onAdd: (t: PrimitiveType) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[12px] font-medium text-zinc-500 hover:text-zinc-900"
      >
        <Plus className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-45')} strokeWidth={2} />
        Add
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-[264px] overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-lg shadow-zinc-900/5">
            {(Object.keys(PRIMITIVE_META) as PrimitiveType[]).map((t) => {
              const meta = PRIMITIVE_META[t]
              return (
                <button
                  key={t}
                  onClick={() => {
                    onAdd(t)
                    setOpen(false)
                  }}
                  className="w-full rounded-md px-2.5 py-2 text-left hover:bg-zinc-50"
                >
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-[12.5px] font-bold', TYPE_TEXT[t])}>{meta.name}</span>
                    <span className="text-[11px] text-zinc-400">{meta.tagline}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-zinc-400 italic">
                    {meta.example}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */

interface QuestionCardProps {
  question: Question
  onUpdate: (patch: Partial<Question>) => void
  onRemove: () => void
  onChangeType: (t: PrimitiveType) => void
}

const inputCls =
  'w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-800 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-400'

function QuestionCard({ question: q, onUpdate, onRemove, onChangeType }: QuestionCardProps) {
  return (
    <div className="group/card rounded-lg border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <select
          value={q.type}
          onChange={(e) => onChangeType(e.target.value as PrimitiveType)}
          className={cn(
            'cursor-pointer appearance-none bg-transparent text-[11px] font-bold tracking-wide uppercase outline-none',
            TYPE_TEXT[q.type],
          )}
        >
          {(Object.keys(PRIMITIVE_META) as PrimitiveType[]).map((t) => (
            <option key={t} value={t}>
              {PRIMITIVE_META[t].name}
            </option>
          ))}
        </select>

        <button
          onClick={onRemove}
          title="Remove question"
          className="ml-auto rounded p-1 text-zinc-300 opacity-0 transition-opacity group-hover/card:opacity-100 hover:text-zinc-500"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>

      <input
        value={q.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        placeholder={
          q.type === 'noul'
            ? 'Is `food` a sandwich?'
            : q.type === 'score'
              ? 'How much did `subject` contribute?'
              : 'What color is `object`?'
        }
        className={cn(inputCls, 'mt-1.5 font-mono text-[12px]')}
      />

      {q.type === 'score' && (
        <div className="mt-1.5 flex gap-1.5">
          <input
            value={q.rubric ?? ''}
            onChange={(e) => onUpdate({ rubric: e.target.value })}
            placeholder="Rubric — e.g. clarity, depth, originality"
            className={cn(inputCls, 'min-w-0 flex-1 text-[11.5px]')}
          />
          <input
            type="number"
            min={1}
            max={100}
            title="Max score"
            value={q.maxScore ?? 10}
            onChange={(e) => onUpdate({ maxScore: Math.max(1, Number(e.target.value) || 10) })}
            className={cn(inputCls, 'w-14 text-center font-mono text-[11.5px]')}
          />
        </div>
      )}

      {q.type === 'choice' && (
        <div className="mt-1.5 space-y-1.5">
          {(q.options ?? []).map((opt, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-4 shrink-0 text-center font-mono text-[10px] text-zinc-300">
                {String.fromCharCode(65 + i)}
              </span>
              <input
                value={opt}
                onChange={(e) => {
                  const next = [...(q.options ?? [])]
                  next[i] = e.target.value
                  onUpdate({ options: next })
                }}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className={cn(inputCls, 'min-w-0 flex-1 py-1 text-[11.5px]')}
              />
              {(q.options?.length ?? 0) > 2 && (
                <button
                  onClick={() => onUpdate({ options: (q.options ?? []).filter((_, j) => j !== i) })}
                  className="rounded p-0.5 text-zinc-300 hover:text-zinc-500"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.8} />
                </button>
              )}
            </div>
          ))}
          {(q.options?.length ?? 0) < 6 && (
            <button
              onClick={() => onUpdate({ options: [...(q.options ?? []), ''] })}
              className="pl-6 text-[10.5px] font-medium text-zinc-400 hover:text-zinc-600"
            >
              + Add option
            </button>
          )}
        </div>
      )}
    </div>
  )
}
