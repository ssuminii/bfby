import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import stateBadImage from '../../assets/reports/state-bad.png'
import stateBestImage from '../../assets/reports/state-best.png'
import stateOkayImage from '../../assets/reports/state-okay.png'
import stateWorstImage from '../../assets/reports/state-worst.png'
import slideChevronIcon from '../../assets/reports/slide-chevron.svg'
import { tierOf } from '../../constants/cardTier'
import { resolveHold } from '../../utils/history'
import ChevronLeftIcon from '../icons/ChevronLeftIcon'
import SpendingCard from './SpendingCard'

const DAY = 24 * 60 * 60 * 1000
const CARD_WIDTH = 297
const CARD_GAP = 12
const ACTIVE_CARD_LEFT = 19
const PLACEHOLDER_COUNT = 3

const SATISFACTIONS = [
  { value: 'worst', label: '최악이에요', image: stateWorstImage, satisfied: false },
  { value: 'bad', label: '별로예요', image: stateBadImage, satisfied: false },
  { value: 'okay', label: '괜찮아요', image: stateOkayImage, satisfied: true },
  { value: 'best', label: '최고예요', image: stateBestImage, satisfied: true },
]

const SKIP_REASONS = [
  '자주 안 쓸 것 같아요',
  '가격이 부담돼요',
  '이미 비슷한 걸 갖고 있어요',
  '더 나은 대안을 찾았어요',
  '그냥 마음이 바뀌었어요',
]

function daysSince(isoDate) {
  if (!isoDate) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / DAY))
}

function daysUntilCheckin(record) {
  if (!record?.at) return 3
  return Math.max(0, 3 - daysSince(record.at))
}

function priceLabel(price) {
  return `${(price ?? 0).toLocaleString()}원`
}

function dateLabel(record) {
  const elapsed = daysSince(record?.at)
  return elapsed === 0 ? '오늘' : `${elapsed}일 전`
}

function ProductThumb({ record }) {
  if (record?.image) {
    return (
      <img
        src={record.image}
        alt=''
        referrerPolicy='no-referrer'
        className='size-[52px] shrink-0 rounded-lg bg-gray-100 object-cover'
      />
    )
  }

  return (
    <div
      aria-hidden
      className='size-[52px] shrink-0 rounded-lg'
      style={{
        backgroundColor: '#f7f8fa',
        backgroundImage:
          'linear-gradient(45deg, #edeff2 25%, transparent 25%), linear-gradient(-45deg, #edeff2 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #edeff2 75%), linear-gradient(-45deg, transparent 75%, #edeff2 75%)',
        backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0',
        backgroundSize: '12px 12px',
      }}
    />
  )
}

function PendingSlide({ record, index, total, onClick }) {
  const remaining = daysUntilCheckin(record)
  const timing = remaining > 0 ? `${remaining}일 뒤` : '오늘'

  return (
    <button
      type='button'
      onClick={record ? onClick : undefined}
      className='flex w-[297px] shrink-0 flex-col gap-3 rounded-[24px] bg-report-pending-gradient p-3 text-left drop-shadow-[0_0_3px_rgba(0,0,0,0.12)] disabled:cursor-default'
      disabled={!record}
    >
      <div className='flex items-center gap-4 px-3'>
        <div className='flex h-[152px] w-[104px] shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-display text-gray-300'>
          ?
        </div>
        <div className='min-w-0 flex-1 self-stretch py-2'>
          <div className='flex h-full items-center'>
            <p className='line-clamp-3 text-[18px] font-bold leading-[1.45] text-white'>
              {record?.name ?? `상품명_${index + 1}`}
            </p>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between pl-3'>
        <p className='text-body2 text-gray-300'>
          {record
            ? `${timing} 이 상품의 만족도를 여쭤볼게요.`
            : '며칠 뒤 이 상품의 만족도를 여쭤볼게요.'}
        </p>
        <span className='rounded-full bg-gray-500 px-[10px] py-1 text-caption text-white'>
          {index + 1}/{total}
        </span>
      </div>
    </button>
  )
}

