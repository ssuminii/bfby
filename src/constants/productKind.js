/**
 * 카테고리 밑의 소분류.
 *
 * '전자기기'는 정수기와 태블릿을 같이 담을 만큼 넓다. 값도 비슷하고 매일 쓴다는
 * 점도 같아서, 카테고리와 가격만으로는 둘을 갈라낼 수가 없다.
 * 지난 기록을 견줄 때 이 소분류가 같은 것끼리만 묶는다.
 *
 * 잘게 쪼갤수록 엉뚱한 비교는 줄지만 견줄 기록도 같이 사라진다.
 * 그래서 쓰는 자리와 쓰는 방식이 비슷한 것들을 한 칸에 모아 두세 개로 끊는다.
 */
export const KINDS = {
  전자기기: ["휴대기기", "컴퓨터·주변", "집에 두는 가전"],
  생활용품: ["주방", "청소·세탁", "수납·가구", "욕실·위생"],
  취미·운동: ["운동기구", "아웃도어", "취미장비"],
  뷰티: ["화장품", "미용기기"],
  식품: ["간식·음료", "식재료", "건강식품"],
  의류: ["옷", "신발·가방"],
};

export const kindsOf = (category) => KINDS[category] ?? [];

const bigrams = (text) => {
  const chars = text.replace(/[\s·]/g, "");
  return new Set(Array.from({ length: chars.length - 1 }, (_, i) => chars.slice(i, i + 2)));
};

/**
 * 모델이 말한 소분류를 목록에 있는 이름으로 되돌린다.
 *
 * "집에 두고 쓰는 가전"처럼 한 글자씩 다르게 쓰거나 "화장품, 미용기기"처럼
 * 둘을 함께 내놓는 일이 있다. 표기가 어긋나면 기록과 맞물리지 않아
 * 견줄 게 있는데도 "이번이 처음이에요"가 나간다.
 */
export function normalizeKind(category, raw) {
  const kinds = kindsOf(category);
  const text = String(raw ?? "").trim();
  if (!text) return null;

  const exact = kinds.find((kind) => kind === text) ?? kinds.find((kind) => text.includes(kind));
  if (exact) return exact;

  // 글자가 가장 많이 겹치는 것으로 붙인다
  const target = bigrams(text);
  let best = null;
  let bestScore = 0;
  for (const kind of kinds) {
    const score = [...bigrams(kind)].filter((gram) => target.has(gram)).length;
    if (score > bestScore) {
      best = kind;
      bestScore = score;
    }
  }
  return bestScore >= 2 ? best : null;
}
