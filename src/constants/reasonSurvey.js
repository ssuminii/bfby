export const REASON_SURVEY = {
  skip: {
    question: "안 사기로 결정한\n가장 큰 이유는 무엇인가요?",
    showProduct: true,
    options: [
      "자주 안 쓸 것 같아요",
      "지금 필요하지 않아요",
      "가격이 부담돼요",
      "이미 비슷한 걸 갖고 있어요",
      "더 나은 대안을 찾았어요",
      "그냥 마음이 바뀌었어요",
    ],
  },
  hold: {
    question: "어떤 점이 고민되시나요?",
    showProduct: true,
    options: [
      "자주 안 쓸 것 같아요",
      "지금 필요하지 않아요",
      "가격이 부담돼요",
      "이미 비슷한 걸 갖고 있어요",
      "더 나은 대안을 찾았어요",
      "그냥 마음이 바뀌었어요",
    ],
  },
  // 말렸는데도 사기로 한 경우. 판단이 빗나간 이유를 듣는 자리다.
  buy: {
    question: "혹시 제가 놓친 분석이 있을까요?",
    hint: "AI 조언을 더 정확하게 만드는 데 쓸게요.",
    showProduct: true,
    options: [
      "생각보다 자주 쓸 것 같아요",
      "자주 오지 않는 할인이에요",
      "지금이 아니면 못 사요",
      "가진 것과 용도가 달라요",
      "그냥 사고 싶어요",
    ],
  },
};

/**
 * 이유를 물어볼 결정인지 판단한다.
 * 추천을 받고 산 건 물어볼 게 없고, 말렸는데도 산 경우만 이유를 듣는다.
 */
export const needsReasonSurvey = (choice, type) =>
  choice === "buy" ? type !== "recommend" : Boolean(REASON_SURVEY[choice]);
