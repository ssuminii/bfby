/**
 * 판단 기록을 localStorage에 쌓는다.
 * 저장하는 건 결정 그 자체뿐이고, 리포트 내용은 저장하지 않는다.
 *
 *   { name, price, category, type, choice, at }
 *   choice  'buy' | 'skip' | 'hold'
 *   type    리포트 판정 ('recommend' | 'hold' | 'avoid')
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
export const isSaving = (record) =>
  record.choice === 'skip' && record.type !== 'recommend'

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
