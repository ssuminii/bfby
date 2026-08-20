import { comparableRecords, isGoodSpending, isSaving, shortName } from './history.js'

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
 * 얼마나 쓸지에 답한 말에서 쓰임의 결을 뽑는다.
 *
 * 값이 비슷하다고 아무 기록이나 꺼내면 "이동형 옷장을 보는데 안마의자 이야기"가 된다.
 * 같은 결로 고민했던 기록이라야 "나도 저랬지" 하고 읽힌다.
 */
const USE_RHYTHM = [
  ['계절', /겨울|여름|장마|환절기|철에|시즌|명절/],
  ['일상', /매일|아침|저녁|출퇴근|퇴근|평소|늘|자주|여기저기/],
  ['주기', /주말|주 ?\d|일주일|한 주|이틀/],
  ['이따금', /한 달|가끔|모임|약속|기념일|틈틈이|여행|있을 때/],
]

const rhythmOf = (text = '') => USE_RHYTHM.find(([, re]) => re.test(text))?.[0] ?? null

/**
 * 지금 보는 상품과 가장 잘 겹치는 기록 하나.
 * 쓰임의 결이 같은 걸 먼저 보고, 그다음에 값이 가까운 걸 본다.
 */
function bestMatch(candidates, price, rhythm) {
  const gapOf = (record) => Math.abs(Math.log((record.price || 1) / (price || 1)))

  return candidates
    .map((record) => ({
      record,
      offRhythm: rhythm && rhythmOf(record.usageAnswer) === rhythm ? 0 : 1,
      gap: gapOf(record),
    }))
    .sort((a, b) => a.offRhythm - b.offRhythm || a.gap - b.gap)
    .at(0)?.record
}

/**
 * 가장 도움이 될 지난 기록 한 건을 문장으로 만든다.
 *
 * 그때 뭐라고 답했는지와 나중에 어떻게 됐는지가 모두 있어야 이야기가 된다.
 * 둘 중 하나라도 없으면 "예전에 비슷한 걸 사셨어요" 수준이 되어 도움이 안 된다.
 *
 * 판정과 어긋나는 기록은 꺼내지 않는다. 보류를 조언하면서 잘 쓰고 있는 물건
 * 이야기를 하면, 카드가 스스로 자기 결론을 무너뜨린다.
 */
function pastStory(past, type, price, rhythm, now) {
  const told = past.filter(
    (r) => r.usageAnswer && r.checkin?.usage && r.checkin.satisfied === (type === 'recommend'),
  )
  const pick = bestMatch(told, price, rhythm)
  if (!pick) return null

  // 답변은 그대로 인용한다. 어미를 바꾸려 들면 문장이 깨지고, 고친 말은 그 사람 말이 아니다.
  // 이어주는 말만 판정에 맞춘다. '하셨는데'는 기대와 결과가 어긋났다는 뜻이라
  // 잘 쓰고 있는 기록에 붙이면 문장이 스스로 뒤집힌다.
  const connective = type === 'recommend' ? '라고 하셨고,' : '라고 하셨는데,'

  return (
    `${whenLabel(pick.at, now)} 보셨던 ${shortName(pick.name)}도\n` +
    `**'${pick.usageAnswer}'**${connective}\n` +
    `${gapLabel(pick)} **'${pick.checkin.usage}'**라고 답하셨어요.`
  )
}

// 이 카테고리에서 사고 나서 어땠는지의 비율.
// 판정과 같은 쪽을 센다. 추천 카드에 후회율을 붙이면 카드가 자기 결론을 깎아먹는다.
function outcomeRatio(past, category, type) {
  const answered = past.filter((r) => typeof r.checkin?.satisfied === 'boolean')
  if (answered.length < 2) return null

  const looksGood = type === 'recommend'
  const hits = answered.filter((r) => r.checkin.satisfied === looksGood).length
  // 한 번도 없으면 굳이 꺼낼 말이 아니다
  if (!hits) return null

  const tail = looksGood ? '만족**한다고' : '후회**된다고'
  return `**${category} 카테고리**에서 평균적으로 **${answered.length}번 중 ${hits}번 꼴로 ${tail} 하셨어요.`
}

// 지난 선택을 한마디로. 기록에 남은 사실만 쓴다.
function outcomeOf(record) {
  if (isSaving(record)) return '결국 안 사기로 하셨어요'
  if (record.checkin?.satisfied === false) return '사고 나서 아쉬웠다고 하셨어요'
  if (isGoodSpending(record)) return '사고 나서 잘 쓰고 계시다고 하셨어요'
  return '사기로 하셨어요'
}

/**
 * 이야기를 못 만들 때 쓰는 한 발 물러선 문장.
 *
 * 그때 뭐라고 답했는지가 없어도, 같은 카테고리에서 값이 비슷했던 물건을
 * 어떻게 했는지는 말해줄 수 있다. 카테고리 밖으로는 나가지 않는다.
 */
function outcomeStory(comparable, type, price, rhythm, now) {
  // 여기서도 판정과 같은 방향의 기록만 고른다
  const matches =
    type === 'recommend'
      ? comparable.filter(isGoodSpending)
      : comparable.filter((record) => record.checkin?.satisfied === false || isSaving(record))

  const pick = bestMatch(matches, price, rhythm)
  if (!pick) return null

  return (
    `${whenLabel(pick.at, now)} 보셨던 ${shortName(pick.name)}도 비슷한 값이었는데,\n` +
    `${outcomeOf(pick)}.`
  )
}

// 지나간 기록만으로 쓴다. 없는 이력을 지어내지 않으려고 AI를 거치지 않는다.
function historyCard(history, category, price, type, rhythm, now = new Date()) {
  const past = category ? history.filter((h) => h.category === category) : []

  // 이야기는 값이 비슷한 기록에서만 끌어온다. 비율은 카테고리 전체로 세야 표본이 남는다.
  const comparable = category ? comparableRecords(history, category, price) : []

  // 값이 비슷한 기록이 있을 때만 카테고리 비율을 함께 붙인다.
  // 200만원 냉장고에 8만원짜리들로 낸 비율을 갖다 대면 숫자가 남의 것이 된다.
  const story =
    pastStory(comparable, type, price, rhythm, now) ??
    outcomeStory(comparable, type, price, rhythm, now)
  const lines = [story, comparable.length && outcomeRatio(past, category, type)].filter(Boolean)

  // 들려줄 이야기가 없으면 앞으로 쌓일 거라고만 알린다
  if (!lines.length) {
    return {
      title: '내 기록',
      lines: [
        past.length
          ? `${category} 중에 이만한 값을 보신 건 이번이 처음이에요.\n어떠셨는지 알려주시면 다음에 견줘서 알려드릴게요.`
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
  // 이번 상담에서 얼마나 쓸지 답한 말. 지난 기록을 고를 때 결을 맞추는 데 쓴다.
  const rhythm = rhythmOf(signals.find((s) => s.axis === '얼마나 쓸까')?.answer ?? '')

  const cards = [
    reasonCard(type, signals, judgment.reasons),
    judgment.usage && usageCard(judgment.usage, price),
    historyCard(history, category, price, type, rhythm),
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
