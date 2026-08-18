import SavingsChart from './SavingsChart'

const won = (value) => `${value.toLocaleString()}원`

export default function SavingsOverview({ summary }) {
  return (
    <>
      <section className='px-6 py-6 drop-shadow-[0_4px_3px_rgba(0,0,0,0.04)]'>
        <h2 className='text-title text-gray-800'>이번 달 절약</h2>
        <p className='mt-1 text-display text-blue-500'>+ {won(summary.currentMonthSaved)}</p>
      </section>

      <div className='mx-6 border-t border-gray-100' />

      <section className='bg-report-summary-gradient px-12 py-10'>
        <div>
          <p className='text-title text-gray-800'>지금까지</p>
          <p className='text-title text-gray-800'>
            충동구매를 <span className='text-blue-500'>{summary.savingCount}번</span> 참았고,
            <br />총 <span className='text-blue-500'>{won(summary.totalSaved)}</span> 절약했어요.
          </p>
        </div>

        <div className='mt-6 whitespace-nowrap text-bodyb text-gray-500'>
          <p>🛍️ 월평균 {won(summary.monthlyAverage)} 절약했어요.</p>
          {summary.isIncreasing && <p>📈 지난 2개월 동안 절약액이 늘고 있어요! 🥳</p>}
        </div>

        <div className='mt-6'>
          <SavingsChart months={summary.months} />
        </div>
      </section>
    </>
  )
}
