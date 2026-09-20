import assert from 'node:assert/strict'
import test from 'node:test'
import {
  LESSONS,
  USE_CASES,
  blankQuestion,
  isQuestionReady,
  parseState,
  toApiQuestion,
  uid,
  type Question,
} from '../src/lib/engine.ts'

/*
 * These lock the request shape against the live TypeSafe contract, verified
 * against api.typesafe.ai: questions are keyed by id, the prompt travels as
 * `instructions`, Choice criteria are {key: description}, and Score criteria
 * are an ordered array of level descriptions.
 */

test('a noul question carries only type and instructions', () => {
  const q: Question = { id: uid(), type: 'noul', instructions: 'The message conveys urgency' }
  assert.deepEqual(toApiQuestion(q), {
    type: 'noul',
    instructions: 'The message conveys urgency',
  })
})

test('choice criteria are keyed descriptions', () => {
  const q: Question = {
    id: uid(),
    type: 'choice',
    instructions: 'Which team should handle this',
    options: [
      { key: 'billing', description: 'Payment or subscription issues' },
      { key: 'technical', description: 'Bugs or integration problems' },
    ],
  }
  assert.deepEqual(toApiQuestion(q), {
    type: 'choice',
    instructions: 'Which team should handle this',
    criteria: {
      billing: 'Payment or subscription issues',
      technical: 'Bugs or integration problems',
    },
  })
})

test('a choice option with no description falls back to its key', () => {
  const q: Question = {
    id: uid(),
    type: 'choice',
    instructions: 'Pick one',
    options: [
      { key: 'blue', description: '' },
      { key: 'red', description: 'Warm red' },
    ],
  }
  const criteria = (toApiQuestion(q) as { criteria: Record<string, string> }).criteria
  assert.equal(criteria.blue, 'blue')
  assert.equal(criteria.red, 'Warm red')
})

test('unnamed choice options are dropped, not sent as empty keys', () => {
  const q: Question = {
    id: uid(),
    type: 'choice',
    instructions: 'Pick one',
    options: [
      { key: 'a', description: 'First' },
      { key: '  ', description: 'Never named' },
    ],
  }
  const criteria = (toApiQuestion(q) as { criteria: Record<string, string> }).criteria
  assert.deepEqual(Object.keys(criteria), ['a'])
})

test('score criteria are an ordered array of levels', () => {
  const q: Question = {
    id: uid(),
    type: 'score',
    instructions: 'How severe is the issue',
    levels: ['Cosmetic', 'Workaround exists', 'Blocking'],
  }
  assert.deepEqual(toApiQuestion(q), {
    type: 'score',
    instructions: 'How severe is the issue',
    criteria: ['Cosmetic', 'Workaround exists', 'Blocking'],
  })
})

test('isQuestionReady demands the criteria each type needs', () => {
  assert.equal(isQuestionReady({ id: '1', type: 'noul', instructions: '' }), false)
  assert.equal(isQuestionReady({ id: '1', type: 'noul', instructions: 'It is urgent' }), true)

  // a fresh choice/score question is intentionally incomplete
  assert.equal(isQuestionReady({ ...blankQuestion('choice'), instructions: 'Pick' }), false)
  assert.equal(isQuestionReady({ ...blankQuestion('score'), instructions: 'Rate' }), false)

  assert.equal(
    isQuestionReady({
      id: '1',
      type: 'choice',
      instructions: 'Pick',
      options: [
        { key: 'a', description: 'A' },
        { key: 'b', description: 'B' },
      ],
    }),
    true,
  )
  assert.equal(
    isQuestionReady({ id: '1', type: 'score', instructions: 'Rate', levels: ['low', 'high'] }),
    true,
  )
})

test('state is sent as parsed JSON when it is JSON, and as text when it is not', () => {
  assert.deepEqual(parseState('{"food":"hotdog"}'), { food: 'hotdog' })
  assert.deepEqual(parseState('  {"a":[1,2]}  '), { a: [1, 2] })
  // a plain sentence is a perfectly valid state — pass it through untouched
  assert.equal(parseState('My card was charged twice.'), 'My card was charged twice.')
  assert.equal(parseState(''), '')
})

test('every shipped preset would be accepted by the API', () => {
  for (const preset of [...LESSONS, ...USE_CASES]) {
    assert.ok(preset.questions.length, `${preset.id} has no questions`)
    for (const [i, q] of preset.questions.entries()) {
      const full: Question = { ...q, id: `${preset.id}_${i}` }
      assert.ok(isQuestionReady(full), `${preset.id} question ${i} is incomplete`)

      const api = toApiQuestion(full) as { criteria?: unknown }
      if (q.type === 'choice') {
        assert.ok(
          api.criteria && Object.keys(api.criteria).length >= 2,
          `${preset.id} choice needs 2+ options`,
        )
      }
      if (q.type === 'score') {
        assert.ok(
          Array.isArray(api.criteria) && api.criteria.length >= 2,
          `${preset.id} score needs 2+ levels`,
        )
      }
    }
    // presets ship a JSON object state; it must survive the round trip
    assert.equal(typeof parseState(preset.state), 'object')
  }
})
