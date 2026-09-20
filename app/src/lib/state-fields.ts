/**
 * Bridge between the raw JSON `state` string (the single source of truth) and
 * the friendly key/value form view.
 *
 * The form view only handles flat objects with scalar values. Anything richer
 * (nested objects, arrays) stays readable in the form but is edited as JSON
 * text, so no data is ever dropped on a round trip.
 */

export interface StateField {
  key: string
  /** Raw text as typed by the user; coerced on the way back to JSON. */
  value: string
}

/** Values the form view can round-trip losslessly. */
function isScalar(v: unknown): boolean {
  return v === null || ['string', 'number', 'boolean'].includes(typeof v)
}

export function scalarToText(v: unknown): string {
  if (v === null) return 'null'
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return JSON.stringify(v)
}

/**
 * Coerce typed text back into a JSON value. `true`/`false`/`null` and numeric
 * strings become their JSON counterparts; everything else stays a string.
 */
export function textToScalar(text: string): unknown {
  const t = text.trim()
  if (t === 'true') return true
  if (t === 'false') return false
  if (t === 'null') return null
  if (t !== '' && Number.isFinite(Number(t))) return Number(t)
  return text
}

/**
 * Parse a JSON state string into form fields.
 * Returns null when the text is not a flat-enough JSON object to edit as a form.
 */
export function stateToFields(json: string): StateField[] | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return null
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null

  return Object.entries(parsed as Record<string, unknown>).map(([key, v]) => ({
    key,
    value: isScalar(v) ? scalarToText(v) : JSON.stringify(v),
  }))
}

/** Serialize form fields back into a pretty-printed JSON state string. */
export function fieldsToState(fields: StateField[]): string {
  const obj: Record<string, unknown> = {}
  for (const { key, value } of fields) {
    if (!key.trim()) continue
    obj[key] = textToScalar(value)
  }
  return JSON.stringify(obj, null, 2)
}

/** True when the text parses as JSON (empty counts as not-yet-valid). */
export function isValidJson(json: string): boolean {
  if (!json.trim()) return false
  try {
    JSON.parse(json)
    return true
  } catch {
    return false
  }
}
