/**
 * 화면 확인용 임시 판단 기록.
 * 실제 기록이 아직 없을 때도 리포트 페이지 구조를 볼 수 있게 도와준다.
 */

const thisMonth = (day, hour = 12) => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), day, hour).toISOString()
}

const record = (day, name, category, price, extra) => ({
  at: thisMonth(day),
  name,
  category,
  price,
  ...extra,
})

const saving = (...args) => record(...args, { type: 'avoid', choice: 'skip' })
const bought = (...args) => record(...args, { type: 'recommend', choice: 'buy' })

export const MOCK_HISTORY = [
  saving(2, '러닝 머신', '취미·운동', 1_000_000),
  saving(4, '커플 세트', '뷰티', 120_000),
  saving(6, '텍사스 스테이크', '식품', 60_000),
  saving(8, '요가 매트', '취미·운동', 35_000),
  saving(10, '비타민 드링크', '뷰티', 18_000),
  saving(12, '프로틴 바', '식품', 12_000),

  bought(3, '드라이백', '취미·운동', 189_000),
  bought(5, '백팩', '취미·운동', 149_000),
  bought(7, '선크림', '뷰티', 62_000),
  bought(9, '견과류', '식품', 38_000),
  bought(11, '핸드크림', '뷰티', 29_000),
  bought(13, '만두', '식품', 24_000),

  record(15, '미니 가습기', '취미·운동', 79_000, {
    type: 'hold',
    choice: 'buy',
    checkin: { resolved: 'buy', satisfied: false },
  }),
  record(16, '크림 치즈 쿠키', '식품', 16_000, {
    type: 'avoid',
    choice: 'buy',
    checkin: { resolved: 'buy', satisfied: false },
  }),

  record(18, '비타민 세럼 30ml', '뷰티', 45_000, { type: 'hold', choice: 'buy' }),
  record(19, '블루투스 스피커', '취미·운동', 129_000, { type: 'avoid', choice: 'buy' }),
  record(20, '프로틴 믹스', '식품', 34_000, { type: 'hold', choice: 'buy' }),
]
