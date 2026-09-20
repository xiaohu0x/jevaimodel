export const SITE_ORIGIN = 'https://jevaimodel.app'
export const SOCIAL_IMAGE_PATH = '/og-image.png'

type JsonLd = Record<string, unknown>

export interface PageSeo {
  title: string
  description: string
  canonicalPath?: string
  index: boolean
  ogType?: 'website' | 'article'
  imageAlt: string
  structuredData?: JsonLd
}

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: 'JEV AI Model',
  description: 'JEV AI Model is a free online AI classifier playground for typed, grounded answers.',
}

const homeFaq = [
  {
    q: 'Is JEV AI Model free to use?',
    a: 'Yes. The playground on this page is free to try in your browser. Pick an example, edit the state, and run a classification without creating an account.',
  },
  {
    q: 'What is a JEV AI Model state?',
    a: 'State is a JSON object that describes the world the model should reason about — a product, a candidate, a conversation, or a prompt. JEV AI Model answers questions strictly against this state, which keeps results grounded and auditable.',
  },
  {
    q: 'What are Noul, Score, and Choice?',
    a: 'They are the three question types. Noul returns the probability that a statement is true, Score rates the state against ordered levels you define, and Choice picks one option from a set you provide.',
  },
  {
    q: 'Do I need an API key to try JEV AI Model?',
    a: 'No. You can run the playground directly on this page. Sign in only if you want to keep going after the free trial runs out.',
  },
  {
    q: 'What can I classify with JEV AI Model?',
    a: 'Anything you can describe as state: résumés, support transcripts, user prompts, survey responses, product listings, and more. If you can write the facts as JSON and ask a typed question, the model can answer it.',
  },
]

const pageSeo: Record<string, PageSeo> = {
  '/': {
    title: 'JEV AI Model — Free AI Classifier Playground',
    description:
      'Run the JEV AI Model playground free in your browser. Turn context into typed answers — likelihoods, ratings, and choices — in seconds.',
    canonicalPath: '/',
    index: true,
    ogType: 'website',
    imageAlt: 'JEV AI Model free AI classifier playground',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        website,
        {
          '@type': 'SoftwareApplication',
          '@id': `${SITE_ORIGIN}/#app`,
          name: 'JEV AI Model',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web browser',
          url: `${SITE_ORIGIN}/`,
          description:
            'JEV AI Model turns state into typed answers: Noul returns the probability a statement is true, Score rates against levels you define, and Choice picks one option — each with calibrated confidence.',
          image: `${SITE_ORIGIN}${SOCIAL_IMAGE_PATH}`,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${SITE_ORIGIN}/#faq`,
          mainEntity: homeFaq.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        },
      ],
    },
  },
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
      'Read how JEV AI Model handles Google account information, browser-only playground data, sessions, and account deletion.',
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

const notFoundSeo: PageSeo = {
  title: 'Page Not Found | JEV AI Model',
  description: 'The requested page could not be found.',
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
