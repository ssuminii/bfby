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
  const skipped = history.filter((h) => h.choice === 'skip')
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

// 저장된 건 리포트 화면에서 누른 버튼뿐이다. 실제로 샀는지는 알 수 없으므로
// "구매하셨어요"처럼 행동을 단정하지 말고 그때의 선택으로만 말한다.
const CHOICE_LABEL = {
  skip: '안 사기로 하셨어요',
  buy: '사기로 하셨어요',
  hold: '더 고민해보기로 하셨어요',
}

// 지나간 결정만으로 쓴다. 없는 이력을 지어내지 않으려고 AI를 거치지 않는다.
function historyCard(history, category, signals) {
  const past = category ? history.filter((h) => h.category === category) : []

  // 비교할 기록이 아직 없으면 이번 답변을 정리해준다
  if (!past.length) {
    const answers = signals.map((s) => s.answer).filter(Boolean)
    return {
      title: '내 기록',
      lines: [
        answers.length ? `이번에는 이렇게 답하셨어요.\n${answers.join(' · ')}` : null,
        '다음에 비슷한 걸 고민하실 때 오늘의 선택을 함께 보여드릴게요.',
      ].filter(Boolean),
    }
  }

  // 0번짜리 문구가 나오지 않게 실제로 있었던 선택만 센다
  const made = Object.entries(CHOICE_LABEL)
    .map(([choice, label]) => [past.filter((h) => h.choice === choice).length, label])
    .filter(([count]) => count)
    .map(([count, label]) => `${count}번은 ${label}`)

  const saved = past
    .filter((h) => h.choice === 'skip')
    .reduce((sum, h) => sum + (h.price ?? 0), 0)

  return {
    title: '내 기록',
    lines: [
      `${category} 카테고리는 지금까지 ${past.length}번 고민하셨어요.\n그중 ${made.join(', ')}.`,
      saved ? `안 사기로 하신 금액을 모두 더하면 ${saved.toLocaleString()}원이에요.` : null,
    ].filter(Boolean),
    tag: '내 기록 기반',
  }
}

export function buildReport(judgment, product, history = [], category = null) {
  const price = product?.price ?? 0
  const signals = judgment.signals ?? []
  const type = signals.length ? verdictOf(signals) : 'hold'

  const cards = [
    reasonCard(type, signals, judgment.reasons),
    judgment.usage && usageCard(judgment.usage, price),
    historyCard(history, category, signals),
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
