import { BookOpen, LogOut } from 'lucide-react'
import { Link } from 'react-router'
import type { AccountUser } from '@/lib/useAccount'
import { BrandMark } from '@/sections/Illustrations'

interface HeaderProps {
  user: AccountUser | null
  onSignIn: () => void
  onSignOut: () => void
  onShare: () => void
  shared: boolean
}

export default function Header({
  user,
  onSignIn,
  onSignOut,
  onShare,
  shared,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-zinc-950/[0.07] bg-[#FEFEFE]/85 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-7 w-7 shrink-0" />
          <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-zinc-900">
            JEV AI Model
          </span>
          <span className="hidden h-4 w-px bg-zinc-300 sm:block" />
          <span className="hidden text-[13px] font-medium text-zinc-500 sm:inline">Playground</span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/docs"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-zinc-500 transition-colors hover:bg-zinc-900/[0.05] hover:text-zinc-900"
          >
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span className="hidden sm:inline">How it works</span>
          </Link>

          <button
            onClick={onShare}
            className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-zinc-500 transition-colors hover:bg-zinc-900/[0.05] hover:text-zinc-900"
          >
            {shared ? 'Copied' : 'Share'}
          </button>

          {user ? (
            <div className="ml-1 flex items-center gap-1.5 border-l border-zinc-200 pl-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full border border-zinc-200 object-cover"
                />
              ) : (
                <div
                  title={user.email}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white"
                >
                  {(user.name || user.email).slice(0, 1).toUpperCase()}
                </div>
              )}
              <button
                onClick={onSignOut}
                title="Sign out"
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900/[0.05] hover:text-zinc-700"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="ml-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-[12.5px] font-semibold text-[#fafafa] transition-colors hover:bg-zinc-700"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
