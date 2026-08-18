export default function SavingsChart({ months }) {
  const max = Math.max(...months.map((month) => month.amount), 1)

  return (
    <div className='flex h-[180px] w-full items-center justify-between' aria-label='최근 6개월 절약액'>
      {months.map((month) => {
        const height = month.amount ? Math.max(20, Math.round((month.amount / max) * 129)) : 20
        return (
          <div key={month.key} className='flex h-[180px] w-7 flex-col items-center gap-[6px]'>
            <div className='relative h-[152px] w-full overflow-hidden rounded-t-[20px] bg-report-chart-track'>
              <div
                className='absolute inset-x-0 bottom-0 min-h-5 rounded-t-[20px] bg-report-chart-gradient'
                style={{ height }}
                title={`${month.label} ${month.amount.toLocaleString()}원`}
              />
            </div>
            <span className='h-[22px] w-full text-center text-body2 text-gray-600'>
              {month.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
