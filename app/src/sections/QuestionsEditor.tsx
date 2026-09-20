import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  PRIMITIVE_META,
  type PrimitiveType,
  type Question,
  uid,
} from '@/lib/engine'
import { TYPE_DOT } from '@/lib/type-style'
import { cn } from '@/lib/utils'

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
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-3">
        <h2 className="font-display text-[22px] font-medium tracking-[-0.02em] text-zinc-900">
          Questions
        </h2>
        <span className="hidden text-[14px] text-zinc-400 sm:inline">
          what you want to know
        </span>
        <div className="ml-auto">
          <AddQuestionMenu onAdd={addQuestion} />
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {questions.length === 0 && (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 text-center">
            <p className="text-[15px] text-zinc-400">
              No questions yet — add one, or pick an example above.
            </p>
            <div className="mt-4">
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
        className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-[14px] font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
      >
        <Plus className={cn('h-4 w-4 transition-transform', open && 'rotate-45')} strokeWidth={2.2} />
        Add
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-[330px] overflow-hidden rounded-2xl border border-zinc-300 bg-white p-2 shadow-xl shadow-zinc-900/10">
            <div className="flex items-center gap-2 px-2.5 pt-1.5 pb-2.5">
              <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
                Select primitive type
              </span>
              <a
                href="/docs"
                className="ml-auto text-[12px] font-medium text-zinc-400 underline underline-offset-2 hover:text-zinc-900"
              >
                Docs
              </a>
            </div>
            {(Object.keys(PRIMITIVE_META) as PrimitiveType[]).map((t) => {
              const meta = PRIMITIVE_META[t]
              return (
                <button
                  key={t}
                  onClick={() => {
                    onAdd(t)
                    setOpen(false)
                  }}
                  className="w-full rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-zinc-50"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', TYPE_DOT[t])} />
                    <span className="text-[14.5px] font-bold text-zinc-900">{meta.name}</span>
                    <span className="text-[13px] text-zinc-400">{meta.tagline}</span>
                  </div>
                  <div className="mt-1 pl-4 font-mono text-[12px] text-zinc-400 italic">
                    Example: {meta.example}
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
  'w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-zinc-800 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-900'

function QuestionCard({ question: q, onUpdate, onRemove, onChangeType }: QuestionCardProps) {
  return (
    <div className="group/card rounded-xl border border-zinc-300 bg-white p-4 transition-colors hover:border-zinc-400">
      <div className="flex items-center gap-2">
        <select
          value={q.type}
          onChange={(e) => onChangeType(e.target.value as PrimitiveType)}
          aria-label="Question type"
          className="cursor-pointer appearance-none rounded-full bg-zinc-900 px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.08em] text-white uppercase outline-none"
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
          aria-label="Remove question"
          className="ml-auto rounded-md p-1.5 text-zinc-300 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:opacity-0 sm:group-hover/card:opacity-100 sm:focus-visible:opacity-100"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <input
        value={q.question}
        onChange={(e) => onUpdate({ question: e.target.value })}
        aria-label="Question"
        placeholder={
          q.type === 'noul'
            ? 'Is `food` a sandwich?'
            : q.type === 'score'
              ? 'How much did `subject` contribute?'
              : 'What color is `object`?'
        }
        className={cn(inputCls, 'mt-3 font-mono text-[14.5px]')}
      />

      {q.type === 'score' && (
        <div className="mt-2.5 flex gap-2">
          <input
            value={q.rubric ?? ''}
            onChange={(e) => onUpdate({ rubric: e.target.value })}
            aria-label="Rubric"
            placeholder="Rubric — e.g. clarity, depth, originality"
            className={cn(inputCls, 'min-w-0 flex-1 text-[13.5px]')}
          />
          <input
            type="number"
            min={1}
            max={100}
            title="Max score"
            aria-label="Max score"
            value={q.maxScore ?? 10}
            onChange={(e) => onUpdate({ maxScore: Math.max(1, Number(e.target.value) || 10) })}
            className={cn(inputCls, 'w-16 px-2 text-center font-mono text-[13.5px]')}
          />
        </div>
      )}

      {q.type === 'choice' && (
        <div className="mt-2.5 space-y-2">
          {(q.options ?? []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 shrink-0 text-center font-mono text-[11.5px] text-zinc-300">
                {String.fromCharCode(65 + i)}
              </span>
              <input
                value={opt}
                onChange={(e) => {
                  const next = [...(q.options ?? [])]
                  next[i] = e.target.value
                  onUpdate({ options: next })
                }}
                aria-label={`Option ${String.fromCharCode(65 + i)}`}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className={cn(inputCls, 'min-w-0 flex-1 py-2 text-[13.5px]')}
              />
              {(q.options?.length ?? 0) > 2 && (
                <button
                  onClick={() => onUpdate({ options: (q.options ?? []).filter((_, j) => j !== i) })}
                  aria-label={`Remove option ${String.fromCharCode(65 + i)}`}
                  className="rounded p-1 text-zinc-300 hover:text-zinc-700"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
          {(q.options?.length ?? 0) < 6 && (
            <button
              onClick={() => onUpdate({ options: [...(q.options ?? []), ''] })}
              className="pl-6 text-[12.5px] font-medium text-zinc-400 hover:text-zinc-900"
            >
              + Add option
            </button>
          )}
        </div>
      )}
    </div>
  )
}
