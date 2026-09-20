import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fieldsToState,
  isValidJson,
  stateToFields,
  textToScalar,
} from '../src/lib/state-fields.ts'

test('stateToFields flattens a scalar object into key/value rows', () => {
  const json = JSON.stringify({ food: 'hotdog', bread_count: 1, upright: true })
  assert.deepEqual(stateToFields(json), [
    { key: 'food', value: 'hotdog' },
    { key: 'bread_count', value: '1' },
    { key: 'upright', value: 'true' },
  ])
})

test('stateToFields keeps non-scalar values as JSON text', () => {
  const fields = stateToFields(JSON.stringify({ highlights: ['a', 'b'] }))
  assert.deepEqual(fields, [{ key: 'highlights', value: '["a","b"]' }])
})

test('stateToFields returns null for anything that is not a JSON object', () => {
  for (const value of ['', 'not json', '{ "a": 1', '[1,2]', 'null', '"str"', '42']) {
    assert.equal(stateToFields(value), null, `expected null for ${value}`)
  }
})

test('textToScalar coerces JSON literals but leaves prose alone', () => {
  assert.equal(textToScalar('true'), true)
  assert.equal(textToScalar('false'), false)
  assert.equal(textToScalar('null'), null)
  assert.equal(textToScalar('42'), 42)
  assert.equal(textToScalar('-3.5'), -3.5)
  assert.equal(textToScalar('hotdog'), 'hotdog')
  assert.equal(textToScalar('meat in one bun'), 'meat in one bun')
  // preserved verbatim: trimming would fight the user mid-typing
  assert.equal(textToScalar('golden hour '), 'golden hour ')
})

test('fieldsToState drops unnamed rows and pretty-prints', () => {
  const out = fieldsToState([
    { key: 'food', value: 'hotdog' },
    { key: '', value: 'ignored' },
    { key: 'upright', value: 'true' },
  ])
  assert.equal(out, '{\n  "food": "hotdog",\n  "upright": true\n}')
})

test('form and JSON views round-trip the same data', () => {
  const original = JSON.stringify(
    { food: 'hotdog', structure: 'meat partially enclosed', bread_count: 1, upright: true },
    null,
    2,
  )
  const fields = stateToFields(original)
  assert.ok(fields)
  assert.equal(fieldsToState(fields), original)
})

test('isValidJson tracks parseability', () => {
  assert.equal(isValidJson('{"a":1}'), true)
  assert.equal(isValidJson('{"a":1'), false)
  assert.equal(isValidJson('   '), false)
})
