import { BookOpen, ExternalLink, LogIn, LogOut } from 'lucide-react'
import { Link } from 'react-router'
import type { AccountUser } from '@/lib/useAccount'
import { localeApiGuideUrl, localeHomePath } from '@/lib/locale'
import { useLocale } from '@/lib/useLocale'
import { BrandMark } from '@/sections/Illustrations'
import LanguageMenu from '@/sections/LanguageMenu'

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
  const { locale, copy } = useLocale()
  const home = localeHomePath(locale)

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-zinc-950/[0.07] bg-[#FEFEFE]/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-8">
        <Link to={home} className="flex min-w-0 items-center gap-2.5">
          <BrandMark className="h-8 w-8 shrink-0" />
          <span className="hidden text-[15px] font-semibold tracking-[-0.015em] text-zinc-900 min-[360px]:inline">
            JEV AI Model
          </span>
          <span className="hidden h-4 w-px bg-zinc-300 sm:block" />
          <span className="hidden text-[14px] font-medium text-zinc-400 lg:inline">
            {copy.header.playground}
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <a
            href={localeApiGuideUrl(locale)}
            target="_blank"
            rel="noopener noreferrer"
            title={copy.header.apiGuide}
            aria-label={copy.header.apiGuide}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e551ba]/35 bg-[#e551ba]/[0.07] px-2.5 py-2 text-[13px] font-semibold text-[#b23b91] whitespace-nowrap transition-colors hover:border-[#e551ba]/60 hover:bg-[#e551ba]/[0.13] sm:px-3"
          >
            <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.9} aria-hidden />
            <span className="hidden lg:inline">{copy.header.apiGuide}</span>
            <ExternalLink className="hidden h-3.5 w-3.5 shrink-0 sm:inline" strokeWidth={2} aria-hidden />
          </a>

          <Link
            to={`${home}#how-it-works`}
            aria-label={copy.header.howItWorks}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] font-medium text-zinc-500 transition-colors hover:bg-zinc-900/[0.05] hover:text-zinc-900"
          >
            <BookOpen className="h-4 w-4" strokeWidth={1.8} />
            <span className="hidden lg:inline">{copy.header.howItWorks}</span>
          </Link>

          <LanguageMenu />

          <button
            onClick={onShare}
            className="rounded-lg px-3 py-2 text-[14px] font-medium text-zinc-500 transition-colors hover:bg-zinc-900/[0.05] hover:text-zinc-900"
          >
            <span className="hidden sm:inline">
              {shared ? copy.header.copied : copy.header.share}
            </span>
            <span className="sm:hidden" aria-hidden>
              {shared ? '✓' : '↗'}
            </span>
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
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white"
                >
                  {(user.name || user.email).slice(0, 1).toUpperCase()}
                </div>
              )}
              <button
                onClick={onSignOut}
                title={copy.header.signOut}
                aria-label={copy.header.signOut}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900/[0.05] hover:text-zinc-700"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              aria-label={copy.header.signIn}
              className="ml-1 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 text-[14px] font-semibold text-[#fafafa] transition-colors hover:bg-zinc-700 sm:px-4"
            >
              <LogIn className="h-4 w-4 sm:hidden" strokeWidth={2} aria-hidden />
              <span className="hidden sm:inline">{copy.header.signIn}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
