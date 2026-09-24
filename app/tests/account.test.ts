import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequestDelete } from '../functions/api/auth/account.ts'
import { getCookie, publicOrigin } from '../functions/api/auth/_utils.ts'
import { accountAction } from '../src/lib/auth-client.ts'
import { onRequestGet as callback } from '../functions/api/auth/callback.ts'

test('invalid or expired sessions return 401 without claiming an account was deleted', async () => {
  for (const cookie of ['', 'jev_sid=expired', 'jev_sid=%ZZ']) {
    let deleted = false
    const statement = { bind() { return this }, async first() { return null } }
    const db = { withSession() { return this }, prepare() { return statement }, async batch() { deleted = true } }
    const context = { request: new Request('https://jevaimodel.app/api/auth/account', { method: 'DELETE', headers: { Cookie: cookie } }), env: { DB: db } }
    const response = await onRequestDelete(context as unknown as Parameters<typeof onRequestDelete>[0])
    assert.equal(response.status, 401)
    assert.equal(deleted, false)
    assert.notDeepEqual(await response.json(), { ok: true })
    assert.match(response.headers.get('set-cookie') ?? '', /Max-Age=0/)
  }
})

test('a valid account deletion batches sessions, usage, and the user', async () => {
  const sql: string[] = []
  let batchSize = 0
  const db = {
    withSession() { return this },
    prepare(query: string) {
      sql.push(query)
      return { bind() { return this }, async first() { return { user_id: 'review-user' } } }
    },
    async batch(statements: unknown[]) { batchSize = statements.length },
  }
  const context = { request: new Request('https://jevaimodel.app/api/auth/account', { method: 'DELETE', headers: { Cookie: 'jev_sid=valid' } }), env: { DB: db } }
  const response = await onRequestDelete(context as unknown as Parameters<typeof onRequestDelete>[0])
  assert.equal(response.status, 200)
  assert.equal(batchSize, 3)
  assert.ok(sql.some((query) => query.includes('DELETE FROM users')))
})

test('local OAuth callbacks stay local even with a production origin configured', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    const request = new Request(`http://${host}:8788/api/auth/google`)
    assert.equal(publicOrigin(request, { PUBLIC_ORIGIN: 'https://jevaimodel.app' } as Parameters<typeof publicOrigin>[1]), `http://${host}:8788`)
  }
  assert.equal(getCookie(new Request('https://jevaimodel.app', { headers: { Cookie: 'jev_sid=%ZZ' } }), 'jev_sid'), null)
})

test('account actions reject failed HTTP status, invalid success bodies, and expired sessions', async (t) => {
  const responses = [Response.json({ error: 'failure' }, { status: 500 }), Response.json({ ok: true }, { status: 401 }), Response.json({}), Response.json({ ok: true })]
  t.mock.method(globalThis, 'fetch', async () => responses.shift()!)
  await assert.rejects(accountAction('logout', 'POST'), /failed/)
  await assert.rejects(accountAction('account', 'DELETE'), /session expired/)
  await assert.rejects(accountAction('logout', 'POST'), /unexpected response/)
  await assert.doesNotReject(accountAction('logout', 'POST'))
})

test('OAuth network errors return a recoverable redirect and clear temporary cookies', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('network error') })
  const request = new Request('https://jevaimodel.app/api/auth/callback?code=test&state=test', {
    headers: { Cookie: 'jev_oauth_state=test; jev_oauth_pkce=test-verifier' },
  })
  const response = await callback({ request, env: { GOOGLE_CLIENT_ID: 'test', GOOGLE_CLIENT_SECRET: 'test' } } as Parameters<typeof callback>[0])
  assert.equal(response.status, 302)
  assert.equal(response.headers.get('location'), '/?auth_error=service_unavailable')
  assert.equal(response.headers.getSetCookie().length, 3)
  assert.ok(response.headers.getSetCookie().every((cookie) => cookie.includes('Max-Age=0')))
})
