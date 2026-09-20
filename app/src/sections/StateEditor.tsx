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
  const rows = Math.max(lines, 8)

  return (
    <section className="flex min-h-0 flex-col">
      <div className="flex items-center gap-2 pb-2.5">
        <h2 className="text-[13px] font-semibold text-zinc-900">State</h2>
        <span className="hidden text-[11px] text-zinc-400 sm:inline">
          the world the classifier reasons over
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
          <span
            className={
              valid === false
                ? 'h-1.5 w-1.5 rounded-full bg-amber-500'
                : valid
                  ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
                  : 'h-1.5 w-1.5 rounded-full bg-zinc-300'
            }
          />
          {valid === false ? 'invalid JSON' : valid ? 'JSON' : 'JSON'}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors focus-within:border-zinc-400">
        {/* gutter */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 flex h-full w-10 flex-col border-r border-zinc-100 pt-3.5 text-right font-mono text-[10px] leading-[1.7rem] text-zinc-300 select-none"
        >
          {Array.from({ length: rows }, (_, i) => (
            <span key={i} className="pr-2.5">
              {i + 1}
            </span>
          ))}
        </div>

        {/* highlight layer */}
        <pre
          aria-hidden
          className="pointer-events-none min-h-[168px] overflow-hidden pt-3.5 pr-4 pb-3.5 pl-12 font-mono text-[12.5px] leading-[1.7rem] break-words whitespace-pre-wrap text-zinc-800"
        >
          {highlight(value)}
          {'\n'}
        </pre>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder='{ "example_state": "Add context to evaluate" }'
          className="absolute inset-0 h-full w-full resize-none bg-transparent pt-3.5 pr-4 pb-3.5 pl-12 font-mono text-[12.5px] leading-[1.7rem] break-words whitespace-pre-wrap text-transparent caret-zinc-900 outline-none selection:bg-zinc-200 placeholder:text-zinc-300"
        />
      </div>
    </section>
  )
}
