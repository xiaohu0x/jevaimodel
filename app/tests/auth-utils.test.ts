import assert from 'node:assert/strict'
import test from 'node:test'
import { pkceChallenge, safeNext } from '../functions/api/auth/_utils.ts'

test('safeNext keeps canonical same-site paths', () => {
  assert.equal(safeNext('/'), '/')
  assert.equal(safeNext('/privacy?from=login#data'), '/privacy?from=login#data')
  assert.equal(safeNext('/path with spaces'), '/path%20with%20spaces')
})

test('safeNext rejects external and ambiguous redirects', () => {
  for (const value of [
    null,
    '',
    'https://example.com',
    '//example.com',
    '/\\example.com',
    '/%5c%5cexample.com',
    '/%2f%2fexample.com',
    '/\nLocation: https://example.com',
  ]) {
    assert.equal(safeNext(value), '/')
  }
})

test('PKCE challenge matches the RFC 7636 S256 example', async () => {
  const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
  assert.equal(await pkceChallenge(verifier), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
})
