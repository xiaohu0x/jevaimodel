import { useMemo } from 'react'

interface StateEditorProps {
  value: string
  onChange: (v: string) => void
}

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
            <span className="text-sky-700">{m[1]}</span>
            {m[2]}
          </span>
        ) : (
          <span key={i++} className="text-emerald-700">
            {m[1]}
          </span>
        ),
      )
    } else if (m[3]) {
      nodes.push(
        <span key={i++} className="text-violet-600">
          {m[3]}
        </span>,
      )
    } else {
      nodes.push(
        <span key={i++} className="text-amber-600">
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
  const valid = useMemo(() => {
    if (!value.trim()) return null
    try {
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  }, [value])

  const lines = value.split('\n').length

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-baseline gap-2 px-0.5 pb-2">
        <h2 className="eyebrow">STATE</h2>
        {valid === false && (
          <span className="ml-auto text-[10px] font-medium text-amber-600">
            invalid JSON
          </span>
        )}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-400">
        {/* gutter */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 flex h-full w-9 flex-col border-r border-zinc-100 bg-zinc-50 pt-3 text-right font-mono text-[9.5px] leading-[1.6rem] text-zinc-300 select-none"
        >
          {Array.from({ length: Math.max(lines, 6) }, (_, i) => (
            <span key={i} className="pr-2">
              {i + 1}
            </span>
          ))}
        </div>

        {/* highlight layer */}
        <pre
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden pt-3 pr-4 pb-3 pl-12 font-mono text-[12px] leading-[1.6rem] break-words whitespace-pre-wrap text-zinc-800"
        >
          {highlight(value)}
          {'\n'}
        </pre>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder='{ "example_state": "Add context for Classify to evaluate" }'
          className="relative h-full w-full resize-none bg-transparent pt-3 pr-4 pb-3 pl-12 font-mono text-[12px] leading-[1.6rem] break-words whitespace-pre-wrap text-transparent caret-zinc-900 outline-none selection:bg-zinc-200 placeholder:text-zinc-300"
        />
      </div>
    </section>
  )
}
