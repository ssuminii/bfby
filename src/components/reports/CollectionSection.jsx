import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Button from '../Button'
import ConsumptionToggle from './ConsumptionToggle'
import SpendingCard from './SpendingCard'

const PREVIEW_SIZE = 6

export default function CollectionSection({ collections, justAdded }) {
  // 절약 카드를 담고 왔으면 그 탭이 열려 있어야 카드가 안착할 자리가 보인다
  const [mode, setMode] = useState(() =>
    justAdded && !collections.good.some((record) => record.at === justAdded) ? 'saving' : 'good',
  )
  const [expanded, setExpanded] = useState(false)
  const records = collections[mode]
  const landingRef = useRef(null)

  useLayoutEffect(() => {
    landingRef.current?.scrollIntoView({ block: 'center' })
  }, [justAdded])

  const cards = useMemo(() => {
    if (expanded) return records
    const preview = records.slice(0, PREVIEW_SIZE)
    return [...preview, ...Array(Math.max(0, PREVIEW_SIZE - preview.length)).fill(null)]
  }, [expanded, records])

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setExpanded(false)
  }

  return (
    <section className='px-6 py-10 drop-shadow-[0_4px_3px_rgba(0,0,0,0.04)]'>
      <div>
        <h2 className='text-title text-gray-800'>좋은 소비결정 카드</h2>
        <p className='mt-1 text-body2 text-gray-500'>
          카드를 수집할 수록
          <br />내 성향에 맞는 AI 조언이 더욱 정교해져요.
        </p>
      </div>

      <div className='mt-6'>
        <ConsumptionToggle value={mode} onChange={changeMode} />
      </div>

      <div className='mt-6 grid grid-cols-3 gap-x-4 gap-y-6'>
        {cards.map((record, index) => {
          const landed = Boolean(justAdded) && record?.at === justAdded
          return (
            <div
              key={record?.at ? `${record.at}-${index}` : `placeholder-${index}`}
              ref={landed ? landingRef : undefined}
            >
              <SpendingCard record={record} transitionName={landed ? 'acquired-card' : undefined} />
            </div>
          )
        })}
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
    </section>
  )
}
