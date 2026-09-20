import { LANDING_COPY } from './landing-copy.ts'
import { LOCALES, UI_COPY, localeHomePath } from './locale.ts'

export const SITE_ORIGIN = 'https://jevaimodel.app'
export const SOCIAL_IMAGE_PATH = '/og-image.png'

type JsonLd = Record<string, unknown>

export interface PageSeo {
  title: string
  description: string
  language: string
  ogLocale: string
  canonicalPath?: string
  index: boolean
  ogType?: 'website' | 'article'
  imageAlt: string
  h1?: string
  alternates?: readonly { hrefLang: string; href: string }[]
  structuredData?: JsonLd
}

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: 'JEV AI Model',
  inLanguage: LOCALES.map((locale) => locale.htmlLang),
}

const homeAlternates = [
  ...LOCALES.map((locale) => ({
    hrefLang: locale.hrefLang,
    href: absoluteUrl(localeHomePath(locale.code)),
  })),
  { hrefLang: 'x-default', href: absoluteUrl('/') },
]

const localizedHomeSeo = Object.fromEntries(
  LOCALES.map((locale) => {
    const pathname = localeHomePath(locale.code)
    const url = absoluteUrl(pathname)
    const copy = UI_COPY[locale.code]
    const faq = LANDING_COPY[locale.code].faq.items

    return [
      pathname,
      {
        title: copy.seo.title,
        description: copy.seo.description,
        language: locale.htmlLang,
        ogLocale: locale.ogLocale,
        canonicalPath: pathname,
        index: true,
        ogType: 'website',
        imageAlt: copy.seo.imageAlt,
        h1: copy.seo.h1,
        alternates: homeAlternates,
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            website,
            {
              '@type': 'SoftwareApplication',
              '@id': `${url}#app`,
              name: 'JEV AI Model',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web browser',
              url,
              inLanguage: locale.htmlLang,
              description: copy.seo.description,
              image: `${SITE_ORIGIN}${SOCIAL_IMAGE_PATH}`,
              isAccessibleForFree: true,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            },
            {
              '@type': 'FAQPage',
              '@id': `${url}#faq`,
              url: `${url}#faq`,
              inLanguage: locale.htmlLang,
              mainEntity: faq.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            },
          ],
        },
      } satisfies PageSeo,
    ]
  }),
) as Record<string, PageSeo>

const englishPageSeo: Record<string, Omit<PageSeo, 'language' | 'ogLocale'>> = {
  '/docs': {
    title: 'AI Classifier Documentation | JEV AI Model',
    description:
      'Learn how to describe state, ask Noul, Score, and Choice questions, and read the probabilities and confidence JEV AI Model returns.',
    canonicalPath: '/docs',
    index: true,
    ogType: 'article',
    imageAlt: 'JEV AI Model documentation for typed AI classification',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'JEV AI Model documentation',
      description:
        'A practical guide to state, typed questions, and the calibrated probabilities JEV AI Model returns.',
      url: `${SITE_ORIGIN}/docs`,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      publisher: { '@type': 'Organization', name: 'JEV AI Model', url: `${SITE_ORIGIN}/` },
    },
  },
  '/use-cases': {
    title: 'AI Classification Use Cases | JEV AI Model',
    description:
      'Explore practical AI classification workflows for resume screening, support QA, LLM guardrails, moderation, surveys, and data labeling.',
    canonicalPath: '/use-cases',
    index: true,
    ogType: 'article',
    imageAlt: 'Practical AI classification use cases with JEV AI Model',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AI classification use cases',
      description:
        'Practical workflows for resume screening, support QA, guardrails, moderation, survey coding, and data labeling.',
      url: `${SITE_ORIGIN}/use-cases`,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    },
  },
  '/examples': {
    title: 'AI Classifier Examples | JEV AI Model',
    description:
      'See complete JSON examples for likelihood, rating, and choice questions with JEV AI Model.',
    canonicalPath: '/examples',
    index: true,
    ogType: 'article',
    imageAlt: 'JSON examples for the JEV AI Model classifier',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'AI classifier examples',
      description: 'Worked examples for Noul, Score, and Choice classification questions.',
      url: `${SITE_ORIGIN}/examples`,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    },
  },
  '/privacy': {
    title: 'Privacy Policy | JEV AI Model',
    description:
      'Read how JEV AI Model handles playground requests, usage limits, Google account information, sessions, and account deletion.',
    canonicalPath: '/privacy',
    index: true,
    ogType: 'article',
    imageAlt: 'JEV AI Model privacy policy',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'JEV AI Model Privacy Policy',
      url: `${SITE_ORIGIN}/privacy`,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    },
  },
  '/terms': {
    title: 'Terms of Service | JEV AI Model',
    description:
      'Read the terms governing use of the JEV AI Model browser playground, account features, and generated classifications.',
    canonicalPath: '/terms',
    index: true,
    ogType: 'article',
    imageAlt: 'JEV AI Model terms of service',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'JEV AI Model Terms of Service',
      url: `${SITE_ORIGIN}/terms`,
      inLanguage: 'en',
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    },
  },
}

const pageSeo: Record<string, PageSeo> = {
  ...localizedHomeSeo,
  ...Object.fromEntries(
    Object.entries(englishPageSeo).map(([pathname, seo]) => [
      pathname,
      { ...seo, language: 'en', ogLocale: 'en_US' },
    ]),
  ),
}

const notFoundSeo: PageSeo = {
  title: 'Page Not Found | JEV AI Model',
  description: 'The requested page could not be found.',
  language: 'en',
  ogLocale: 'en_US',
  index: false,
  ogType: 'website',
  imageAlt: 'JEV AI Model',
}

export const PRERENDER_PATHS = Object.keys(pageSeo)

export function normalizePathname(pathname: string): string {
  if (pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

export function getPageSeo(pathname: string): PageSeo {
  return pageSeo[normalizePathname(pathname)] ?? notFoundSeo
}

export function absoluteUrl(pathname: string): string {
  return pathname === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${pathname}`
}
