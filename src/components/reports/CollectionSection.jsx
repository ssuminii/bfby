import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Button from '../Button'
import ConsumptionToggle from './ConsumptionToggle'
import PendingProductsSection from './PendingProductsSection'
import SpendingCard from './SpendingCard'

const PREVIEW_SIZE = 6

function CardGridSection({
  title,
  description,
  records,
  justAdded,
  landingRef,
  variant = 'default',
  showToggle = false,
  mode,
  onChangeMode,
}) {
  const [expanded, setExpanded] = useState(false)

  const cards = useMemo(() => {
    if (expanded) return records
    if (records.length <= PREVIEW_SIZE) return records
    const preview = records.slice(0, PREVIEW_SIZE)
    return [...preview, ...Array(Math.max(0, PREVIEW_SIZE - preview.length)).fill(null)]
  }, [expanded, records])

  useLayoutEffect(() => {
    setExpanded(false)
  }, [records])

  return (
    <section className='px-6 py-10'>
      <div>
        <h2 className='text-title text-gray-800'>{title}</h2>
        <p className='mt-1 text-body2 text-gray-500'>
          {description[0]}
          <br />
          {description[1]}
        </p>
      </div>

      {showToggle && (
        <div className='mt-6'>
          <ConsumptionToggle value={mode} onChange={onChangeMode} />
        </div>
      )}

      <div className='mt-6 grid grid-cols-3 gap-x-4 gap-y-6'>
        {cards.map((record, index) => {
          const landed = Boolean(justAdded) && record?.at === justAdded
          return (
            <div
              key={record?.at ? `${record.at}-${index}` : `placeholder-${index}`}
              ref={landed ? landingRef : undefined}
            >
              <SpendingCard
                record={record}
                transitionName={landed ? 'acquired-card' : undefined}
                variant={variant}
              />
            </div>
          )
        })}
      </div>

      {records.length > PREVIEW_SIZE && (
        <div className='mt-6'>
          <Button
            variant='dark'
            onClick={() => setExpanded((current) => !current)}
            className='text-head'
          >
            {expanded ? '접기' : `전체 ${records.length}장 보기`}
          </Button>
        </div>
      )}
    </section>
  )
}

export default function CollectionSection({
  collections,
  regrets,
  pending,
  justAdded,
  onResolveRecord,
}) {
  const [mode, setMode] = useState(() =>
    justAdded && !collections.good.some((record) => record.at === justAdded) ? 'saving' : 'good',
  )
  const records = collections[mode]
  const landingRef = useRef(null)

  useLayoutEffect(() => {
    landingRef.current?.scrollIntoView({ block: 'center' })
  }, [justAdded])

  return (
    <div className='pb-10 drop-shadow-[0_4px_3px_rgba(0,0,0,0.04)]'>
      <CardGridSection
        title='좋은 소비결정 카드'
        description={['카드를 수집할수록', '내 성향에 맞는 AI 조언이 더욱 정교해져요.']}
        records={records}
        justAdded={justAdded}
        landingRef={landingRef}
        showToggle
        mode={mode}
        onChangeMode={setMode}
      />

      <div className='mx-6 border-t border-gray-100' />

      <CardGridSection
        title='후회한 소비 카드'
        description={['매번 나의 소비를 돌아보게 해요.', '같은 실수를 줄이는 기록이 쌓여요.']}
        records={regrets}
        variant='regret'
      />

      <PendingProductsSection records={pending} onResolveRecord={onResolveRecord} />
    </div>
  )
}
