import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { JSDOM } from 'jsdom'
import { BLOG_POSTS, blogPath } from '../src/lib/blog.ts'
import { PRERENDER_PATHS, SITE_ORIGIN } from '../src/lib/seo.ts'

test('each blog renders a complete article, accurate schema, working internal links, and parseable JSON examples', async () => {
  for (const post of BLOG_POSTS) {
    const html = await readFile(`dist${blogPath(post)}.html`, 'utf8')
    const document = new JSDOM(html).window.document
    assert.equal(document.querySelector('h1')?.textContent, post.title)
    assert.ok((document.querySelector('article')?.textContent?.length ?? 0) > 3000)
    assert.equal(document.querySelector('meta[name="robots"]')?.getAttribute('content')?.startsWith('index'), post.indexable)
    const schema = JSON.parse(document.querySelector('#seo-json-ld')!.textContent!)
    const article = schema['@graph'].find((entry: Record<string, unknown>) => entry['@type'] === 'BlogPosting')
    assert.equal(article.headline, document.querySelector('h1')?.textContent)
    assert.equal(article.datePublished, document.querySelector('time')?.getAttribute('datetime'))
    assert.equal(article.mainEntityOfPage, `${SITE_ORIGIN}${blogPath(post)}`)
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
      const target = new URL(anchor.getAttribute('href')!, SITE_ORIGIN)
      assert.ok(PRERENDER_PATHS.includes(target.pathname), `broken link: ${target.pathname}`)
      if (target.hash) {
        const output = target.pathname === '/' ? 'index' : target.pathname.slice(1)
        const destination = new JSDOM(await readFile(`dist/${output}.html`, 'utf8')).window.document
        assert.ok(destination.getElementById(target.hash.slice(1)), `broken anchor: ${target.href}`)
      }
    }
    for (const block of document.querySelectorAll('pre code')) {
      const value = block.textContent!.trim()
      if (value.startsWith('{')) assert.doesNotThrow(() => JSON.parse(value))
    }
  }
})
