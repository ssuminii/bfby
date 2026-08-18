import beautyImage from '../../assets/reports/beauty.png'
import foodImage from '../../assets/reports/food.png'
import hobbyImage from '../../assets/reports/hobby.png'
import placeholderImage from '../../assets/reports/product-placeholder.png'
import bronzeSunburst from '../../assets/reports/sunburst-bronze.png'
import goldSunburst from '../../assets/reports/sunburst-gold.png'
import silverSunburst from '../../assets/reports/sunburst-silver.png'

const CATEGORY_IMAGES = {
  뷰티: beautyImage,
  식품: foodImage,
  '취미·운동': hobbyImage,
}

const CATEGORY_LABELS = {
  '취미·운동': '취미',
}

const TIERS = [
  { sunburst: goldSunburst, color: 'bg-report-card-gold' },
  { sunburst: silverSunburst, color: 'bg-gray-300' },
  { sunburst: silverSunburst, color: 'bg-gray-300' },
  { sunburst: silverSunburst, color: 'bg-gray-300' },
  { sunburst: bronzeSunburst, color: 'bg-report-card-bronze' },
  { sunburst: bronzeSunburst, color: 'bg-report-card-bronze' },
]

export default function SpendingCard({ record, index = 0 }) {
  const tier = TIERS[Math.min(index, TIERS.length - 1)]
  const category = record?.category ?? '카테고리'
  const categoryLabel = CATEGORY_LABELS[category] ?? category
  const price = record?.price ?? 0
  const image = record?.image || CATEGORY_IMAGES[category] || placeholderImage

  return (
    <article className='flex h-[152px] w-[104px] flex-col overflow-hidden rounded-lg drop-shadow-[0_0_2px_rgba(0,0,0,0.12)]'>
      <div className='relative flex h-[76px] items-center justify-center overflow-hidden'>
        <img src={tier.sunburst} alt='' className='absolute inset-0 size-full object-cover' />
        <img src={image} alt='' className='relative size-[52px] object-contain' />
        <span className='pointer-events-none absolute inset-0 shadow-[inset_0_0_2px_rgba(0,0,0,0.24)]' />
      </div>

      <div className={`relative flex h-[76px] flex-col items-center justify-center gap-1 ${tier.color}`}>
        <span className='w-20 truncate rounded-full bg-black/25 px-3 text-center text-bodyb text-white'>
          {categoryLabel}
        </span>
        <strong className='text-[11px] leading-[1.4] tracking-[-0.22px] text-gray-800'>
          {price.toLocaleString()}원
        </strong>
        <span className='pointer-events-none absolute inset-0 shadow-[inset_0_0_4px_rgba(0,0,0,0.24)]' />
      </div>
    </article>
  )
}
