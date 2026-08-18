import { useMemo } from 'react'
import SpendingCard from './SpendingCard'

const DAY = 24 * 60 * 60 * 1000

export default function PendingCard({ records }) {
  const first = records[0] ?? null
  const timing = useMemo(() => {
    if (!first?.at) return '3일 뒤'
    const elapsed = Math.max(0, Math.floor((Date.now() - new Date(first.at).getTime()) / DAY))
    const remaining = Math.max(0, 3 - elapsed)
    return remaining ? `${remaining}일 뒤` : '지금'
  }, [first])

  return (
    <section className='flex min-h-[200px] w-full items-center rounded-3xl bg-report-pending-gradient px-[14px] py-6 drop-shadow-[0_0_3px_rgba(0,0,0,0.12)]'>
      <div className='flex items-center gap-4'>
        <SpendingCard record={first} />
        <div className='w-[198px] shrink-0 text-white'>
          <h3 className='text-title'>보류 카드 {records.length}장</h3>
          <p className='mt-1 text-bodyb text-gray-50'>
            {timing} 이 상품의 만족도를 기록하고
            <br />
            리포트 페이지에서 확인할 수 있어요.
          </p>
        </div>
      </div>
    </section>
  )
}
