export const REPORT_THEME = {
  recommend: {
    gradient: "linear-gradient(180deg, #FFF 10%, var(--color-report-recommend) 50%, #FFF 100%)",
    title: "구매를 추천해요!",
    subtitle: "꼭 필요한 소비로 보여져서 만족도가 높을 거예요.",
    actions: [
      { key: "buy", label: "살래요!", variant: "dark" },
      {
        key: "skip",
        label: "안 살래요 · {saving}원 아끼기",
        variant: "secondary",
      },
      { key: "hold", label: "더 고민할게요", variant: "secondary" },
    ],
  },

  hold: {
    gradient: "linear-gradient(180deg, #FFF 10%, var(--color-report-hold) 50%, #FFF 100%)",
    title: "조금 더 생각해봐요.",
    subtitle: "꼭 필요한 소비로 보여져서 만족도가 높을 거예요.",
    actions: [
      { key: "skip", label: "안 살래요 · {saving}원 아끼기", variant: "dark" },
      { key: "hold", label: "더 고민할게요", variant: "secondary" },
      { key: "buy", label: "그래도 살래요", variant: "secondary" },
    ],
  },

  avoid: {
    gradient: "linear-gradient(180deg, #FFF 10%, var(--color-report-avoid) 50%, #FFF 100%)",
    title: "구매를 추천하지 않아요.",
    subtitle: "꼭 필요한 소비로 보여져서 만족도가 높을 거예요.",
    actions: [
      { key: "skip", label: "안 살래요 · {saving}원 아끼기", variant: "dark" },
      { key: "buy", label: "그래도 살래요", variant: "secondary" },
    ],
  },
};
