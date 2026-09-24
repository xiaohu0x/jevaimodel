import assert from 'node:assert/strict'
import test from 'node:test'
import { classify, getRunError, type Question } from '../src/lib/engine.ts'
import { LIMITS, validAnswers, validateRequest } from '../shared/classification.ts'

const question: Question = { id: 'q1', type: 'noul', instructions: 'The message is urgent' }
const body = { state: { message: 'Please reply today.' }, questions: { q1: { type: 'noul', instructions: question.instructions } } }

test('validation preserves text context but rejects broken JSON and incomplete questions', () => {
  assert.equal(getRunError([question], 'Please reply today.'), null)
  assert.ok(getRunError([question], '{broken'))
  assert.ok(getRunError([question], 'null'))
  assert.ok(getRunError([question], ''))
  assert.ok(getRunError([question, { ...question, id: 'q2', instructions: '' }], '{}'))
  assert.ok(getRunError(Array.from({ length: 9 }, (_, i) => ({ ...question, id: String(i) })), '{}'))
})

test('duplicate choice keys cannot collapse into one option or reach the API', () => {
  const choice: Question = { ...question, type: 'choice', options: [{ key: 'billing', description: '' }, { key: ' billing ', description: '' }] }
  assert.ok(getRunError([choice], '{}'))
  assert.equal(validateRequest({ ...body, questions: { q1: { type: 'choice', instructions: 'Pick', criteria: { a: 'First', ' a ': 'Duplicate' } } } }).ok, false)
})

test('server validates every criterion and bounds its size', () => {
  for (const criteria of [['low', '', 'high'], ['low', 'x'.repeat(LIMITS.description + 1)], [1, 2]]) {
    assert.equal(validateRequest({ ...body, questions: { q1: { type: 'score', instructions: 'Rate', criteria } } }).ok, false)
  }
  assert.equal(validateRequest(body).ok, true)
})

test('answer validation requires each requested typed answer and numeric probabilities', () => {
  const parsed = validateRequest(body)
  assert.ok(parsed.ok)
  assert.equal(validAnswers(parsed.questions, {}), false)
  assert.equal(validAnswers(parsed.questions, { q1: { type: 'noul', noul: '0.9' } }), false)
  assert.equal(validAnswers(parsed.questions, { q1: { type: 'noul', noul: 1.1 } }), false)
  assert.equal(validAnswers(parsed.questions, { q1: { type: 'noul', noul: 0.9 } }), true)
})

test('Choice and Score responses retain their distinct real API contracts', () => {
  const request = validateRequest({ ...body, questions: {
    route: { type: 'choice', instructions: 'Route', criteria: { billing: 'Charges', technical: 'Bugs' } },
    rating: { type: 'score', instructions: 'Rate', criteria: ['low', 'medium', 'high'] },
  } })
  assert.ok(request.ok)
  const answers = {
    route: { type: 'choice', choice: 'technical', confidence: 0.7, probabilities: { billing: 0.1, technical: 0.9 } },
    rating: { type: 'score', score: 1.4, confidence: 0.5, probabilities: { '0': 0.1, '1': 0.4, '2': 0.5 }, legend: { '0': 'low', '1': 'medium', '2': 'high' } },
  }
  assert.equal(validAnswers(request.questions, answers), true)
  assert.equal(validAnswers(request.questions, { ...answers, route: { ...answers.route, choice: 'invented' } }), false)
  assert.equal(validAnswers(request.questions, { ...answers, rating: { ...answers.rating, score: 3 } }), false)
})

test('invalid requests make no network call', async (t) => {
  const fetcher = t.mock.method(globalThis, 'fetch', async () => { throw new Error('must not call') })
  await assert.rejects(classify([question], '{broken'), /invalid JSON/)
  assert.equal(fetcher.mock.callCount(), 0)
})

test('classify rejects partial model output instead of silently omitting a question', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ model: 'jev-test', answers: { q1: { type: 'noul', noul: 0.9 } } }))
  await assert.rejects(classify([question, { ...question, id: 'q2' }], '{}'), /incomplete or invalid/)
})

test('classify preserves cancellation and snapshots questions before a response arrives', async (t) => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(classify([question], '{}', controller.signal), { name: 'AbortError' })
  const edited = { ...question }
  t.mock.method(globalThis, 'fetch', async () => {
    edited.instructions = 'Changed while running'
    return Response.json({ model: 'jev-test', answers: { q1: { type: 'noul', noul: 0.9 } } })
  })
  const record = await classify([edited], '{}')
  assert.equal(record.results[0].question.instructions, question.instructions)
})
