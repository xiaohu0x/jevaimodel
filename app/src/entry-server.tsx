import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'

export {
  PRERENDER_PATHS,
  SOCIAL_IMAGE_PATH,
  SITE_ORIGIN,
  absoluteUrl,
  getPageSeo,
} from './lib/seo'

export function render(pathname: string): string {
  return renderToString(
    <StaticRouter location={pathname}>
      <App />
    </StaticRouter>,
  )
}
