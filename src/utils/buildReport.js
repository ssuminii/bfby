/**
 * Gemini의 generateJudgment 응답 → Report 화면이 그리는 형태로 변환한다.
 *
 *   type    'recommend' | 'hold' | 'avoid'
 *   score   0~100, 게이지 바늘 위치
 *   saving  버튼 라벨의 {saving} 에 들어갈 금액
 *   cards   위에서부터 순서대로 렌더된다
 *
 * 숫자(점수·금액)는 전부 여기서 계산한다. AI는 재료만 준다.
 */

import { scaleOf } from '../constants/savingScale.js'
import { isSaving } from './history.js'

// AI는 축별 좋음/주의/걸림만 판단하고, 최종 판정은 여기서 계산한다.
// 축마다 무게가 달라서 걸림 개수만 세면 안 된다.
// '이미 있나'는 비슷한 걸 갖고 있어도 용도가 다를 수 있어서, 나머지가 전부
// 좋으면 통과시킨다. 나머지 세 축은 하나만 걸려도 멈추게 한다.
//   안 쓸 물건이거나 / 세일 때문에 보고 있거나 / 감당 안 되는 금액이거나.
const LENIENT_AXIS = '이미 있나'

function verdictOf(signals) {
  const count = (s) => signals.filter((x) => x.signal === s).length
  const blocked = signals.filter((x) => x.signal === '걸림')

  if (blocked.length >= 2) return 'avoid'
  if (blocked.length === 1) {
    const onlyLenient = blocked[0].axis === LENIENT_AXIS && count('좋음') === signals.length - 1
    return onlyLenient ? 'recommend' : 'hold'
  }
  return count('주의') >= 2 ? 'hold' : 'recommend'
}

// ReasonList의 톤 키. caution이 "걸림", warn이 "주의" 라벨이다 (직관과 반대).
const TONE_BY_SIGNAL = {
  좋음: 'good',
  주의: 'warn',
  걸림: 'caution',
}

const REASON_TITLE = {
  recommend: '결과 근거',
  hold: '보류를 조언하는 이유',
  avoid: '추천하지 않는 이유',
}

// 게이지 구간(0-30 error / 30-70 caution / 70-100 info)과 판정이 어긋나지 않도록
// 판정별로 점수 범위를 고정하고, 그 안에서 신호에 따라 위치만 움직인다.
const SCORE_BAND = {
  recommend: [72, 98],
  hold: [34, 66],
  avoid: [6, 28],
}

const SIGNAL_POINT = { 좋음: 25, 주의: 12, 걸림: 0 }

const won = (n) => `${Math.round(n).toLocaleString()}원`

function scoreOf(type, signals) {
  const [lo, hi] = SCORE_BAND[type]
  if (!signals?.length) return Math.round((lo + hi) / 2)
  const raw = signals.reduce((sum, s) => sum + (SIGNAL_POINT[s.signal] ?? 0), 0) / signals.length / 25
  return Math.round(lo + raw * (hi - lo))
}

function reasonCard(type, signals, reasons) {
  const items = signals.map((s, i) => ({
    tone: TONE_BY_SIGNAL[s.signal] ?? 'warn',
    text: reasons?.[i] ?? s.answer,
  }))
  return { title: REASON_TITLE[type], items }
}

function usageCard(usage, price) {
  const total = usage.perYear * usage.years
  if (!total || !price) return null

  const unit = usage.unit || '회'
  return {
    title: '한 번 사용할 때 드는 비용 예상',
    amount: won(price / total),
    formula: `(가격 ${price.toLocaleString()}원 ÷ 예상 사용 ${usage.perYear}${unit}×${usage.years}년≈${total}${unit})`,
    footnotes: [usage.basis, usage.caveat].filter(Boolean),
  }
}

const tryFirstCard = (tryFirst) => ({
  title: '이런 선택지도 있어요',
  lead: tryFirst.lead,
  lines: [tryFirst.note].filter(Boolean),
})

