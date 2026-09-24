import assert from 'node:assert/strict'
import test from 'node:test'
import { DRAFT_KEY, emptyDraft, readDraft, saveDraft } from '../src/lib/draft.ts'

test('drafts preserve unfinished inputs and tolerate broken browser storage', () => {
  const values = new Map<string, string>()
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  const draft = { ...emptyDraft(), state: '{unfinished', questions: [{ id: 'q1', type: 'score' as const, instructions: '', levels: ['', ''] }] }
  assert.equal(saveDraft(storage, draft), true)
  assert.deepEqual(readDraft(storage), draft)
  values.set(DRAFT_KEY, '{broken')
  assert.equal(readDraft(storage), null)
  assert.equal(saveDraft({ setItem() { throw new Error('quota exceeded') } }, draft), false)
})

test('invalid saved question shapes are discarded before rendering', () => {
  const raw = JSON.stringify({ version: 1, state: '{}', questions: [{ id: 'q1', type: 'choice', instructions: 'Choose', options: [null] }] })
  assert.equal(readDraft({ getItem: () => raw }), null)
})
