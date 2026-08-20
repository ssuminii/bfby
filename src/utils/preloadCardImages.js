import { TIERS } from "../constants/cardTier";

/**
 * 카드 등급 무늬를 미리 받아 둔다.
 *
 * 카드가 처음 그려질 때 무늬를 받기 시작하면, 배경색만 깔린 카드가 잠깐 보였다가
 * 무늬가 뒤늦게 덮인다. 셋을 합쳐도 110KB 남짓이라 미리 받아두는 편이 낫다.
 */
export function preloadCardImages() {
  for (const tier of TIERS) {
    if (!tier.sunburst) continue;
    const image = new Image();
    image.src = tier.sunburst;
  }
}
