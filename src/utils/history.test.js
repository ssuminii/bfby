import assert from 'node:assert/strict'
import test from 'node:test'
import { isPendingCard, mergeHistory, resolveHold } from './history.js'

const makeStorage = () => {
  const store = new Map()

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
  }
}

test('saved history replaces mock history with the same at value', () => {
  const pendingMock = {
    at: '2026-08-18T12:00:00.000Z',
    name: 'pending product',
    type: 'hold',
    choice: 'buy',
  }
  const resolved = {
    ...pendingMock,
    checkin: { resolved: 'buy', satisfied: true },
  }

  assert.deepEqual(mergeHistory([pendingMock], [resolved]), [resolved])
})

test('saved records missing from mock history are preserved', () => {
  const mock = { at: '2026-08-18T12:00:00.000Z', name: 'mock record' }
  const saved = { at: '2026-08-19T12:00:00.000Z', name: 'saved record' }

  assert.deepEqual(mergeHistory([mock], [saved]), [mock, saved])
})

test('mock pending records are persisted when checked in', () => {
  globalThis.localStorage = makeStorage()
  const pendingMock = {
    at: '2026-08-18T12:00:00.000Z',
    name: 'pending product',
    type: 'hold',
    choice: 'buy',
  }

  const updated = resolveHold(
    pendingMock.at,
    { resolved: 'buy', satisfied: false },
    {},
    pendingMock,
  )

  assert.deepEqual(updated, {
    ...pendingMock,
    checkin: { resolved: 'buy', satisfied: false },
  })
  assert.deepEqual(JSON.parse(localStorage.getItem('bfby.decisions')), [updated])
})

test('pending records stop being pending after satisfaction check', () => {
  const pending = {
    at: '2026-08-18T12:00:00.000Z',
    name: 'pending product',
    type: 'hold',
    choice: 'buy',
  }
  const resolved = {
    ...pending,
    checkin: { resolved: 'buy', satisfied: false },
  }

  assert.equal(isPendingCard(pending), true)
  assert.equal(isPendingCard(resolved), false)
})

test('skip reason completion removes a bought hold record from pending', () => {
  globalThis.localStorage = makeStorage()
  const pending = {
    at: '2026-08-18T12:00:00.000Z',
    name: 'pending product',
    type: 'hold',
    choice: 'buy',
  }

  const withReason = resolveHold(pending.at, 'skip', { reason: 'too expensive' }, pending)

  assert.deepEqual(withReason.checkin, { resolved: 'skip', reason: 'too expensive' })
  assert.equal(isPendingCard(withReason), false)
  assert.deepEqual(JSON.parse(localStorage.getItem('bfby.decisions')), [withReason])
})
