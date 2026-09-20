import { useMemo, useState } from 'react'
import { Braces, Plus, Table2, X } from 'lucide-react'
import {
  fieldsToState,
  stateToFields,
  type StateField,
} from '@/lib/state-fields'
import { cn } from '@/lib/utils'

interface StateEditorProps {
  value: string
  onChange: (v: string) => void
}

type Mode = 'form' | 'json'

/** tiny JSON syntax highlighter → spans */
function highlight(json: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const re =
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(json))) {
    if (m.index > last) nodes.push(json.slice(last, m.index))
    if (m[1]) {
      nodes.push(
        m[2] ? (
          <span key={i++}>
            <span className="text-zinc-900">{m[1]}</span>
            {m[2]}
          </span>
        ) : (
          <span key={i++} className="text-[#067a71]">
            {m[1]}
          </span>
        ),
      )
    } else if (m[3]) {
      nodes.push(
        <span key={i++} className="text-[#e551ba]">
          {m[3]}
        </span>,
      )
    } else {
      nodes.push(
        <span key={i++} className="text-[#b84a9d]">
          {m[0]}
        </span>,
      )
    }
    last = m.index + m[0].length
  }
  if (last < json.length) nodes.push(json.slice(last))
  return nodes
}

export default function StateEditor({ value, onChange }: StateEditorProps) {
  const [mode, setMode] = useState<Mode>('form')

  const fields = useMemo(() => stateToFields(value), [value])
  const valid = useMemo(() => {
    if (!value.trim()) return null
    try {
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  }, [value])

  // The form view can only render a flat JSON object; fall back to JSON text.
  const formAvailable = fields !== null
  const effectiveMode: Mode = formAvailable ? mode : 'json'

  const writeFields = (next: StateField[]) => onChange(fieldsToState(next))

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-3">
        <h2 className="font-display text-[22px] font-medium tracking-[-0.02em] text-zinc-900">
          Context
        </h2>
        <span className="hidden text-[14px] text-zinc-400 sm:inline">
          the situation to reason over
        </span>

        <div className="ml-auto flex items-center gap-2.5">
          {effectiveMode === 'json' && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  valid === false ? 'bg-amber-500' : valid ? 'bg-emerald-500' : 'bg-zinc-300',
                )}
              />
              {valid === false ? 'invalid JSON' : 'JSON'}
            </span>
          )}
          <ModeToggle mode={effectiveMode} formAvailable={formAvailable} onChange={setMode} />
        </div>
      </div>

      {effectiveMode === 'form' ? (
        <FieldsView fields={fields ?? []} onChange={writeFields} />
      ) : (
        <>
          <JsonView value={value} onChange={onChange} />
          {!formAvailable && value.trim() !== '' && (
            <p className="mt-2.5 text-[13.5px] text-zinc-400">
              {valid === false
                ? 'Fix the JSON above to switch back to the field view.'
                : 'This context is nested, so it stays in JSON. Flat key/value data can use the field view.'}
            </p>
          )}
        </>
      )}
    </section>
  )
}

/* ---------------------------------------------------------------- */

function ModeToggle({
  mode,
  formAvailable,
  onChange,
}: {
  mode: Mode
  formAvailable: boolean
  onChange: (m: Mode) => void
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-zinc-300 bg-zinc-100 p-1">
      <button
        onClick={() => onChange('form')}
        disabled={!formAvailable}
        title={formAvailable ? 'Field view' : 'Field view needs a flat JSON object'}
        aria-pressed={mode === 'form'}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
          mode === 'form' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900',
          !formAvailable && 'cursor-not-allowed opacity-40 hover:text-zinc-500',
        )}
      >
        <Table2 className="h-3.5 w-3.5" strokeWidth={2.2} />
        Fields
      </button>
      <button
        onClick={() => onChange('json')}
        aria-pressed={mode === 'json'}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[12.5px] font-semibold transition-colors',
          mode === 'json' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900',
        )}
      >
        <Braces className="h-3.5 w-3.5" strokeWidth={2.2} />
        JSON
      </button>
    </div>
  )
}

