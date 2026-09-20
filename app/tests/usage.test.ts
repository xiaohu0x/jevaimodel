import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import {
  COOLDOWN_MS,
  GUEST_RUN_LIMIT,
  RESERVE_USAGE_SQL,
  USER_DAILY_RUN_LIMIT,
} from '../functions/api/_usage.ts'

function database(): DatabaseSync {
  const db = new DatabaseSync(':memory:')
  db.exec(readFileSync(new URL('../schema.sql', import.meta.url), 'utf8'))
  return db
}

function reserve(
  db: DatabaseSync,
  actor: string,
  bucket: string,
  now: number,
  limit: number,
): number | null {
  const row = db
    .prepare(RESERVE_USAGE_SQL)
    .get(actor, bucket, now, now, now, limit, COOLDOWN_MS) as
    | { request_count: number }
    | undefined
  return row?.request_count ?? null
}

test('guest quota allows three spaced runs and rejects a fourth', () => {
  const db = database()
  const start = Date.UTC(2026, 8, 21)

  assert.equal(reserve(db, 'guest:test', 'lifetime', start, GUEST_RUN_LIMIT), 1)
  assert.equal(reserve(db, 'guest:test', 'lifetime', start + COOLDOWN_MS, GUEST_RUN_LIMIT), 2)
  assert.equal(reserve(db, 'guest:test', 'lifetime', start + COOLDOWN_MS * 2, GUEST_RUN_LIMIT), 3)
  assert.equal(reserve(db, 'guest:test', 'lifetime', start + COOLDOWN_MS * 3, GUEST_RUN_LIMIT), null)
})

test('cooldown rejects early requests without consuming allowance', () => {
  const db = database()
  const start = Date.UTC(2026, 8, 21)

  assert.equal(reserve(db, 'user:test', 'day:2026-09-21', start, USER_DAILY_RUN_LIMIT), 1)
  assert.equal(
    reserve(db, 'user:test', 'day:2026-09-21', start + COOLDOWN_MS - 1, USER_DAILY_RUN_LIMIT),
    null,
  )
  assert.equal(
    reserve(db, 'user:test', 'day:2026-09-21', start + COOLDOWN_MS, USER_DAILY_RUN_LIMIT),
    2,
  )
})

test('signed-in quota resets in a new UTC day bucket', () => {
  const db = database()
  const start = Date.UTC(2026, 8, 21)

  for (let run = 1; run <= USER_DAILY_RUN_LIMIT; run += 1) {
    assert.equal(
      reserve(
        db,
        'user:test',
        'day:2026-09-21',
        start + (run - 1) * COOLDOWN_MS,
        USER_DAILY_RUN_LIMIT,
      ),
      run,
    )
  }
  assert.equal(
    reserve(
      db,
      'user:test',
      'day:2026-09-21',
      start + USER_DAILY_RUN_LIMIT * COOLDOWN_MS,
      USER_DAILY_RUN_LIMIT,
    ),
    null,
  )
  assert.equal(reserve(db, 'user:test', 'day:2026-09-22', start, USER_DAILY_RUN_LIMIT), 1)
})
