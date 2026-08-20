import { TIERS } from "../constants/cardTier";
import { CATEGORY_ICON_LIST } from "../constants/categoryIcon";

export function preloadCardImages() {
  const sources = [
    ...TIERS.map((tier) => tier.sunburst).filter(Boolean),
    ...CATEGORY_ICON_LIST,
  ];

  for (const src of sources) {
    const image = new Image();
    image.src = src;
  }
}
