import assert from 'node:assert/strict'
import test from 'node:test'
import {
  pendingDecisions,
  regretDecisions,
  recentSavingMonths,
  reportHistorySummary,
  spendingCollections,
} from './reportHistory.js'

const record = (overrides) => ({
  name: '상품',
  price: 0,
  category: '전자기기',
  type: 'hold',
  choice: 'skip',
  at: '2026-03-10T12:00:00',
  ...overrides,
})

test('최근 6개월 절약 기록과 누적 통계를 기준 월로 계산한다', () => {
  const history = [
    record({ price: 50_000 }),
    record({ price: 100_000, type: 'avoid', at: '2026-04-10T12:00:00' }),
    record({ price: 200_000, choice: 'hold', checkin: { resolved: 'skip' }, at: '2026-07-10T12:00:00' }),
    record({ price: 300_000, type: 'avoid', at: '2026-08-10T12:00:00' }),
    record({ price: 500_000, type: 'recommend', at: '2026-08-11T12:00:00' }),
  ]

  const summary = reportHistorySummary(history, new Date(2026, 7, 18))

  assert.deepEqual(summary.months.map((month) => month.label), ['3월', '4월', '5월', '6월', '7월', '8월'])
  assert.deepEqual(summary.months.map((month) => month.amount), [50_000, 100_000, 0, 0, 200_000, 300_000])
  assert.equal(summary.currentMonthSaved, 300_000)
  assert.equal(summary.totalSaved, 650_000)
  assert.equal(summary.savingCount, 4)
  assert.equal(summary.monthlyAverage, 108_333)
  assert.equal(summary.isIncreasing, true)
})

test('월 목록은 연도가 바뀌어도 과거부터 현재 순서로 만든다', () => {
  const months = recentSavingMonths([], new Date(2026, 1, 1))
  assert.deepEqual(months.map((month) => month.label), ['9월', '10월', '11월', '12월', '1월', '2월'])
})

test('좋은 소비와 절약 소비를 분리한다', () => {
  const good = record({ choice: 'buy', type: 'recommend', at: '2026-08-01T12:00:00' })
  const saving = record({ price: 10_000, at: '2026-08-02T12:00:00' })
  const pending = record({ choice: 'buy', type: 'avoid', at: '2026-08-03T12:00:00' })
  const resolved = record({
    choice: 'hold',
    checkin: { resolved: 'buy', satisfied: true },
    at: '2026-08-04T12:00:00',
  })
  const history = [good, saving, pending, resolved]

  assert.deepEqual(spendingCollections(history), {
    good: [resolved, good],
    saving: [saving],
  })
  assert.deepEqual(pendingDecisions(history), [pending])
})

test('후회한 소비와 보류중 상품을 따로 모은다', () => {
  const regret = record({
    choice: 'buy',
    type: 'avoid',
    checkin: { resolved: 'buy', satisfied: false },
    at: '2026-08-05T12:00:00',
  })
  const resolvedHappy = record({
    choice: 'buy',
    type: 'hold',
    checkin: { resolved: 'buy', satisfied: true },
    at: '2026-08-04T12:00:00',
  })
  const pending = record({ choice: 'buy', type: 'hold', at: '2026-08-06T12:00:00' })
  const history = [resolvedHappy, pending, regret]

  assert.deepEqual(regretDecisions(history), [regret])
  assert.deepEqual(pendingDecisions(history), [pending])
})
