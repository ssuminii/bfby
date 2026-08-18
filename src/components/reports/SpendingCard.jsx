import beautyImage from '../../assets/reports/beauty.png'
import foodImage from '../../assets/reports/food.png'
import hobbyImage from '../../assets/reports/hobby.png'
import placeholderImage from '../../assets/reports/product-placeholder.png'
import { PENDING_TIER, tierOf } from '../../constants/cardTier'
import { cardKindOf } from '../../utils/history'

const CATEGORY_IMAGES = {
  뷰티: beautyImage,
  식품: foodImage,
  '취미·운동': hobbyImage,
}

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

export default function SpendingCard({ record, size = 'sm' }) {
  const style = SIZES[size]

  // 아직 못 얻은 자리다. 가격 0짜리 카드로 그리면 등급까지 매겨져 실제 카드처럼 보인다.
  if (!record) {
    return <div aria-hidden className={`border-2 border-dashed border-gray-100 bg-gray-50 ${style.card}`} />
  }

  const price = record.price ?? 0
  const pending = cardKindOf(record) === 'pending'
  const tier = pending ? PENDING_TIER : tierOf(price)
  const category = record.category ?? '카테고리'
  const categoryLabel = CATEGORY_LABELS[category] ?? category
  const image = record.image || CATEGORY_IMAGES[category] || placeholderImage

  return (
    <article
      className={`flex flex-col overflow-hidden drop-shadow-[0_0_2px_rgba(0,0,0,0.12)] ${style.card}`}
    >
      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden ${tier.color}`}
      >
        {tier.sunburst && (
          <img src={tier.sunburst} alt='' className='absolute inset-0 size-full object-cover' />
        )}
        <img src={image} alt='' className={`relative object-contain ${style.product}`} />
        <span className={`pointer-events-none absolute inset-0 ${style.topShadow}`} />
      </div>

      <div
        className={`relative flex flex-1 flex-col items-center justify-center ${style.body} ${tier.color}`}
      >
        <span className={`truncate rounded-full bg-black/25 text-center text-white ${style.grade}`}>
          {categoryLabel}
        </span>
        <strong className={`text-gray-800 ${style.price}`}>
          {price.toLocaleString()}
          <span className={style.unit}>원</span>
        </strong>
        <span className='pointer-events-none absolute inset-0 shadow-[inset_0_0_4px_rgba(0,0,0,0.24)]' />
      </div>
    </article>
  )
}
