/**
 * 판단 기록을 localStorage에 쌓는다.
 * 저장하는 건 결정 그 자체뿐이고, 리포트 내용은 저장하지 않는다.
 *
 *   { name, price, image?, category, type, choice, at, checkin? }
 *   choice  'buy' | 'skip' | 'hold'
 *   type    리포트 판정 ('recommend' | 'hold' | 'avoid')
 *
 * checkin은 두 가지를 담는다. 둘 다 붙을 수 있다.
 *
 *   { resolved: 'buy' | 'skip' }  살래말래에서 내린 최종 결정
 *   { satisfied: true | false }   말렸는데도 산 뒤 만족했는지
 *
 * ponytail: localStorage라 기기별로 따로 쌓인다. 계정이 생기면 서버로 옮긴다.
 */

const KEY = 'bfby.decisions'

/**
 * 절약으로 칠지 판단한다. 절약 카드와 누적 절약액이 같은 기준을 쓰도록 여기서만 정한다.
 *
 * 추천을 받고도 안 산 건 아낀 돈이 아니라 필요한 소비를 미룬 것에 가깝다.
 * 보류·비추천에서 안 사기로 한 것만 절약으로 본다.
 */
// 그 자리에서 정했든, 살래말래에서 뒤늦게 정했든 결과는 같다
const endedUpNotBuying = (record) =>
  record.choice === 'skip' || record.checkin?.resolved === 'skip'

const endedUpBuying = (record) =>
  record.choice === 'buy' || record.checkin?.resolved === 'buy'

export const isSaving = (record) =>
  endedUpNotBuying(record) && record.type !== 'recommend'

export const totalSaved = (history) =>
  history.filter(isSaving).reduce((sum, h) => sum + (h.price ?? 0), 0)

/**
 * 좋은 소비로 칠지 판단한다.
 *
 * 추천을 받고 실제로 사기로 했거나,
 * 보류·비추천 뒤 실제 사용 만족도가 좋았던 소비를 좋은 소비로 본다.
 * 절약과는 겹치지 않는다. 안 산 건 절약, 잘 산 건 좋은 소비다.
 */
export const isGoodSpending = (record) =>
  endedUpBuying(record) &&
  (record.type === 'recommend' || record.checkin?.satisfied === true)

// 만족도까지 답했는지. 답하기 전까지는 어떤 카드인지 정해지지 않는다.
const hasSatisfaction = (record) => typeof record.checkin?.satisfied === 'boolean'

/**
 * 말렸는데도 산 경우. 잘한 소비인지 아직 알 수 없어 카드 발급을 미뤄 둔다.
 * 살래말래에서 뒤늦게 사기로 한 것도 같다. 원래 판정이 말린 쪽이면 마찬가지다.
 */
export const isPendingCard = (record) =>
  endedUpBuying(record) && record.type !== 'recommend' && !hasSatisfaction(record)

/**
 * 이번 결정으로 어떤 카드를 얻는지 판별한다. 얻는 카드가 없으면 null.
 *
 * 더 고민할게요는 결정 자체를 미룬 것이라 카드가 아니라 살래말래 탭으로 간다.
 */
export const cardKindOf = (record) => {
  if (isGoodSpending(record)) return 'good'
  if (isSaving(record)) return 'saving'
  if (isPendingCard(record)) return 'pending'
  return null
}

export function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // 저장소를 못 읽어도 리포트는 떠야 한다
    return []
  }
}

// at을 여기서 붙이므로, 저장된 모습 그대로를 돌려줘야 호출부가 같은 기록을 가리킬 수 있다
export function saveDecision(record) {
  const saved = { ...record, at: new Date().toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify([...loadHistory(), saved]))
  } catch {
    // 기록은 부가 기능이라 저장 실패가 상담 흐름을 막으면 안 된다
  }
  return saved
}

// 보류 카드 기록에 최종 결정(checkin)을 붙인다. at으로 레코드를 특정한다.
export function resolveHold(at, resolved, checkin = {}) {
  try {
    const history = loadHistory()
    const nextCheckin =
      typeof resolved === 'object' ? resolved : { resolved, ...checkin }
    const updated = history.map((r) =>
      r.at === at && (r.choice === 'hold' || isPendingCard(r))
        ? { ...r, checkin: nextCheckin }
        : r
    )
    localStorage.setItem(KEY, JSON.stringify(updated))
    return updated.find((r) => r.at === at) ?? null
  } catch {
    return null
  }
}
