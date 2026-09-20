import { BrandMark } from '@/sections/Illustrations'
import { Link } from 'react-router'
import { localeHomePath } from '@/lib/locale'
import { useLocale } from '@/lib/useLocale'

export default function Footer() {
  const { locale, copy } = useLocale()
  const home = localeHomePath(locale)
  const links = [
    { href: `${home}#playground`, label: copy.footer.open },
    { href: '/docs', label: copy.footer.docs },
    { href: '/use-cases', label: copy.footer.useCases },
    { href: '/examples', label: copy.footer.examples },
    { href: `${home}#faq`, label: copy.footer.faq },
  ]

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
              {copy.footer.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <div className="eyebrow">{copy.footer.section}</div>
            <ul className="mt-3 space-y-2">
              {links.map((l) => (
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
            {copy.footer.privacy}
          </Link>
          <Link to="/terms" className="transition-colors hover:text-zinc-700">
            {copy.footer.terms}
          </Link>
          <a
            href="https://github.com/xiaohu0x/jevaimodel"
            rel="noreferrer"
            className="transition-colors hover:text-zinc-700"
          >
            {copy.footer.source}
          </a>
        </div>
      </div>
    </footer>
  )
}
