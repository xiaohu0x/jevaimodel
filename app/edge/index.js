/**
 * Edge router for jevaimodel.app
 *
 * Binds the custom domain to the Pages deployment through a Worker route, so the
 * site is reachable on the apex domain without touching DNS records, and folds
 * www into the canonical host with a 301.
 */

const PAGES_HOST = 'jev-ai-model-cpn.pages.dev'
const CANONICAL_HOST = 'jevaimodel.app'
const WWW_HOST = `www.${CANONICAL_HOST}`
const CANONICAL_PATHS = new Set(['/docs', '/examples', '/privacy', '/terms', '/use-cases'])

const SECURITY_HEADERS = {
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

function secure(response, { canonical = false, pathname = '/' } = {}) {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value)

  if (canonical) headers.delete('X-Robots-Tag')
  if (response.status === 404) headers.set('X-Robots-Tag', 'noindex, nofollow')
  if (/^\/assets\/.*-[A-Za-z0-9_-]+\.(?:css|js|woff2?|png|jpe?g|webp|avif|svg)$/.test(pathname)) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export async function handleRequest(request, fetchUpstream = fetch) {
  const url = new URL(request.url)

  if (url.hostname === WWW_HOST || (url.hostname === CANONICAL_HOST && url.protocol !== 'https:')) {
    url.hostname = CANONICAL_HOST
    url.protocol = 'https:'
    return secure(Response.redirect(url.toString(), 301), { canonical: true, pathname: url.pathname })
  }

  const pathWithoutTrailingSlash = url.pathname.replace(/\/+$/, '')
  if (url.pathname !== pathWithoutTrailingSlash && CANONICAL_PATHS.has(pathWithoutTrailingSlash)) {
    url.pathname = pathWithoutTrailingSlash
    return secure(Response.redirect(url.toString(), 301), { canonical: true, pathname: url.pathname })
  }

  if (url.pathname.startsWith('/_edgecheck')) {
    return secure(
      new Response(`edge-ok ${PAGES_HOST}`, {
        headers: {
          'content-type': 'text/plain',
          'x-edge': 'jev',
          'x-robots-tag': 'noindex, nofollow',
        },
      }),
      { pathname: url.pathname },
    )
  }

  const upstream = new URL(request.url)
  upstream.hostname = PAGES_HOST
  upstream.protocol = 'https:'

  const response = await fetchUpstream(new Request(upstream.toString(), request))
  return secure(response, { canonical: true, pathname: url.pathname })
}

export default {
  fetch(request) {
    return handleRequest(request)
  },
}
