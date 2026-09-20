import { useState } from 'react'
import { LoaderCircle, X } from 'lucide-react'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onSignIn: (email: string) => void
}

export default function LoginDialog({ open, onClose, onSignIn }: LoginDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }
    setError(null)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSignIn(email)
    }, 800)
  }

  const inputCls =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] text-zinc-800 outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/30" onClick={onClose} />
      <div className="rise-in relative w-full max-w-[360px] rounded-2xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-900/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2" width="13" height="2.6" rx="1.3" fill="#fafafa" />
            <rect x="1.5" y="6.7" width="9" height="2.6" rx="1.3" fill="#fafafa" opacity="0.65" />
            <rect x="1.5" y="11.4" width="5.5" height="2.6" rx="1.3" fill="#fafafa" opacity="0.35" />
          </svg>
        </div>

        <h2 className="mt-4 font-serif text-[20px] leading-snug font-medium text-zinc-900">
          Sign in to keep going
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">
          One quick step and you can continue right where you left off.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            className={inputCls}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputCls}
          />

          {error && <p className="text-[11.5px] font-medium text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-ink flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.2} />
                Signing in…
              </>
            ) : (
              'Sign in & continue'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setLoading(true)
              setTimeout(() => {
                setLoading(false)
                onSignIn('demo@gmail.com')
              }, 800)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white py-2.5 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50"
          >
            <GoogleG />
            Continue with Google
          </button>

          <p className="pt-1.5 text-center text-[10px] leading-relaxed text-zinc-400">
            Demo auth — credentials stay in your browser.
          </p>
        </form>
      </div>
    </div>
  )
}

function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.2 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}
