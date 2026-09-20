import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { handleRequest } from '../edge/index.js'
import { LOCALES, UI_COPY, localeHomePath } from '../src/lib/locale.ts'
import { absoluteUrl, getPageSeo, PRERENDER_PATHS } from '../src/lib/seo.ts'

const projectRoot = process.cwd()

function outputFile(pathname: string): string {
  return path.join(projectRoot, 'dist', pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`)
}

function matchContent(html: string, pattern: RegExp, label: string): string {
  const match = html.match(pattern)
  assert.ok(match?.[1], `missing ${label}`)
  return match[1]
}

function visibleText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

for (const pathname of PRERENDER_PATHS) {
  test(`${pathname} has prerendered content and route-specific SEO`, async () => {
    const seo = getPageSeo(pathname)
    const html = await readFile(outputFile(pathname), 'utf8')

    assert.equal(matchContent(html, /<title>(.*?)<\/title>/, 'title'), seo.title)
    assert.equal(matchContent(html, /<html lang="([^"]+)">/, 'html language'), seo.language)
    assert.equal(
      matchContent(html, /<meta name="description" content="([^"]+)" \/>/, 'description'),
      seo.description.replaceAll('&', '&amp;').replaceAll('"', '&quot;'),
    )
    assert.match(html, new RegExp(`<link rel="canonical" href="${absoluteUrl(seo.canonicalPath!)}"`))
    assert.match(html, new RegExp(`<meta property="og:locale" content="${seo.ogLocale}"`))
    assert.match(html, /<meta property="og:image" content="https:\/\/jevaimodel\.app\/og-image\.png"/)
    assert.match(html, /<meta name="twitter:image" content="https:\/\/jevaimodel\.app\/og-image\.png"/)
    assert.match(
      html,
      /<link rel="icon" type="image\/png" sizes="192x192" href="\/icon-192\.png"/,
    )
    assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/)
    assert.match(html, /<link rel="manifest" href="\/site\.webmanifest"/)
    assert.doesNotMatch(html, /<div id="root"><\/div>/)
    assert.doesNotMatch(html, /href="#"/)
    assert.doesNotMatch(html, /code-path=/)
    assert.equal(html.match(/<h1\b/g)?.length, 1)
    if (seo.h1) {
      assert.equal(visibleText(matchContent(html, /(<h1\b[\s\S]*?<\/h1>)/, 'H1')), seo.h1)
    }

    const jsonLd = matchContent(
      html,
      /<script id="seo-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/,
      'structured data',
    )
    assert.doesNotThrow(() => JSON.parse(jsonLd))
  })
}

test('404 output is prerendered and explicitly excluded from indexing', async () => {
  const html = await readFile(path.join(projectRoot, 'dist', '404.html'), 'utf8')
  assert.match(html, /<title>Page Not Found \| JEV AI Model<\/title>/)
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/)
  assert.doesNotMatch(html, /rel="canonical"/)
  assert.doesNotMatch(html, /id="seo-json-ld"/)
  assert.match(html, /<h1[^>]*>This page does not exist<\/h1>/)
})

test('localized home pages have unique TDH and reciprocal hreflang links', async () => {
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  const headings = new Set<string>()

  for (const locale of LOCALES) {
    const pathname = localeHomePath(locale.code)
    const seo = getPageSeo(pathname)
    const copy = UI_COPY[locale.code].seo
    const html = await readFile(outputFile(pathname), 'utf8')

    assert.equal(seo.title, copy.title)
    assert.equal(seo.description, copy.description)
    assert.equal(seo.h1, copy.h1)
    assert.match(html, new RegExp(`<link rel="canonical" href="${absoluteUrl(pathname)}"`))

    for (const alternate of LOCALES) {
      assert.match(
        html,
        new RegExp(
          `<link rel="alternate" hreflang="${alternate.hrefLang}" href="${absoluteUrl(localeHomePath(alternate.code))}"`,
        ),
      )
    }
    assert.match(
      html,
      /<link rel="alternate" hreflang="x-default" href="https:\/\/jevaimodel\.app\/"/,
    )

    titles.add(copy.title)
    descriptions.add(copy.description)
    headings.add(copy.h1)
  }

  assert.equal(titles.size, LOCALES.length)
  assert.equal(descriptions.size, LOCALES.length)
  assert.equal(headings.size, LOCALES.length)
})

test('sitemap and robots expose only intentional crawl targets', async () => {
  const sitemap = await readFile(path.join(projectRoot, 'dist', 'sitemap.xml'), 'utf8')
  const robots = await readFile(path.join(projectRoot, 'dist', 'robots.txt'), 'utf8')

  for (const pathname of PRERENDER_PATHS) {
    assert.match(sitemap, new RegExp(`<loc>${absoluteUrl(pathname)}</loc>`))
  }
  assert.doesNotMatch(sitemap, /404/)
  assert.match(robots, /Disallow: \/api\//)
  assert.match(robots, /Sitemap: https:\/\/jevaimodel\.app\/sitemap\.xml/)
})

test('social image is a 1200 by 630 PNG', async () => {
  const png = await readFile(path.join(projectRoot, 'dist', 'og-image.png'))
  assert.equal(png.subarray(1, 4).toString(), 'PNG')
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
})

test('every generated page includes exactly one Google tag', async () => {
  const paths = [...PRERENDER_PATHS, '/404']

  for (const pathname of paths) {
    const html = await readFile(outputFile(pathname), 'utf8')
    assert.equal(html.match(/googletagmanager\.com\/gtag\/js\?id=G-PMB42B64XH/g)?.length, 1)
    assert.equal(html.match(/src="\/google-tag\.js"/g)?.length, 1)
  }

  const setup = await readFile(path.join(projectRoot, 'dist', 'google-tag.js'), 'utf8')
  assert.match(setup, /gtag\('config', 'G-PMB42B64XH'\)/)
})

test('edge router canonicalizes scheme, host, and public trailing slashes', async () => {
  const cases = [
    ['http://jevaimodel.app/docs?ref=test', 'https://jevaimodel.app/docs?ref=test'],
    ['https://www.jevaimodel.app/examples', 'https://jevaimodel.app/examples'],
    ['https://jevaimodel.app/privacy/', 'https://jevaimodel.app/privacy'],
    ['https://jevaimodel.app/zh-cn/?ref=test', 'https://jevaimodel.app/zh-cn?ref=test'],
  ]

  for (const [input, expected] of cases) {
    const response = await handleRequest(new Request(input))
    assert.equal(response.status, 301)
    assert.equal(response.headers.get('location'), expected)
    assert.ok(response.headers.get('strict-transport-security'))
  }
})

test('edge router removes preview noindex on canonical pages and marks 404 responses', async () => {
  const upstream = async () =>
    new Response('ok', { status: 200, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })
  const canonical = await handleRequest(new Request('https://jevaimodel.app/docs'), upstream)
  assert.equal(canonical.headers.get('x-robots-tag'), null)
  assert.match(
    canonical.headers.get('content-security-policy') ?? '',
    /script-src 'self' https:\/\/www\.googletagmanager\.com/,
  )

  const missing = await handleRequest(
    new Request('https://jevaimodel.app/missing'),
    async () => new Response('missing', { status: 404 }),
  )
  assert.equal(missing.status, 404)
  assert.equal(missing.headers.get('x-robots-tag'), 'noindex, nofollow')

  const asset = await handleRequest(
    new Request('https://jevaimodel.app/assets/index-abc123.js'),
    async () => new Response('asset'),
  )
  assert.equal(asset.headers.get('cache-control'), 'public, max-age=31536000, immutable')
})