function PendingCheckinSheet({ record, onClose, onResolve }) {
  const [selected, setSelected] = useState(null)
  const [completion, setCompletion] = useState(null)
  const [skipReason, setSkipReason] = useState(null)
  const [skipOther, setSkipOther] = useState('')

  useEffect(() => {
    const scrollMain = document.querySelector('main')
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    scrollMain?.classList.add('no-scrollbar')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      scrollMain?.classList.remove('no-scrollbar')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (completion?.type !== 'goodReveal') return undefined
    const timer = setTimeout(() => {
      setCompletion({ type: 'goodComplete', record: completion.record })
    }, 1200)
    return () => clearTimeout(timer)
  }, [completion])

  const resolveRecord = (checkin) => {
    const updated = resolveHold(record.at, checkin) ?? { ...record, checkin }
    onResolve(updated)
    return updated
  }

  const closeAfterResolve = (checkin) => {
    resolveRecord(checkin)
    onClose()
  }

  const handleComplete = () => {
    if (!selected) return
    const updated = resolveRecord({ resolved: 'buy', satisfied: selected.satisfied })
    setCompletion({
      type: selected.satisfied ? 'goodReveal' : 'regretComplete',
      record: updated,
    })
  }

  const handleSkip = () => {
    setCompletion({ type: 'skipReason', record })
  }

  const handleSkipReasonComplete = () => {
    const reason = skipOther.trim() || skipReason
    if (!reason) return
    closeAfterResolve({ resolved: 'skip', reason })
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex justify-center ${
        completion ? 'items-stretch bg-white' : 'items-end bg-black/50'
      }`}
      role='presentation'
      onClick={completion ? undefined : onClose}
    >
      {completion?.type === 'regretComplete' ? (
        <RegretCompleteView record={completion.record} onClose={onClose} />
      ) : completion?.type === 'skipReason' ? (
        <SkipReasonView
          record={completion.record}
          selectedReason={skipReason}
          otherReason={skipOther}
          onBack={() => setCompletion(null)}
          onSelectReason={(reason) => {
            setSkipReason(reason)
            setSkipOther('')
          }}
          onChangeOther={(reason) => {
            setSkipOther(reason)
            if (reason) setSkipReason(null)
          }}
          onComplete={handleSkipReasonComplete}
        />
      ) : completion?.type === 'goodReveal' ? (
        <GoodRevealView />
      ) : completion?.type === 'goodComplete' ? (
        <GoodCompleteView record={completion.record} onClose={onClose} />
      ) : (
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='pending-checkin-title'
          className='flex max-h-[calc(100dvh-60px)] w-[393px] max-w-full flex-col rounded-t-[38px] bg-white px-6 pb-10 pt-4 drop-shadow-[0_15px_38px_rgba(0,0,0,0.18)]'
          onClick={(event) => event.stopPropagation()}
        >
          <div className='flex h-4 justify-center pt-[5px]'>
            <span className='h-[5px] w-9 rounded-full bg-[#cccccc]' />
          </div>

          <div className='flex flex-col gap-6 pt-6'>
            <div className='flex flex-col gap-6'>
              <div className='flex h-[52px] gap-5'>
                <ProductThumb record={record} />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-head text-gray-800'>{record.name}</p>
                  <p className='mt-1 text-body1 font-semibold text-gray-600'>
                    {priceLabel(record.price)} · {dateLabel(record)}
                  </p>
                </div>
              </div>
              <div className='border-t border-gray-100' />
            </div>

            <div className='flex min-h-[372px] flex-col justify-between'>
              <div>
                <h2 id='pending-checkin-title' className='text-title text-gray-800'>
                  이 상품, 사용해보니 어떠세요?
                </h2>
                <p className='mt-2 text-body1 text-gray-500'>답하시면 카드가 열려요.</p>
              </div>

              <div className='grid grid-cols-4 gap-3'>
                {SATISFACTIONS.map((item) => {
                  const active = selected?.value === item.value
                  return (
                    <button
                      key={item.value}
                      type='button'
                      onClick={() => setSelected(item)}
                      className={`flex flex-col items-center gap-2 rounded-xl p-4 text-caption transition ${
                        active
                          ? 'bg-gradient-to-t from-[#2F80FF] from-50% to-[#7FB0FF] text-white'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                      aria-pressed={active}
                    >
                      <img src={item.image} alt='' className='size-8' />
                      <span className='whitespace-nowrap'>{item.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className='flex flex-col gap-2'>
                <button
                  type='button'
                  onClick={handleComplete}
                  disabled={!selected}
                  className={`flex h-[52px] items-center justify-center rounded-xl text-head transition ${
                    selected ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  선택 완료
                </button>
                <button
                  type='button'
                  onClick={handleSkip}
                  className='flex h-[52px] items-center justify-center rounded-xl bg-gray-100 text-head text-gray-500 transition active:bg-gray-300'
                >
                  안 사기로 했어요
                </button>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex h-[52px] items-center justify-center rounded-xl bg-gray-100 text-head text-gray-500 transition active:bg-gray-300'
                >
                  다음에 답 할래요
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

function SkipReasonView({
  record,
  selectedReason,
  otherReason,
  onBack,
  onSelectReason,
  onChangeOther,
  onComplete,
}) {
  const answer = otherReason.trim() || selectedReason

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='skip-reason-title'
      className='relative h-dvh w-[393px] max-w-full bg-white px-6'
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type='button'
        onClick={onBack}
        aria-label='뒤로 가기'
        className='absolute left-2 top-[62px] flex size-12 items-center justify-center text-black'
      >
        <ChevronLeftIcon />
      </button>

      <div className='absolute left-6 top-[124px] flex w-[345px] flex-col items-start gap-6'>
        <div className='flex w-full items-start gap-5'>
          <ProductThumb record={record} />
          <div className='min-w-0 flex-1 self-stretch'>
            <p className='truncate text-head text-gray-800'>{record.name}</p>
            <p className='mt-1 text-body1 font-semibold text-gray-600'>
              {priceLabel(record.price)}
            </p>
          </div>
        </div>
        <div className='w-full border-t border-gray-100' />

        <h2
          id='skip-reason-title'
          className='whitespace-pre-line text-title text-gray-800'
        >
          안 사기로 결정한{'\n'}가장 큰 이유는 무엇인가요?
        </h2>

        <div className='flex w-full flex-col gap-4'>
          {SKIP_REASONS.map((reason) => {
            const active = selectedReason === reason
            return (
              <button
                key={reason}
                type='button'
                onClick={() => onSelectReason(reason)}
                className='flex h-[50px] w-full items-center justify-between rounded-2xl bg-[#fafafa] px-6 text-left text-question text-gray-800'
                aria-pressed={active}
              >
                <span>{reason}</span>
                <span
                  className={`size-[21px] rounded-full border-[5px] bg-white ${
                    active ? 'border-blue-500' : 'border-[#d3d3d3]'
                  }`}
                />
              </button>
            )
          })}

          <input
            type='text'
            value={otherReason}
            onChange={(event) => onChangeOther(event.target.value)}
            placeholder='직접 입력할게요 (기타)'
            className='h-14 w-full rounded-2xl bg-gray-100 px-6 text-question text-gray-800 outline-none placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <button
        type='button'
        onClick={onComplete}
        disabled={!answer}
        className={`absolute bottom-10 left-1/2 flex h-[52px] w-[345px] -translate-x-1/2 items-center justify-center rounded-xl text-head ${
          answer ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
        }`}
      >
        완료
      </button>
    </div>
  )
}

function RegretCompleteView({ record, onClose }) {
  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='skip-complete-title'
      className='relative h-dvh w-[393px] max-w-full bg-white px-6'
      onClick={(event) => event.stopPropagation()}
    >
      <div className='absolute left-1/2 top-1/2 flex w-[336px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-10'>
        <div className='flex w-[289px] flex-col items-center gap-10'>
          <div aria-hidden className='size-[100px] bg-[#d9d9d9]' />
          <div className='flex w-full flex-col items-center gap-2 text-center'>
            <h2
              id='skip-complete-title'
              className='w-[232px] text-[22px] font-bold leading-[1.4] tracking-[-0.44px] text-gray-800'
            >
              알려주셔서 감사해요.
            </h2>
            <p className='whitespace-nowrap text-[16px] font-medium leading-[1.45] text-gray-500'>
              이런 기록이 쌓일수록 다음 조언이 정확해져요.
            </p>
          </div>
        </div>

        <div className='flex w-full items-center gap-5 rounded-[24px] bg-white p-6 drop-shadow-[0_0_3px_rgba(0,0,0,0.12)]'>
          <SpendingCard record={record} variant='regret' />
          <div className='flex shrink-0 flex-col items-start gap-2'>
            <p className='whitespace-nowrap text-head text-gray-800'>후회한 소비에 기록했어요.</p>
            <p className='whitespace-nowrap text-body2 text-gray-500'>카드는 회색으로 보관돼요.</p>
          </div>
        </div>
      </div>

      <button
        type='button'
        onClick={onClose}
        className='absolute bottom-10 left-1/2 flex h-[52px] w-[345px] -translate-x-1/2 items-center justify-center rounded-xl bg-gray-800 text-head text-white'
      >
        닫기
      </button>
    </div>
  )
}

function GoodRevealView() {
  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='카드 공개 대기'
      className='relative h-dvh w-[393px] max-w-full bg-white'
    >
      <div className='absolute left-[67px] top-[132px] flex w-[259px] flex-col items-center gap-10'>
        <p className='min-w-full text-center text-title text-gray-600'>두구두구...</p>
        <div className='flex h-[304px] w-[208px] items-center justify-center overflow-hidden rounded-lg border-4 border-dashed border-[#dadde2] bg-report-pending-gradient'>
          <p className='text-[56px] font-bold leading-[1.3] tracking-[-1.12px] text-[#dadde2]'>
            ?
          </p>
        </div>
      </div>
    </div>
  )
}

function GoodCompleteView({ record, onClose }) {
  const tier = tierOf(record.price ?? 0)

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='good-complete-title'
      className='relative h-dvh w-[393px] max-w-full overflow-hidden bg-white'
      onClick={(event) => event.stopPropagation()}
    >
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-[calc(50%-71.5px)] size-[393px] -translate-x-1/2 -translate-y-1/2 rounded-full'
        style={{
          background: `radial-gradient(circle closest-side, ${tier.glow}, #fff)`,
        }}
      />

      <div className='absolute left-[67px] top-[calc(50%-81px)] flex w-[259px] -translate-y-1/2 flex-col items-center gap-10'>
        <p
          id='good-complete-title'
          className={`min-w-full whitespace-pre-line text-center text-title ${tier.ink}`}
        >
          합리적인 소비 카드를{'\n'}습득했어요!
        </p>
        <SpendingCard record={record} size='lg' />
        <p className='min-w-full text-center text-bodyb text-gray-500'>만족하셨다니 다행이에요.</p>
      </div>

      <button
        type='button'
        onClick={onClose}
        className='absolute bottom-10 left-1/2 flex h-[52px] w-[345px] -translate-x-1/2 items-center justify-center rounded-xl bg-gray-800 text-head text-white'
      >
        카드보관함으로 이동
      </button>
    </div>
  )
}

export default function PendingProductsSection({ records, onResolveRecord }) {
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const slides = useMemo(() => {
    if (records.length > 0) return records
    return Array.from({ length: PLACEHOLDER_COUNT }, () => null)
  }, [records])

  useEffect(() => {
    setActiveIndex(records.length > 1 ? 1 : 0)
  }, [records.length])

  const moveSlide = (direction) => {
    setActiveIndex((current) => {
      const next = current + direction
      if (next < 0) return 0
      if (next >= slides.length) return slides.length - 1
      return next
    })
  }

  const trackOffset = ACTIVE_CARD_LEFT - activeIndex * (CARD_WIDTH + CARD_GAP)

  return (
    <section className='border-t border-gray-100 px-6 py-10'>
      <div>
        <h2 className='text-title text-gray-800'>카드 발급 보류중인 상품</h2>
        <p className='mt-1 text-body2 text-gray-500'>
          AI 조언에서 보류/비추천을 받았지만 구매를 결심한 상품들이에요.
          <br />
          며칠 뒤 만족도를 알려주시면 그 결과가 카드로 남아요.
        </p>
      </div>

      <div className='relative mt-6 h-[226px] w-full overflow-hidden'>
        <div
          className='absolute left-0 top-0 flex items-start gap-3 transition-transform duration-300 ease-out'
          style={{ transform: `translateX(${trackOffset}px)` }}
        >
          {slides.map((record, slideIndex) => (
            <PendingSlide
              key={record?.at ?? `slide-${slideIndex}`}
              record={record}
              index={slideIndex}
              total={slides.length}
              onClick={() => setSelectedRecord(record)}
            />
          ))}
        </div>

        {slides.length > 1 && (
          <>
            {activeIndex > 0 && (
              <button
                type='button'
                onClick={() => moveSlide(-1)}
                className='absolute left-2 top-[83px] flex size-11 items-center justify-center'
                aria-label='이전 보류 상품 보기'
              >
                <span className='flex size-8 items-center justify-center rounded-full bg-gray-800'>
                  <img src={slideChevronIcon} alt='' className='h-[17.67px] w-[10.67px]' />
                </span>
              </button>
            )}
            {activeIndex < slides.length - 1 && (
              <button
                type='button'
                onClick={() => moveSlide(1)}
                className='absolute right-2 top-[83px] flex size-11 items-center justify-center'
                aria-label='다음 보류 상품 보기'
              >
                <span className='flex size-8 items-center justify-center rounded-full bg-gray-800'>
                  <img
                    src={slideChevronIcon}
                    alt=''
                    className='h-[17.67px] w-[10.67px] rotate-180'
                  />
                </span>
              </button>
            )}
          </>
        )}
      </div>

      {selectedRecord && (
        <PendingCheckinSheet
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onResolve={(record) => onResolveRecord?.(record)}
        />
      )}
    </section>
  )
}
