import bronzeSunburst from '../assets/reports/sunburst-bronze.png'
import goldSunburst from '../assets/reports/sunburst-gold.png'
import silverSunburst from '../assets/reports/sunburst-silver.png'

/**
 * 카드 등급은 상품 금액대로 정해진다. 경계값은 아직 확정 전이라 임시다.
 *
 *   color  카드 아랫면 배경
 *   glow   습득 화면에서 카드 뒤로 퍼지는 빛
 *   ink    습득 화면 제목 색
 */
export const TIERS = [
  {
    min: 1_000_000,
    sunburst: goldSunburst,
    color: 'bg-report-card-gold',
    glow: '#ffd87d',
    ink: 'text-caution',
  },
  {
    min: 100_000,
    sunburst: silverSunburst,
    color: 'bg-gray-300',
    glow: '#c6cbd2',
    ink: 'text-report-card-ink',
  },
  {
    // 브론즈 습득 화면은 실버와 같은 디자인을 쓴다.
    // ponytail: glow만 카드색을 따라 옅게 잡았다. 전용 시안이 나오면 교체.
    min: 0,
    sunburst: bronzeSunburst,
    color: 'bg-report-card-bronze',
    glow: '#b79d8c',
    ink: 'text-report-card-ink',
  },
]

export const tierOf = (price = 0) => TIERS.find((tier) => price >= tier.min) ?? TIERS.at(-1)

/**
 * 보류 카드는 산 건지 아닌지 아직 확정이 아니라 금액으로 등급을 매기지 않는다.
 * ponytail: 전용 시안이 나오면 교체한다. 지금은 무늬 없는 단색 회색.
 */
export const PENDING_TIER = {
  sunburst: null,
  color: 'bg-gray-300',
  glow: '#c6cbd2',
  ink: 'text-report-card-ink',
}
