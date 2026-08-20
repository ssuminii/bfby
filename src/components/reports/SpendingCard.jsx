import { PENDING_TIER, tierOf } from '../../constants/cardTier'
import { iconOf } from '../../constants/categoryIcon'
import { cardKindOf } from '../../utils/history'

const CATEGORY_LABELS = {
  '취미·운동': '취미',
}

const SIZES = {
  sm: {
    card: 'h-[152px] w-[104px] rounded-lg',
    product: 'size-[52px]',
    topShadow: 'shadow-[inset_0_0_2px_rgba(0,0,0,0.24)]',
    body: 'gap-1',
    grade: 'w-20 px-3 text-bodyb tracking-[-0.14px]',
    price: 'text-[11px] leading-[1.4] tracking-[-0.22px]',
    unit: '',
  },
  lg: {
    card: 'h-[304px] w-[208px] rounded-2xl',
    product: 'size-[104px]',
    topShadow: 'shadow-[inset_0_0_4px_rgba(0,0,0,0.24)]',
    body: 'gap-2',
    grade: 'w-40 px-6 text-[28px] leading-[1.5] tracking-[-0.28px]',
    price: 'text-[28px] leading-[1.5] tracking-[-1.12px]',
    unit: 'text-bodyb tracking-[-0.14px]',
  },
}

const REGRET_STYLE = {
  top: 'bg-[#dadde2]',
  bottom: 'bg-gray-100',
  chip: 'bg-black/25',
  topShadow: 'shadow-[inset_0_0_2px_rgba(0,0,0,0.24)]',
  bottomShadow: 'shadow-[inset_0_0_4px_rgba(0,0,0,0.24)]',
}

// 아직 못 얻은 자리다. 가격 0짜리 카드로 그리면 등급까지 매겨져 실제 카드처럼 보인다.
function EmptyCard({ style, variant }) {
  if (variant === 'regret') {
    return (
      <article
        aria-hidden
        className={`flex flex-col overflow-hidden drop-shadow-[0_0_2px_rgba(0,0,0,0.12)] ${style.card}`}
      >
        <div className={`relative flex flex-1 items-center justify-center ${REGRET_STYLE.top}`}>
          <div className='size-[52px] rounded-full bg-white/40' />
          <span className={`pointer-events-none absolute inset-0 ${REGRET_STYLE.topShadow}`} />
        </div>
        <div
          className={`relative flex flex-1 flex-col items-center justify-center ${style.body} ${REGRET_STYLE.bottom}`}
        >
          <span className={`w-20 rounded-full px-3 text-center text-bodyb text-white ${REGRET_STYLE.chip}`}>
            카테고리
          </span>
          <strong className={`text-gray-800 ${style.price}`}>
            0
            <span className={style.unit}>원</span>
          </strong>
          <span className={`pointer-events-none absolute inset-0 ${REGRET_STYLE.bottomShadow}`} />
        </div>
      </article>
    )
  }

  return (
    <div
      aria-hidden
      className={`border-2 border-dashed border-gray-100 bg-gray-50 ${style.card}`}
    />
  )
}

export default function SpendingCard({
  record,
  size = 'sm',
  transitionName,
  variant = 'default',
}) {
  const style = SIZES[size]

  if (!record) {
    return <EmptyCard style={style} variant={variant} />
  }

  const price = record.price ?? 0
  const pending = cardKindOf(record) === 'pending'
  const tier = pending ? PENDING_TIER : tierOf(price)
  const category = record.category ?? '카테고리'
  const categoryLabel = CATEGORY_LABELS[category] ?? category
  const isRegret = variant === 'regret'
  const topClass = isRegret ? REGRET_STYLE.top : tier.color
  const bottomClass = isRegret ? REGRET_STYLE.bottom : tier.color
  const topShadow = isRegret ? REGRET_STYLE.topShadow : style.topShadow
  const bottomShadow = isRegret
    ? REGRET_STYLE.bottomShadow
    : 'shadow-[inset_0_0_4px_rgba(0,0,0,0.24)]'
  const chipClass = isRegret ? REGRET_STYLE.chip : 'bg-black/25'
  const showSunburst = !isRegret && tier.sunburst

  return (
    <article
      className={`flex flex-col overflow-hidden drop-shadow-[0_0_2px_rgba(0,0,0,0.12)] ${style.card}`}
      style={transitionName ? { viewTransitionName: transitionName } : undefined}
    >
      <div className={`relative flex flex-1 items-center justify-center overflow-hidden ${topClass}`}>
        {showSunburst && (
          <img
            src={tier.sunburst}
            alt=''
            className='absolute inset-0 size-full object-cover'
          />
        )}
        <img
          src={iconOf(category)}
          alt=''
          className={`relative object-contain ${style.product}`}
        />
        <span className={`pointer-events-none absolute inset-0 ${topShadow}`} />
      </div>

      <div
        className={`relative flex flex-1 flex-col items-center justify-center ${style.body} ${bottomClass}`}
      >
        <span className={`truncate rounded-full text-center text-white ${chipClass} ${style.grade}`}>
          {categoryLabel}
        </span>
        <strong className={`text-gray-800 ${style.price}`}>
          {price.toLocaleString()}
          <span className={style.unit}>원</span>
        </strong>
        <span className={`pointer-events-none absolute inset-0 ${bottomShadow}`} />
      </div>
    </article>
  )
}
