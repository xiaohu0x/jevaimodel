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

  return `<!-- seo-head-start -->
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : ''}
    <link rel="privacy-policy" href="${SITE_ORIGIN}/privacy" />
    <meta name="robots" content="${robots}" />
    <meta property="og:type" content="${seo.ogType ?? 'website'}" />
    <meta property="og:site_name" content="JEV AI Model" />
    <meta property="og:locale" content="en_US" />
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

function buildPage(pathname) {
  const seo = getPageSeo(pathname)
  const app = render(pathname)
  const withHead = template.replace(
    /<!-- seo-head-start -->[\s\S]*?<!-- seo-head-end -->/,
    renderSeoHead(seo, pathname),
  )
  const html = withHead.replace('<div id="root"></div>', `<div id="root">${app}</div>`)

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
  await writeFile(output, buildPage(pathname))
}

console.log(`Prerendered ${outputs.length} routes`)
