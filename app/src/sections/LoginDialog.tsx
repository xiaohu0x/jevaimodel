import { X } from 'lucide-react'
import { Link } from 'react-router'
import { useLocale } from '@/lib/useLocale'
import { BrandMark } from '@/sections/Illustrations'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onGoogle: () => void
}

export default function LoginDialog({ open, onClose, onGoogle }: LoginDialogProps) {
  const { copy } = useLocale()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-zinc-950/30" onClick={onClose} />
      <div className="rise-in relative w-full max-w-[380px] rounded-t-2xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-900/10 sm:rounded-2xl">
        <button
          onClick={onClose}
          aria-label={copy.login.close}
          className="absolute top-4 right-4 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <BrandMark className="h-9 w-9" />

        <h2 className="mt-4 font-display text-[22px] leading-snug font-medium text-zinc-900">
          {copy.login.title}
        </h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-500">
          {copy.login.body}
        </p>

        <button
          onClick={onGoogle}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-300 bg-white text-[13.5px] font-semibold text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
        >
          <GoogleG className="h-[18px] w-[18px]" />
          {copy.login.google}
        </button>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-zinc-400">
          {copy.login.disclosureBefore}{' '}
          <Link to="/terms" onClick={onClose} className="underline underline-offset-2 hover:text-zinc-600">
            {copy.login.terms}
          </Link>{' '}
          {copy.login.disclosureMiddle}{' '}
          <Link
            to="/privacy"
            onClick={onClose}
            className="underline underline-offset-2 hover:text-zinc-600"
          >
            {copy.login.privacy}
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}
