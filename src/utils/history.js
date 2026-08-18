/**
 * 판단 기록을 localStorage에 쌓는다.
 * 저장하는 건 결정 그 자체뿐이고, 리포트 내용은 저장하지 않는다.
 *
 *   { name, price, image?, category, type, choice, at, checkin? }
 *   choice  'buy' | 'skip' | 'hold'
 *   type    리포트 판정 ('recommend' | 'hold' | 'avoid')
 *
 * checkin은 choice가 'hold'인 기록에만 붙는다.
 * 안 사기로·사기로 한 건 그 자리에서 결정이 끝나서 다시 묻지 않는다.
 *
 *   { resolved: 'skip' }                        고민하다 결국 안 삼
 *   { resolved: 'buy', satisfied: true|false }  결국 샀고, 써보니 어땠는지
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
// 그 자리에서 안 사기로 했든, 고민하다 결국 안 샀든 결과는 같다.
// checkin은 choice가 'hold'인 기록에만 붙으므로 choice를 따로 볼 필요가 없다.
const endedUpNotBuying = (record) =>
  record.choice === 'skip' || record.checkin?.resolved === 'skip'

export const isSaving = (record) =>
  endedUpNotBuying(record) && record.type !== 'recommend'

export const totalSaved = (history) =>
  history.filter(isSaving).reduce((sum, h) => sum + (h.price ?? 0), 0)

/**
 * 좋은 소비로 칠지 판단한다.
 *
 * 추천을 받고 실제로 사기로 한 것만 좋은 소비다.
 * 보류·비추천에서 "그래도 살래요"를 누른 건 여기 들어가지 않는다.
 * 절약과는 겹치지 않는다. 안 산 건 절약, 잘 산 건 좋은 소비다.
 */
export const isGoodSpending = (record) =>
  record.choice === 'buy' && record.type === 'recommend'

/**
 * 이번 결정으로 어떤 카드를 얻는지 판별한다. 얻는 카드가 없으면 null.
 *
 * 추천을 받고도 안 샀거나, 말렸는데 그래도 산 경우는 카드가 없다.
 */
export const cardKindOf = (record) => {
  if (isGoodSpending(record)) return 'good'
  if (isSaving(record)) return 'saving'
  if (record.choice === 'hold') return 'pending'
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

export function saveDecision(record) {
  try {
    const next = [...loadHistory(), { ...record, at: new Date().toISOString() }]
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 기록은 부가 기능이라 저장 실패가 상담 흐름을 막으면 안 된다
  }
}
