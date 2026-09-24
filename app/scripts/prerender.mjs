import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const serverEntry = pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const {
  PRERENDER_PATHS,
  SOCIAL_IMAGE_PATH,
  SITE_ORIGIN,
  absoluteUrl,
  getPageSeo,
  render,
} = await import(serverEntry)

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderSeoHead(seo, pathname) {
  const canonical = seo.canonicalPath ? absoluteUrl(seo.canonicalPath) : null
  const pageUrl = canonical ?? `${SITE_ORIGIN}${pathname}`
  const image = `${SITE_ORIGIN}${SOCIAL_IMAGE_PATH}`
  const robots = seo.index
    ? 'index, follow, max-image-preview:large, max-snippet:-1'
    : 'noindex, nofollow'
  const jsonLd = seo.structuredData
    ? `\n    <script id="seo-json-ld" type="application/ld+json">${JSON.stringify(seo.structuredData).replaceAll('<', '\\u003c')}</script>`
    : ''
  const alternates = (seo.alternates ?? [])
    .map(
      ({ hrefLang, href }) =>
        `\n    <link data-seo-alternate="true" rel="alternate" hreflang="${escapeHtml(hrefLang)}" href="${escapeHtml(href)}" />`,
    )
    .join('')

  return `<!-- seo-head-start -->
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ''}${alternates}
    <link rel="privacy-policy" href="${SITE_ORIGIN}/privacy" />
    <meta name="robots" content="${robots}" />
    <meta property="og:type" content="${seo.ogType ?? 'website'}" />
    <meta property="og:site_name" content="JEV AI Model" />
    <meta property="og:locale" content="${escapeHtml(seo.ogLocale)}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />${jsonLd}
    <!-- seo-head-end -->`
}

async function buildPage(pathname) {
  const seo = getPageSeo(pathname)
  const app = await render(pathname)
  const withHead = template.replace(
    /<!-- seo-head-start -->[\s\S]*?<!-- seo-head-end -->/,
    renderSeoHead(seo, pathname),
  )
  const withLanguage = withHead.replace(/<html lang="[^"]*">/, `<html lang="${escapeHtml(seo.language)}">`)
  const html = withLanguage.replace('<div id="root"></div>', `<div id="root">${app}</div>`)

  if (html === template || !html.includes(app)) {
    throw new Error(`Failed to prerender ${pathname}`)
  }
  return html
}

const outputs = [
  ...PRERENDER_PATHS.map((pathname) => ({
    pathname,
    filename: pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`,
  })),
  { pathname: '/404', filename: '404.html' },
]

for (const { pathname, filename } of outputs) {
  const output = path.join(dist, filename)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, await buildPage(pathname))
}

console.log(`Prerendered ${outputs.length} routes`)

// Generate crawl targets from the same registry as the HTML routes.
const indexablePaths = PRERENDER_PATHS.filter((pathname) => getPageSeo(pathname).index)
const sitemapRows = indexablePaths.map((pathname) => {
  const seo = getPageSeo(pathname)
  const alternates = (seo.alternates ?? []).map(({ hrefLang, href }) =>
    `    <xhtml:link rel="alternate" hreflang="${escapeHtml(hrefLang)}" href="${escapeHtml(href)}" />`).join('\n')
  return `  <url>\n    <loc>${absoluteUrl(pathname)}</loc>${alternates ? `\n${alternates}` : ''}\n  </url>`
}).join('\n')
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapRows}\n</urlset>\n`)
await writeFile(path.join(dist, '_redirects'), PRERENDER_PATHS.filter((pathname) => pathname !== '/').map((pathname) => `${pathname}/ ${pathname} 301`).join('\n') + '\n')
