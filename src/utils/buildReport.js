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

// 선택지는 여러 개일 수 있다. 예전 응답이 객체 하나였던 것도 받아준다.
const tryFirstCard = (tryFirst, hasRecords) => {
  const options = (Array.isArray(tryFirst) ? tryFirst : [tryFirst]).filter(
    (option) => option?.lead,
  )
  if (!options.length) return null

  // 참고할 기록이 있었을 때만 출처를 밝힌다. 없으면 일반적인 제안일 뿐이다.
  return {
    title: '이런 선택지도 있어요',
    options,
    ...(hasRecords && { tag: '내 기록 기반' }),
  }
}

// 세는 말은 숫자보다 우리말이 눈에 잘 들어온다
const COUNT_WORDS = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열']
const countWord = (n) => COUNT_WORDS[n] ?? String(n)


// "3월에", "지난달에"처럼 문장에 그대로 끼울 수 있는 형태로 만든다
function whenLabel(iso, now) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  const months =
    (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())

  if (months <= 0) return '이번 달에'
  if (months === 1) return '지난달에'
  if (months < 12) return `${date.getMonth() + 1}월에`
  return `작년 ${date.getMonth() + 1}월에`
}

// 구매하고 체크인까지 걸린 기간
function gapLabel(record) {
  const bought = new Date(record.at)
  const checked = new Date(record.checkin?.at ?? '')
  if (Number.isNaN(checked.getTime())) return '얼마 뒤'

  const months = Math.max(
    1,
    (checked.getFullYear() - bought.getFullYear()) * 12 + (checked.getMonth() - bought.getMonth()),
  )
  return months <= 3 ? `${countWord(months)} 달 뒤엔` : `${months}개월 뒤엔`
}

/**
 * 가장 도움이 될 지난 기록 한 건을 문장으로 만든다.
 *
 * 그때 뭐라고 답했는지와 나중에 어떻게 됐는지가 모두 있어야 이야기가 된다.
 * 둘 중 하나라도 없으면 "예전에 비슷한 걸 사셨어요" 수준이 되어 도움이 안 된다.
 */
function pastStory(past, now) {
  const told = past.filter((r) => r.usageAnswer && r.checkin?.usage)
  if (!told.length) return null

  // 아쉬웠던 기록이 더 도움이 된다. 없으면 가장 최근 것을 쓴다.
  const pick = told.find((r) => r.checkin.satisfied === false) ?? told[told.length - 1]

  // 답변은 그대로 인용한다. 어미를 바꾸려 들면 문장이 깨지고, 고친 말은 그 사람 말이 아니다.
  // '하셨는데'로 이어야 기대와 결과가 어긋났다는 게 읽힌다.
  return (
    `${whenLabel(pick.at, now)} 보셨던 ${pick.name}도\n` +
    `**'${pick.usageAnswer}'**라고 하셨는데,\n` +
    `${gapLabel(pick)} **'${pick.checkin.usage}'**라고 답하셨어요.`
  )
}

// 이 카테고리에서 사고 나서 후회한 비율
function regretRatio(past, category) {
  const answered = past.filter((r) => typeof r.checkin?.satisfied === 'boolean')
  if (answered.length < 2) return null

  const regret = answered.filter((r) => !r.checkin.satisfied).length
  // 후회한 적이 없으면 굳이 꺼낼 말이 아니다
  if (!regret) return null

  return `**${category} 카테고리**에서 평균적으로 **${answered.length}번 중 ${regret}번 꼴로 후회**된다고 하셨어요.`
}

// 지나간 기록만으로 쓴다. 없는 이력을 지어내지 않으려고 AI를 거치지 않는다.
function historyCard(history, category, now = new Date()) {
  const past = category ? history.filter((h) => h.category === category) : []

  const lines = [pastStory(past, now), regretRatio(past, category)].filter(Boolean)

  // 들려줄 이야기가 없으면 앞으로 쌓일 거라고만 알린다
  if (!lines.length) {
    return {
      title: '내 기록',
      lines: [
        past.length
          ? `${category}는 지금까지 ${past.length}번 판단하셨어요.\n사고 나서 어떠셨는지 알려주시면 다음 조언에 반영할게요.`
          : '이 카테고리는 이번이 처음이에요.\n기록이 쌓이면 예전 선택과 견줘서 알려드릴게요.',
      ],
    }
  }

  return { title: '내 기록', lines, tag: '내 기록 기반' }
}

export function buildReport(judgment, product, history = [], category = null) {
  const price = product?.price ?? 0
  const signals = judgment.signals ?? []
  const type = signals.length ? verdictOf(signals) : 'hold'
  const past = category ? history.filter((record) => record.category === category) : []

  const cards = [
    reasonCard(type, signals, judgment.reasons),
    judgment.usage && usageCard(judgment.usage, price),
    historyCard(history, category),
    // 살 만하다고 판단했으면 굳이 대여를 권하지 않는다
    type !== 'recommend' && judgment.tryFirst ? tryFirstCard(judgment.tryFirst, past.length > 0) : null,
  ].filter(Boolean)

  return {
    type,
    score: scoreOf(type, signals),
    saving: price,
    subtitle: judgment.summary,
    cards,
  }
}
