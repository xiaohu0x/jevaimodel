/* Ink line-art illustrations — TypeSafe palette: ink #171717, pink #f386a1,
   magenta #d45bb6, teal #09aea1. */

const INK = '#171717'

/* Brand mark — ink "J" on a magenta disc, echoing the TypeSafe badge. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#e551ba" />
      <path
        d="M20.5 8.5V19A4.5 4.5 0 0 1 11.5 19"
        stroke="#171717"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared gradient defs are inlined per-art with unique ids so multiple
    instances on one page never clash.                                  */
/* ------------------------------------------------------------------ */

export function HotdogArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="hd-meat" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d45bb6" />
          <stop offset="1" stopColor="#f386a1" />
        </linearGradient>
        <linearGradient id="hd-bun" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7a8bf" />
          <stop offset="1" stopColor="#f386a1" />
        </linearGradient>
      </defs>

      {/* top bun */}
      <rect x="15" y="26" width="66" height="19" rx="9.5" fill="url(#hd-bun)" stroke={INK} strokeWidth="2.6" />
      {/* sausage */}
      <rect x="7" y="41" width="82" height="20" rx="10" fill="url(#hd-meat)" stroke={INK} strokeWidth="2.6" />
      {/* mustard squiggle */}
      <path
        d="M20 51c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0 6 4 9 0"
        stroke="#6ee7b7"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* bottom bun */}
      <rect x="15" y="57" width="66" height="19" rx="9.5" fill="url(#hd-bun)" stroke={INK} strokeWidth="2.6" />
      {/* sparkles */}
      <path d="M82 20l1.6 4.4L88 26l-4.4 1.6L82 32l-1.6-4.4L76 26l4.4-1.6z" fill="#f386a1" />
      <path d="M14 66l1.1 3 3 1.1-3 1.1L14 74l-1.1-2.8-3-1.1 3-1.1z" fill="#09aea1" />
    </svg>
  )
}

export function SkyArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="sk-sun" x1="60" y1="12" x2="80" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7a8bf" />
          <stop offset="1" stopColor="#f386a1" />
        </linearGradient>
        <linearGradient id="sk-cloud" x1="12" y1="30" x2="78" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#09aea1" />
          <stop offset="1" stopColor="#5cc6bd" />
        </linearGradient>
      </defs>

      {/* sun */}
      <circle cx="69" cy="29" r="12" fill="url(#sk-sun)" stroke={INK} strokeWidth="2.6" />
      <path d="M69 8v5M69 45v5M48 29h5M85 29h5M54 14l3.5 3.5M80.5 40.5L84 44M84 14l-3.5 3.5M57.5 40.5L54 44"
        stroke={INK} strokeWidth="2.4" strokeLinecap="round" />

      {/* cloud */}
      <path
        d="M20 70a11 11 0 0 1 1.2-21.9A15.5 15.5 0 0 1 50 40.5 12 12 0 0 1 61 49.5 10.5 10.5 0 0 1 66 70Z"
        fill="url(#sk-cloud)"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* sparkles */}
      <path d="M86 62l1.3 3.4 3.4 1.3-3.4 1.3L86 71.4l-1.3-3.4-3.4-1.3 3.4-1.3z" fill="#09aea1" />
    </svg>
  )
}

export function CameraArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="cm-body" x1="10" y1="30" x2="86" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d45bb6" />
          <stop offset="1" stopColor="#f386a1" />
        </linearGradient>
        <linearGradient id="cm-lens" x1="40" y1="46" x2="58" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#09aea1" />
          <stop offset="1" stopColor="#5cc6bd" />
        </linearGradient>
        <linearGradient id="cm-bump" x1="34" y1="20" x2="56" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f7a8bf" />
          <stop offset="1" stopColor="#f386a1" />
        </linearGradient>
      </defs>

      {/* viewfinder bump */}
      <rect x="33" y="22" width="22" height="13" rx="5" fill="url(#cm-bump)" stroke={INK} strokeWidth="2.6" />
      {/* body */}
      <rect x="12" y="31" width="72" height="50" rx="14" fill="url(#cm-body)" stroke={INK} strokeWidth="2.6" />
      {/* lens */}
      <circle cx="48" cy="58" r="17.5" fill="#ffffff" stroke={INK} strokeWidth="2.6" />
      <circle cx="48" cy="58" r="9.5" fill="url(#cm-lens)" stroke={INK} strokeWidth="2.4" />
      <circle cx="52.5" cy="53.5" r="2.2" fill="#ffffff" />
      {/* shutter + flash */}
      <circle cx="70" cy="42" r="3.2" fill="#f386a1" stroke={INK} strokeWidth="2" />
      <path d="M22 41h8" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      {/* sparkle */}
      <path d="M84 20l1.4 3.6 3.6 1.4-3.6 1.4L84 30l-1.4-3.6-3.6-1.4 3.6-1.4z" fill="#f386a1" />
    </svg>
  )
}

/** small pastel tile used for use-case rows */
const TILES: Record<string, [string, string]> = {
  resume: ['#d45bb6', '#f386a1'],
  support: ['#09aea1', '#5cc6bd'],
  guardrails: ['#f386a1', '#f7a8bf'],
}

export function UseCaseTile({ id }: { id: string }) {
  const [a, b] = TILES[id] ?? ['#f386a1', '#09aea1']
  const gid = `tile-${id}`
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect x="1.4" y="1.4" width="29.2" height="29.2" rx="9" fill={`url(#${gid})`} stroke={INK} strokeWidth="2" />
      <path d="M10 16.5h12M16 10.5v12" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
