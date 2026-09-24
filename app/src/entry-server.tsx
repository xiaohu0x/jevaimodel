/// <reference types="node" />
import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough } from 'node:stream'
import { StaticRouter } from 'react-router'
import App from './App'

export {
  PRERENDER_PATHS,
  SOCIAL_IMAGE_PATH,
  SITE_ORIGIN,
  absoluteUrl,
  getPageSeo,
} from './lib/seo'

export function render(pathname: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough()
    let html = ''
    output.on('data', (chunk: Buffer) => { html += chunk.toString() })
    output.on('end', () => resolve(html))
    output.on('error', reject)
    const stream = renderToPipeableStream(
      <StaticRouter location={pathname}><App /></StaticRouter>,
      {
        onAllReady() { stream.pipe(output) },
        onShellError: reject,
        onError(error) { reject(error) },
      },
    )
  })
}
