import { BrandMark } from '@/sections/Illustrations'
import { Link } from 'react-router'

const LINKS = [
  { href: '#playground', label: 'Open the playground' },
  { href: '/docs', label: 'Documentation' },
  { href: '/use-cases', label: 'Use cases' },
  { href: '/examples', label: 'Examples' },
  { href: '#faq', label: 'FAQ' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white/60">
      <div className="mx-auto w-full max-w-[820px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[380px]">
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-6 w-6" />
              <span className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
                JEV AI Model
              </span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-500">
              A free online AI classifier playground. JEV AI Model turns JSON context into typed
              answers — true or false, rubric scores, and multiple-choice — with a confidence value
              for every result.
            </p>
          </div>

          <nav aria-label="Footer">
            <div className="eyebrow">PLAYGROUND</div>
            <ul className="mt-3 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[12.5px] text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-zinc-400">
          <span>© {new Date().getFullYear()} JEV AI Model · jevaimodel.app</span>
          <Link to="/privacy" className="transition-colors hover:text-zinc-700">
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-zinc-700">
            Terms
          </Link>
          <a
            href="https://github.com/xiaohu0x/jevaimodel"
            rel="noreferrer"
            className="transition-colors hover:text-zinc-700"
          >
            Source
          </a>
        </div>
      </div>
    </footer>
  )
}