/* ---------------------------------------------------------------- */

const cellCls =
  'w-full bg-transparent px-4 py-3.5 text-[15px] text-zinc-800 outline-none placeholder:text-zinc-300'

function FieldsView({
  fields,
  onChange,
}: {
  fields: StateField[]
  onChange: (f: StateField[]) => void
}) {
  const patch = (i: number, next: Partial<StateField>) =>
    onChange(fields.map((f, j) => (i === j ? { ...f, ...next } : f)))

  const add = () => onChange([...fields, { key: '', value: '' }])
  const remove = (i: number) => onChange(fields.filter((_, j) => j !== i))

  return (
    <div className="flex min-h-[260px] flex-1 flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white">
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2">
        <span className="flex-1 font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
          Field
        </span>
        <span className="flex-[1.5] font-mono text-[10.5px] font-medium tracking-[0.12em] text-zinc-400 uppercase">
          Value
        </span>
        <span className="w-7" />
      </div>

      {fields.length === 0 && (
        <p className="flex flex-1 items-center justify-center px-4 py-10 text-center text-[15px] text-zinc-400">
          No context yet — add a field, or pick an example above.
        </p>
      )}

      {fields.map((f, i) => (
        <div
          key={i}
          className="group/row flex items-center gap-2 border-b border-zinc-100 focus-within:bg-zinc-50/60"
        >
          <input
            value={f.key}
            onChange={(e) => patch(i, { key: e.target.value })}
            spellCheck={false}
            placeholder="food"
            aria-label={`Field ${i + 1} name`}
            className={cn(cellCls, 'min-w-0 flex-1 font-mono font-medium')}
          />
          <span aria-hidden className="h-5 w-px shrink-0 bg-zinc-200" />
          <input
            value={f.value}
            onChange={(e) => patch(i, { value: e.target.value })}
            spellCheck={false}
            placeholder="hotdog"
            aria-label={`Field ${i + 1} value`}
            className={cn(cellCls, 'min-w-0 flex-[1.5]')}
          />
          <button
            onClick={() => remove(i)}
            title="Remove field"
            aria-label={`Remove field ${f.key || i + 1}`}
            className="mr-2.5 shrink-0 rounded-md p-1.5 text-zinc-300 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:opacity-0 sm:group-hover/row:opacity-100 sm:focus-visible:opacity-100"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ))}

      <button
        onClick={add}
        className="mt-auto flex w-full items-center gap-2 border-t border-zinc-200 px-4 py-3.5 text-[14.5px] font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
      >
        <Plus className="h-4 w-4" strokeWidth={2.2} />
        Add a field
      </button>
    </div>
  )
}

/* ---------------------------------------------------------------- */

function JsonView({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const rows = Math.max(value.split('\n').length, 9)

  return (
    <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-xl border border-zinc-300 bg-white transition-colors focus-within:border-zinc-900">
      {/* gutter */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 flex h-full w-11 flex-col border-r border-zinc-100 pt-4 text-right font-mono text-[11px] leading-[1.85rem] text-zinc-300 select-none"
      >
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} className="pr-3">
            {i + 1}
          </span>
        ))}
      </div>

      {/* highlight layer */}
      <pre
        aria-hidden
        className="pointer-events-none min-h-[260px] overflow-hidden pt-4 pr-4 pb-4 pl-14 font-mono text-[14px] leading-[1.85rem] break-words whitespace-pre-wrap text-zinc-800"
      >
        {highlight(value)}
        {'\n'}
      </pre>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        aria-label="Context JSON"
        placeholder='{ "food": "hotdog", "upright": true }'
        className="absolute inset-0 h-full w-full resize-none bg-transparent pt-4 pr-4 pb-4 pl-14 font-mono text-[14px] leading-[1.85rem] break-words whitespace-pre-wrap text-transparent caret-zinc-900 outline-none selection:bg-zinc-200 placeholder:text-zinc-300"
      />
    </div>
  )
}
