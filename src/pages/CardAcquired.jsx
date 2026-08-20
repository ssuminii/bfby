import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import PendingNotice from '../components/report/PendingNotice'
import SpendingCard from '../components/reports/SpendingCard'
import linkIcon from '../assets/icons/link.svg'
import { tierOf } from '../constants/cardTier'
import { cardKindOf } from '../utils/history'
import { withViewTransition } from '../utils/viewTransition'

const COPY = {
  good: { title: '합리적인 소비 카드를\n습득했어요!', showLink: true },
  saving: { title: '절약한 소비 카드를\n습득했어요!' },
}

function CopyLinkButton({ link }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {}
  }

  return (
    <button
      type='button'
      onClick={handleCopy}
      className={`flex h-[52px] items-center justify-center gap-2 rounded-xl text-head ${
        copied ? 'border-2 border-success bg-white text-success' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {!copied && (
        <span className='relative block size-6 overflow-clip'>
          <img
            src={linkIcon}
            alt=''
            className='absolute inset-x-[8.33%] inset-y-[29.17%] block h-[41.66%] w-[83.34%]'
          />
        </span>
      )}
      {copied ? '복사했어요!' : '상품 링크 복사하기'}
    </button>
  )
}

export default function CardAcquired() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const record = state?.record ?? null
  const kind = record && cardKindOf(record)

  // 더 고민할게요는 결정을 미룬 것이라 카드가 아니라 살래말래 탭으로 간다
  if (record?.choice === 'hold') {
    return (
      <PendingNotice
        title={'살래말래 탭에\n저장해 뒀어요.'}
        caption='언제든 다시 열어서 결정할 수 있어요.'
        to='/buyornot'
      />
    )
  }

  if (!kind) return <Navigate to='/reports' replace />

  // 말렸는데도 산 경우. 체크인에서 만족도를 들어야 카드가 정해진다
  if (kind === 'pending') {
    return (
      <PendingNotice
        title={'3일 뒤에 이 선택을\n다시 보여드릴게요.'}
        caption={'그때 만족하셨는지 여쭤보고\n더 정확한 AI 조언에 사용할게요.'}
        to='/reports'
      />
    )
  }

  const copy = COPY[kind]
  const tier = tierOf(record.price ?? 0)
  const link = state?.link

  return (
    <div className='relative h-full overflow-hidden bg-white'>
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-[calc(50%-71px)] size-[393px] -translate-x-1/2 -translate-y-1/2 rounded-full'
        style={{
          background: `radial-gradient(circle closest-side, ${tier.glow}, #fff)`,
        }}
      />

      <div className='absolute left-1/2 top-[calc(50%-81px)] flex w-[259px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-10'>
        <p className={`whitespace-pre-line text-center text-title ${tier.ink}`}>{copy.title}</p>

        <SpendingCard record={record} size='lg' transitionName='acquired-card' />

        {state?.note && (
          <p className='whitespace-pre-line text-center text-bodyb text-gray-600'>{state.note}</p>
        )}
      </div>

      <div className='absolute bottom-10 left-1/2 flex w-[345px] -translate-x-1/2 flex-col gap-3'>
        {copy.showLink && link && <CopyLinkButton link={link} />}

        <Button
          variant='dark'
          onClick={() =>
            withViewTransition(() => navigate('/reports', { state: { justAdded: record.at } }))
          }
        >
          카드 보관함으로 이동
        </Button>

        <Button variant='active' onClick={() => navigate('/consult/setup')}>
          다른 상품도 조언 듣기
        </Button>
      </div>
    </div>
  )
}
