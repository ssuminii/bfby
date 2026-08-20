import test from 'node:test'
import assert from 'node:assert/strict'
import { MOCK_HISTORY } from './history.js'
import { KINDS } from '../constants/productKind.js'

/**
 * 소분류마다 실제로 있을 법한 값의 위쪽 끝.
 * 화장품에 300만원짜리는 없지만 신발·가방에는 있다.
 */
const CAP = {
  휴대기기: 3_000_000,
  '컴퓨터·주변': 4_000_000,
  '집에 두는 가전': 4_000_000,
  주방: 1_500_000,
  '청소·세탁': 2_000_000,
  '수납·가구': 3_000_000,
  '욕실·위생': 500_000,
  운동기구: 2_000_000,
  아웃도어: 2_000_000,
  취미장비: 3_000_000,
  화장품: 500_000,
  미용기기: 1_000_000,
  '간식·음료': 300_000,
  식재료: 500_000,
  건강식품: 500_000,
  옷: 3_000_000,
  '신발·가방': 5_000_000,
}

// comparableRecords가 값을 두 배까지 벌어진 것만 묶으므로, 층을 네 배씩 올려도
// 앞뒤가 맞물린다. 이 격자를 다 채우면 그 사이 어떤 값이 들어와도 걸린다.
const RUNGS = (cap) => {
  const rungs = []
  for (let price = 12_000; price <= cap; price *= 4) rungs.push(price)
  return rungs
}

const withinBand = (a, b) => (a > b ? a / b : b / a) <= 2

/**
 * 내 기록 카드는 소분류·가격대·판정 방향이 모두 맞는 기록만 꺼낸다.
 * 그 세 칸 중 하나라도 비면 "이만한 값을 보신 건 이번이 처음이에요"만 나온다.
 * 소분류를 새로 만들었으면 기록도 같이 넣어야 이 테스트가 통과한다.
 */
test('소분류마다 값의 층별로 만족·불만족 기록이 있다', () => {
  const checkedIn = MOCK_HISTORY.filter((r) => typeof r.checkin?.satisfied === 'boolean')
  const missing = []

  for (const kinds of Object.values(KINDS)) {
    for (const kind of kinds) {
      assert.ok(CAP[kind], `${kind}의 값 상한이 없어요. 소분류를 늘렸으면 여기도 채워주세요`)

      const rows = checkedIn.filter((r) => r.kind === kind)
      for (const price of RUNGS(CAP[kind])) {
        for (const satisfied of [true, false]) {
          const found = rows.some(
            (r) => r.checkin.satisfied === satisfied && withinBand(r.price, price),
          )
          if (!found) {
            missing.push(`${kind} ${price.toLocaleString()}원 ${satisfied ? '만족' : '불만족'}`)
          }
        }
      }
    }
  }

  assert.deepEqual(missing, [], `견줄 기록이 없는 칸:\n  ${missing.join('\n  ')}`)
})

test('기록의 소분류는 모두 KINDS 안에 있다', () => {
  const known = new Set(
    Object.entries(KINDS).flatMap(([category, kinds]) => kinds.map((k) => `${category}/${k}`)),
  )
  const strays = MOCK_HISTORY.filter((r) => r.kind && !known.has(`${r.category}/${r.kind}`))

  assert.deepEqual(
    strays.map((r) => `${r.name}: ${r.category}/${r.kind}`),
    [],
  )
})
