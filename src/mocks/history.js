/**
 * 화면 확인용 임시 판단 기록. 실제 기록이 하나도 없을 때만 쓰인다.
 * 데이터가 쌓이기 시작하면 이 파일은 지운다.
 *
 * 절약 기록 6건의 합이 1,245,000원이고 전부 이번 달이라,
 * 리포트 화면에 "충동구매를 6번 참았고, 총 1,245,000원 절약"으로 뜬다.
 *
 * 카테고리는 상품 이미지가 있는 셋만 쓴다 (뷰티·식품·취미·운동).
 * 나머지는 placeholder로 떨어져 카드가 비어 보인다.
 */

// 이번 달 1일에 시간만 다르게 둔다.
// 실제 기록이 항상 이보다 최신이어야 새로 담은 카드가 목록 맨 앞에 온다.
const thisMonth = (hour) => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1, hour).toISOString()
}

const record = (hour, name, category, price, extra) => ({
  at: thisMonth(hour),
  name,
  category,
  price,
  ...extra,
})

const saving = (...args) => record(...args, { type: 'avoid', choice: 'skip' })
const bought = (...args) => record(...args, { type: 'recommend', choice: 'buy' })

export const MOCK_HISTORY = [
  // 절약한 소비 — 합계 1,245,000원
  saving(2, '러닝머신', '취미·운동', 1_000_000),
  saving(5, '앰플 세트', '뷰티', 120_000),
  saving(9, '홍삼 스틱', '식품', 60_000),
  saving(13, '요가매트', '취미·운동', 35_000),
  saving(17, '비타민 세럼', '뷰티', 18_000),
  saving(21, '프로틴', '식품', 12_000),

  // 합리적인 소비
  bought(3, '클라이밍화', '취미·운동', 189_000),
  bought(7, '등산화', '취미·운동', 149_000),
  bought(11, '수분 크림', '뷰티', 62_000),
  bought(15, '견과류', '식품', 38_000),
  bought(19, '선크림', '뷰티', 29_000),
  bought(23, '원두', '식품', 24_000),

  // 보류 — 아직 결정 전이라 등급 없이 회색 카드로 뜬다
  record(25, '비타민 세럼 30ml', '뷰티', 45_000, { type: 'hold', choice: 'hold' }),
]
