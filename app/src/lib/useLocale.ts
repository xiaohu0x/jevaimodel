import { useLocation } from 'react-router'
import { UI_COPY, localeFromPathname } from '@/lib/locale'

export function useLocale() {
  const { pathname } = useLocation()
  const locale = localeFromPathname(pathname)
  return { locale, copy: UI_COPY[locale] }
}
