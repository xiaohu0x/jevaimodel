import { useState } from 'react'
import { Check, ChevronDown, Globe2 } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { LOCALES, localeDefinition, localeHomePath } from '@/lib/locale'
import { useLocale } from '@/lib/useLocale'
import { cn } from '@/lib/utils'

export default function LanguageMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { locale, copy } = useLocale()
  const current = localeDefinition(locale)
  const hash = location.hash === '#playground' ? location.hash : ''

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={copy.header.language}
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-[12px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-900/[0.05] hover:text-zinc-900"
      >
        <Globe2 className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        <span className="hidden sm:inline">{current.shortLabel}</span>
        <ChevronDown className="hidden h-3 w-3 sm:block" strokeWidth={2} aria-hidden />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            aria-label={copy.login.close}
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-[220px] overflow-hidden rounded-lg border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-900/10">
            {LOCALES.map((option) => (
              <Link
                key={option.code}
                to={`${localeHomePath(option.code)}${hash}`}
                hrefLang={option.hrefLang}
                lang={option.htmlLang}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex h-9 items-center rounded-md px-3 text-[13px] transition-colors hover:bg-zinc-100',
                  option.code === locale ? 'font-semibold text-zinc-950' : 'text-zinc-600',
                )}
              >
                <span>{option.label}</span>
                {option.code === locale && (
                  <Check className="ml-auto h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
