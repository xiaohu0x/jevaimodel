import { useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  SOCIAL_IMAGE_PATH,
  SITE_ORIGIN,
  absoluteUrl,
  getPageSeo,
} from '@/lib/seo'

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = getPageSeo(pathname)
    const canonical = seo.canonicalPath ? absoluteUrl(seo.canonicalPath) : null
    const image = `${SITE_ORIGIN}${SOCIAL_IMAGE_PATH}`

    document.title = seo.title
    document.documentElement.lang = seo.language
    setMeta('name', 'description', seo.description)
    setMeta(
      'name',
      'robots',
      seo.index
        ? 'index, follow, max-image-preview:large, max-snippet:-1'
        : 'noindex, nofollow',
    )
    setMeta('property', 'og:type', seo.ogType ?? 'website')
    setMeta('property', 'og:site_name', 'JEV AI Model')
    setMeta('property', 'og:locale', seo.ogLocale)
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', canonical ?? `${SITE_ORIGIN}${pathname}`)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:image:secure_url', image)
    setMeta('property', 'og:image:type', 'image/png')
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('property', 'og:image:alt', seo.imageAlt)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    setMeta('name', 'twitter:image', image)
    setMeta('name', 'twitter:image:alt', seo.imageAlt)

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) {
      if (!canonicalElement) {
        canonicalElement = document.createElement('link')
        canonicalElement.rel = 'canonical'
        document.head.appendChild(canonicalElement)
      }
      canonicalElement.href = canonical
    } else {
      canonicalElement?.remove()
    }

    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove())
    for (const alternate of seo.alternates ?? []) {
      const element = document.createElement('link')
      element.rel = 'alternate'
      element.hreflang = alternate.hrefLang
      element.href = alternate.href
      element.dataset.seoAlternate = 'true'
      document.head.appendChild(element)
    }

    let structuredData = document.head.querySelector<HTMLScriptElement>('#seo-json-ld')
    if (seo.structuredData) {
      if (!structuredData) {
        structuredData = document.createElement('script')
        structuredData.id = 'seo-json-ld'
        structuredData.type = 'application/ld+json'
        document.head.appendChild(structuredData)
      }
      structuredData.textContent = JSON.stringify(seo.structuredData)
    } else {
      structuredData?.remove()
    }
  }, [pathname])

  return null
}
