import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BrandMark } from '@/sections/Illustrations'

const NAV_LINKS = [
  { to: '/blog', label: 'Blog' },
  { to: '/docs', label: 'Docs' },
  { to: '/use-cases', label: 'Use cases' },
  { to: '/examples', label: 'Examples' },
]

interface PublicShellProps {
  eyebrow: string
  title: string
  summary: string
  children: ReactNode
}

export default function PublicShell({ eyebrow, title, summary, children }: PublicShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FEFEFE] text-zinc-900 antialiased">
      <header className="border-b border-zinc-200 bg-white/85">
        <div className="mx-auto flex min-h-14 w-full max-w-[900px] items-center gap-5 px-4 py-2 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="JEV AI Model home">
            <BrandMark className="h-7 w-7" />
            <span className="hidden text-[13.5px] font-semibold sm:inline">JEV AI Model</span>
          </Link>
          <nav
            aria-label="Primary"
            className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-2 text-[12.5px] font-medium text-zinc-500 sm:flex-nowrap sm:gap-4"
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="shrink-0 transition-colors hover:text-zinc-900">
                {link.label}
              </Link>
            ))}
            <Link
              to="/#playground"
              className="shrink-0 rounded-lg bg-zinc-900 px-3 py-1.5 font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Playground
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] px-4 py-12 sm:px-6 sm:py-16">
        <header className="max-w-[720px]">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 break-words font-display text-[34px] leading-tight font-medium text-zinc-900 sm:text-[48px]">
            {title}
          </h1>
          <p className="mt-5 break-words text-[15px] leading-7 text-zinc-600 sm:text-[16px]">{summary}</p>
        </header>
        <div className="mt-14">{children}</div>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-[900px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-7 text-[11.5px] text-zinc-500 sm:px-6">
          <span>© {new Date().getFullYear()} JEV AI Model</span>
          <Link to="/privacy" className="hover:text-zinc-900">Privacy</Link>
          <Link to="/terms" className="hover:text-zinc-900">Terms</Link>
          <a
            href="https://github.com/xiaohu0x/jevaimodel"
            rel="noreferrer"
            className="hover:text-zinc-900"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  )
}
