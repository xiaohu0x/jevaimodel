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

export default {
  async fetch(request) {
    const url = new URL(request.url)

    // Health probe used to verify the route without touching live traffic.
    if (url.pathname.startsWith('/_edgecheck')) {
      return new Response(`edge-ok ${PAGES_HOST}`, {
        headers: { 'content-type': 'text/plain', 'x-edge': 'jev' },
      })
    }

    // 1. One canonical host: www -> apex
    if (url.hostname === WWW_HOST) {
      url.hostname = CANONICAL_HOST
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    // 2. Anything else is served by the Pages deployment.
    const upstream = new URL(request.url)
    upstream.hostname = PAGES_HOST
    upstream.protocol = 'https:'

    return fetch(new Request(upstream.toString(), request))
  },
}
