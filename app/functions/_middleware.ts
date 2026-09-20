const CANONICAL_HOST = 'jevaimodel.app'
const WWW_HOST = 'www.jevaimodel.app'
const CANONICAL_PATHS = new Set([
  '/docs',
  '/examples',
  '/privacy',
  '/terms',
  '/use-cases',
  '/zh-cn',
  '/es',
  '/ja',
  '/ko',
  '/fr',
  '/de',
  '/pt-br',
])

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'none'",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    "font-src 'self' https://fonts.gstatic.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "img-src 'self' data: https://*.googleusercontent.com https://*.google-analytics.com https://*.googletagmanager.com",
    "manifest-src 'self'",
    "media-src 'none'",
    "object-src 'none'",
    "script-src 'self' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    'upgrade-insecure-requests',
  ].join('; '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',
}

function secure(response: Response, requestUrl: URL): Response {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value)

  if (requestUrl.hostname.endsWith('.pages.dev')) {
    headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  if (response.status === 404) {
    headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  if (/^\/assets\/.*-[A-Za-z0-9_-]+\.(?:css|js|woff2?|png|jpe?g|webp|avif|svg)$/.test(requestUrl.pathname)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Keep one canonical origin and one URL shape for every public HTML page.
 * (Pages preview/deployment URLs are left alone so previews keep working.)
 */
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url)

  if (url.hostname === WWW_HOST || (url.hostname === CANONICAL_HOST && url.protocol !== 'https:')) {
    url.hostname = CANONICAL_HOST
    url.protocol = 'https:'
    return secure(Response.redirect(url.toString(), 301), url)
  }

  const pathWithoutTrailingSlash = url.pathname.replace(/\/+$/, '')
  if (url.pathname !== pathWithoutTrailingSlash && CANONICAL_PATHS.has(pathWithoutTrailingSlash)) {
    url.pathname = pathWithoutTrailingSlash
    return secure(Response.redirect(url.toString(), 301), url)
  }

  return secure(await context.next(), url)
}
