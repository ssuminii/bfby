/**
 * 화면 확인용 임시 판단 기록.
 * 실제 기록이 아직 없을 때도 리포트 페이지 구조를 볼 수 있게 도와준다.
 *
 * usageAnswer는 상담에서 "얼마나 쓸까"에 답한 내용이고,
 * checkin.usage는 나중에 실제로 얼마나 썼는지 답한 내용이다.
 * 내 기록 카드가 "그때 이렇게 답하셨는데 결과는 이랬다"를 말하려면 둘 다 필요하다.
 */

const at = (monthsAgo, day, hour = 12) => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() - monthsAgo, day, hour).toISOString()
}

const record = (monthsAgo, day, name, category, price, extra) => ({
  at: at(monthsAgo, day),
  name,
  category,
  price,
  ...extra,
})

const saving = (...args) => record(...args, { type: 'avoid', choice: 'skip' })
const bought = (...args) => record(...args, { type: 'recommend', choice: 'buy' })

// 사놓고 어땠는지까지 답한 이력. 체크인 시점은 한 달 뒤로 잡는다.
const afterBuying = (satisfied) => (monthsAgo, day, name, category, price, usageAnswer, usage) =>
  record(monthsAgo, day, name, category, price, {
    type: 'hold',
    choice: 'buy',
    usageAnswer,
    checkin: { resolved: 'buy', satisfied, usage, at: at(monthsAgo - 1, day) },
  })

const regretted = afterBuying(false)
const satisfied = afterBuying(true)

export const MOCK_HISTORY = [
  saving(0, 2, '러닝 머신', '취미·운동', 1_000_000),
  saving(0, 4, '커플 세트', '뷰티', 120_000),
  saving(0, 6, '텍사스 스테이크', '식품', 60_000),
  saving(0, 8, '요가 매트', '취미·운동', 35_000),
  saving(0, 10, '비타민 드링크', '뷰티', 18_000),
  saving(0, 12, '프로틴 바', '식품', 12_000),

  bought(0, 3, '드라이백', '취미·운동', 189_000),
  bought(0, 5, '백팩', '취미·운동', 149_000),
  bought(0, 7, '선크림', '뷰티', 62_000),
  bought(0, 9, '견과류', '식품', 38_000),
  bought(0, 11, '핸드크림', '뷰티', 29_000),
  bought(0, 13, '만두', '식품', 24_000),

  // 사놓고 어땠는지까지 답한 이력. 내 기록 카드가 이걸 근거로 이야기한다.
  // 카테고리마다 있어야 어떤 상품을 보든 지난 선택과 견줘줄 수 있다.
  regretted(4, 12, '에어프라이어', '생활용품', 89_000, '주말에만 쓸 것 같아요', '거의 안 썼어요'),
  regretted(7, 5, '전동 칫솔', '생활용품', 68_000, '매일 쓸 것 같아요', '몇 번 쓰고 말았어요'),
  regretted(9, 21, '가습기', '생활용품', 79_000, '겨울에만 쓸 것 같아요', '거의 안 썼어요'),
  satisfied(2, 8, '수납 선반', '생활용품', 42_000, '자주 쓸 것 같아요', '매일 잘 쓰고 있어요'),

  regretted(5, 9, '태블릿', '전자기기', 690_000, '매일 들고 다닐 것 같아요', '집에만 두고 있어요'),
  regretted(8, 17, '블루투스 키보드', '전자기기', 89_000, '자주 쓸 것 같아요', '거의 안 썼어요'),
  satisfied(3, 22, '무선 이어폰', '전자기기', 199_000, '출퇴근할 때 쓸 것 같아요', '매일 쓰고 있어요'),

  regretted(6, 14, '캠핑 의자', '취미·운동', 120_000, '한 달에 두세 번 쓸 것 같아요', '한 번 쓰고 넣어뒀어요'),
  satisfied(3, 6, '등산화', '취미·운동', 149_000, '주말마다 신을 것 같아요', '주말마다 잘 신고 있어요'),

  regretted(5, 25, '고데기', '뷰티', 58_000, '아침마다 쓸 것 같아요', '몇 번 쓰고 말았어요'),
  satisfied(2, 19, '선크림', '뷰티', 32_000, '매일 바를 것 같아요', '매일 쓰고 있어요'),

  regretted(6, 3, '건강식품 정기구독', '식품', 96_000, '꾸준히 먹을 것 같아요', '반도 못 먹었어요'),

  record(0, 15, '미니 가습기', '취미·운동', 79_000, {
    type: 'hold',
    choice: 'buy',
    checkin: { resolved: 'buy', satisfied: false },
  }),
  record(0, 16, '크림 치즈 쿠키', '식품', 16_000, {
    type: 'avoid',
    choice: 'buy',
    checkin: { resolved: 'buy', satisfied: false },
  }),

  record(0, 18, '비타민 세럼 30ml', '뷰티', 45_000, { type: 'hold', choice: 'buy' }),
  record(0, 19, '블루투스 스피커', '취미·운동', 129_000, { type: 'avoid', choice: 'buy' }),
  record(0, 20, '프로틴 믹스', '식품', 34_000, { type: 'hold', choice: 'buy' }),
]
