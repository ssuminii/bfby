import bulbBase from '../../assets/icons/report/bulb-base.svg'
import bulbBody from '../../assets/icons/report/bulb-body.svg'
import calculator from '../../assets/icons/report/calculator.svg'
import history from '../../assets/icons/report/history.svg'
import list from '../../assets/icons/report/list.svg'
import AiIcon from '../icons/AiIcon'

// 카드 제목 앞에 붙는 아이콘. 카드 성격에 맞춰 고른다.
const ICONS = {
  reason: list,
  cost: calculator,
  history,
}

export default function CardIcon({ name }) {
  if (name === 'ai') {
    return (
      <span className='relative block size-6 shrink-0 overflow-clip'>
        <AiIcon className='absolute inset-0 size-full' />
      </span>
    )
  }

  // 전구는 두 조각으로 나뉘어 있어 위치를 잡아 겹친다
  if (name === 'idea') {
    return (
      <span className='relative block size-6 shrink-0 overflow-clip'>
        <img src={bulbBody} alt='' className='absolute inset-[12.5%_29.17%_33.33%_20.83%]' />
        <img src={bulbBase} alt='' className='absolute bottom-[12.5%] left-[33.33%] right-[41.67%] top-3/4' />
      </span>
    )
  }

  const src = ICONS[name]
  if (!src) return null

  return (
    <span className='flex size-6 shrink-0 items-center justify-center overflow-hidden'>
      <img src={src} alt='' className='block h-[18px] w-auto max-w-none' />
    </span>
  )
}
