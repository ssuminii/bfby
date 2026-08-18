import { useMemo, useState } from 'react'
import Button from '../Button'
import ConsumptionToggle from './ConsumptionToggle'
import PendingCard from './PendingCard'
import SpendingCard from './SpendingCard'

const PREVIEW_SIZE = 6

export default function CollectionSection({ collections, pending }) {
  const [mode, setMode] = useState('good')
  const [expanded, setExpanded] = useState(false)
  const records = collections[mode]

  const cards = useMemo(() => {
    if (expanded) return records
    const preview = [...Array(3).fill(null), ...records.slice(0, 3)]
    return [...preview, ...Array(PREVIEW_SIZE - preview.length).fill(null)]
  }, [expanded, records])

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setExpanded(false)
  }

  return (
    <section className='px-6 py-10 drop-shadow-[0_4px_3px_rgba(0,0,0,0.04)]'>
      <div>
        <h2 className='text-title text-gray-800'>좋은 소비결정 카드</h2>
        <p className='mt-1 text-body2 text-gray-600'>
          카드를 수집할 수록
          <br />
          내 성향에 맞는 AI 조언이 더욱 정교해져요.
        </p>
      </div>

      <div className='mt-6'>
        <ConsumptionToggle value={mode} onChange={changeMode} />
      </div>

      <div className='mt-6 grid grid-cols-3 gap-x-4 gap-y-6'>
        {cards.map((record, index) => (
          <SpendingCard
            key={record?.at ? `${record.at}-${index}` : `placeholder-${index}`}
            record={record}
            index={index}
          />
        ))}
      </div>

      <div className='mt-6'>
        <Button
          variant='dark'
          onClick={() => records.length > PREVIEW_SIZE && setExpanded((current) => !current)}
          className='text-head'
        >
          {expanded ? '접기' : `전체 ${records.length}장 보기`}
        </Button>
      </div>

      <div className='mt-6'>
        <PendingCard records={pending} />
      </div>
    </section>
  )
}