const sameMonth = (iso, now) => {
  const d = new Date(iso)
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

// "지금 안 사면 이렇게 된다"를 보여주는 카드라 before 〉 after 형태로 쓴다.
function savingCard(price, history, now = new Date()) {
  const skipped = history.filter(isSaving)
  const total = skipped.reduce((sum, h) => sum + (h.price ?? 0), 0)
  const month = skipped
    .filter((h) => h.at && sameMonth(h.at, now))
    .reduce((sum, h) => sum + (h.price ?? 0), 0)

  const step = (before) => `${before.toLocaleString()}원 〉 ${(before + price).toLocaleString()}원`

  // 이번에 아끼는 금액을 "무엇 몇 번 값"으로 환산
  const tier = scaleOf(price)
  const times = Math.max(1, Math.round(price / tier.unit))

  // 누적이 닿는 지점은 한 단계 위 목표가 되므로 따로 알려준다
  const reached = scaleOf(total + price)

  return {
    title: '구매하지 않으면 아끼게 되는 비용',
    amount: won(price),
    tag: `${tier.label} ${times}${tier.counter} 값이에요`,
    footnotes: [`이번 달 절약 ${step(month)}`, `누적 ${step(total)} (${reached.label}까지)`],
  }
}

// 체크인 만족 비율로 이 카테고리의 판단 성향을 한 줄로 말해준다
const CHECKIN_VERDICT = [
  { min: 0.7, line: '이 카테고리는 판단이 잘 맞는 편이에요.' },
  { min: 0.4, line: '이 카테고리는 만족과 아쉬움이 반반이었어요.' },
  { min: 0, line: '이 카테고리는 사고 나서 아쉬우셨던 적이 많았어요.' },
]

// 리포트 화면에서 누른 버튼이다. 실제로 샀는지는 체크인 전까지 알 수 없다.
const CHOICE_LABEL = {
  skip: '안 사기로',
  buy: '사기로',
  hold: '더 고민해보기로',
}

// 0번짜리 문구가 나오지 않게 실제로 있었던 선택만 센다
function pastChoices(past) {
  const made = Object.entries(CHOICE_LABEL)
    .map(([choice, label]) => [past.filter((h) => h.choice === choice).length, label])
    .filter(([n]) => n)

  if (made.length === 1) {
    const [, label] = made[0]
    return past.length === 1
      ? `지난 1번은 ${label} 하셨어요.`
      : `지난 ${past.length}번은 모두 ${label} 하셨어요.`
  }

  const parts = made.map(([n, label]) => `${n}번은 ${label}`).join(', ')
  return `지난 ${past.length}번 중 ${parts} 하셨어요.`
}

// 체크인은 '더 고민할게요'로 미뤄둔 건에만 붙는다.
// 안 사기로·사기로 한 건 그 자리에서 결정이 끝나서 다시 묻지 않는다.
function checkinLines(past) {
  const resolved = past.filter((h) => h.choice === 'hold' && h.checkin)
  if (!resolved.length) return []

  const bought = resolved.filter((h) => h.checkin.resolved === 'buy')

  if (!bought.length) {
    return [`고민하셨던 ${resolved.length}번은 결국 사지 않으셨어요.`]
  }

  const good = bought.filter((h) => h.checkin.satisfied).length
  const how =
    good === bought.length
      ? `${bought.length}번 모두 '만족스러워요'`
      : good === 0
        ? `${bought.length}번 모두 '아쉬워요'`
        : `${bought.length}번 중 ${good}번은 '만족스러워요'`

  const head =
    bought.length === resolved.length
      ? `고민하셨던 ${resolved.length}번은 결국 다 사셨어요.`
      : `고민하셨던 ${resolved.length}번 중 ${bought.length}번은 결국 사셨어요.`

  return [
    `${head}\n${how}라고 답하셨어요.`,
    CHECKIN_VERDICT.find((v) => good / bought.length >= v.min).line,
  ]
}

// 지나간 기록만으로 쓴다. 없는 이력을 지어내지 않으려고 AI를 거치지 않는다.
function historyCard(history, category) {
  const past = category ? history.filter((h) => h.category === category) : []
  const count = past.length + 1 // 지금 보고 계신 이번 판단까지 포함
  const lead = category ? `${category} 카테고리에서` : '지금까지'
  const checkin = checkinLines(past)

  return {
    title: '내 기록',
    lines: [
      [`${lead} 지금까지 ${count}번 판단하셨어요.`, past.length && pastChoices(past)]
        .filter(Boolean)
        .join('\n'),
      ...(checkin.length
        ? checkin
        : [
            '더 고민할게요를 고르시면 얼마 뒤에 그 물건을 어떻게 하셨는지 여쭤볼게요.\n답이 쌓이면 이 카테고리에서 어떤 선택이 잘 맞았는지 알려드릴 수 있어요.',
          ]),
    ],
    ...(past.length && { tag: '내 기록 기반' }),
  }
}

export function buildReport(judgment, product, history = [], category = null) {
  const price = product?.price ?? 0
  const signals = judgment.signals ?? []
  const type = signals.length ? verdictOf(signals) : 'hold'

  const cards = [
    reasonCard(type, signals, judgment.reasons),
    judgment.usage && usageCard(judgment.usage, price),
    historyCard(history, category),
    judgment.tryFirst && tryFirstCard(judgment.tryFirst),
    type !== 'recommend' && price ? savingCard(price, history) : null,
  ].filter(Boolean)

  return {
    type,
    score: scoreOf(type, signals),
    saving: price,
    subtitle: judgment.summary,
    cards,
  }
}
