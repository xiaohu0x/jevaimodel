import { useState } from 'react'
import { GripVertical, Plus, X } from 'lucide-react'
import {
  PRIMITIVE_META,
  blankQuestion,
  type PrimitiveType,
  type Question,
} from '@/lib/engine'
import { TYPE_DOT } from '@/lib/type-style'
import TypePicker from '@/sections/TypePicker'
import { cn } from '@/lib/utils'

interface QuestionsEditorProps {
  questions: Question[]
  onChange: (qs: Question[]) => void
}

export default function QuestionsEditor({ questions, onChange }: QuestionsEditorProps) {
  const addQuestion = (type: PrimitiveType) => onChange([...questions, blankQuestion(type)])

  const update = (id: string, patch: Partial<Question>) =>
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const remove = (id: string) => onChange(questions.filter((q) => q.id !== id))

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-3">
        <h2 className="font-display text-[19px] font-medium tracking-[-0.02em] text-zinc-900 sm:text-[22px]">
          Questions
        </h2>
        <span className="hidden text-[14px] text-zinc-400 sm:inline">
          what you want to know about it
        </span>
        {questions.length > 0 && (
          <div className="ml-auto">
            <AddQuestionMenu onAdd={addQuestion} />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        {questions.length === 0 && (
          <div className="min-h-[190px] sm:min-h-[240px]">
            <p className="pb-3 text-[14px] text-zinc-500">Pick what kind of answer you want:</p>
            <TypePicker onAdd={addQuestion} />
          </div>
        )}

        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onUpdate={(patch) => update(q.id, patch)}
            onRemove={() => remove(q.id)}
            onChangeType={(t) => {
              // Switching type discards the old shape: a level scale and a set
              // of options do not translate into one another.
              const fresh = blankQuestion(t)
              update(q.id, { type: t, options: fresh.options, levels: fresh.levels })
            }}
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
                Select question type
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
                    <span className="ml-auto font-mono text-[11px] text-zinc-400">
                      {meta.answerShape}
                    </span>
                  </div>
                  <div className="mt-1 pl-4 text-[12.5px] text-zinc-400">{meta.tagline}</div>
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
  'w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 sm:py-2.5 text-zinc-800 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-900'

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
        value={q.instructions}
        onChange={(e) => onUpdate({ instructions: e.target.value })}
        aria-label="Instructions"
        placeholder={PRIMITIVE_META[q.type].example}
        className={cn(inputCls, 'mt-3 text-[14.5px]')}
      />

      {q.type === 'noul' && (
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-400">
          Write it as a statement, not a question. You get back how likely it is true — 0 to 1.
        </p>
      )}

      {q.type === 'score' && <LevelsEditor q={q} onUpdate={onUpdate} />}
      {q.type === 'choice' && <OptionsEditor q={q} onUpdate={onUpdate} />}
    </div>
  )
}

/* ---------------------------------------------------------------- */

/** Score levels are ordered lowest to highest — that order defines the scale. */
function LevelsEditor({ q, onUpdate }: { q: Question; onUpdate: (p: Partial<Question>) => void }) {
  const levels = q.levels ?? []

  return (
    <div className="mt-3">
      <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
        Levels — low to high
      </span>

      <div className="mt-2 space-y-2">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-center font-mono text-[11.5px] text-zinc-400">
              {i}
            </span>
            <input
              value={level}
              onChange={(e) =>
                onUpdate({ levels: levels.map((l, j) => (i === j ? e.target.value : l)) })
              }
              aria-label={`Level ${i}`}
              placeholder={
                i === 0
                  ? 'Lowest — e.g. no impact'
                  : i === levels.length - 1
                    ? 'Highest — e.g. blocking issue'
                    : 'In between'
              }
              className={cn(inputCls, 'min-w-0 flex-1 py-2 text-[13.5px]')}
            />
            {levels.length > 2 && (
              <button
                onClick={() => onUpdate({ levels: levels.filter((_, j) => j !== i) })}
                aria-label={`Remove level ${i}`}
                className="rounded p-1 text-zinc-300 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            )}
          </div>
        ))}
      </div>

      {levels.length < 8 && (
        <button
          onClick={() => onUpdate({ levels: [...levels, ''] })}
          className="mt-2 pl-7 text-[12.5px] font-medium text-zinc-400 hover:text-zinc-900"
        >
          + Add level
        </button>
      )}

      <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-400">
        You get a number on this scale — 1.4 sits between level 1 and level 2.
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- */

/** Each Choice option carries a description — that is what the model reads. */
function OptionsEditor({ q, onUpdate }: { q: Question; onUpdate: (p: Partial<Question>) => void }) {
  const options = q.options ?? []
  const set = (i: number, patch: Partial<{ key: string; description: string }>) =>
    onUpdate({ options: options.map((o, j) => (i === j ? { ...o, ...patch } : o)) })

  return (
    <div className="mt-3">
      <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
        Options
      </span>

      <div className="mt-2 space-y-2.5">
        {options.map((opt, i) => (
          <div key={i} className="flex items-start gap-2">
            <GripVertical className="mt-2.5 h-3.5 w-3.5 shrink-0 text-zinc-200" strokeWidth={2} />
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                value={opt.key}
                onChange={(e) => set(i, { key: e.target.value })}
                aria-label={`Option ${i + 1} name`}
                placeholder="billing"
                className={cn(inputCls, 'py-2 font-mono text-[13.5px] font-medium')}
              />
              <input
                value={opt.description}
                onChange={(e) => set(i, { description: e.target.value })}
                aria-label={`Option ${i + 1} description`}
                placeholder="Payment or subscription issues"
                className={cn(inputCls, 'py-2 text-[13px]')}
              />
            </div>
            {options.length > 2 && (
              <button
                onClick={() => onUpdate({ options: options.filter((_, j) => j !== i) })}
                aria-label={`Remove option ${i + 1}`}
                className="mt-2 rounded p-1 text-zinc-300 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            )}
          </div>
        ))}
      </div>

      {options.length < 8 && (
        <button
          onClick={() => onUpdate({ options: [...options, { key: '', description: '' }] })}
          className="mt-2 pl-6 text-[12.5px] font-medium text-zinc-400 hover:text-zinc-900"
        >
          + Add option
        </button>
      )}

      <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-400">
        The description is what the model reads — say what each option covers.
      </p>
    </div>
  )
}
