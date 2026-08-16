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
