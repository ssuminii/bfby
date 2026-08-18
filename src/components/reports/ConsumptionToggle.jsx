const OPTIONS = [
  { value: 'good', label: '잘 구매한 소비' },
  { value: 'saving', label: '절약한 소비' },
]

export default function ConsumptionToggle({ value, onChange }) {
  return (
    <div className='flex h-11 w-full items-center justify-between rounded-3xl bg-gray-100 p-2'>
      {OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type='button'
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`flex h-full w-[140px] items-center justify-center rounded-[19px] text-head transition-colors ${
              active
                ? 'border-2 border-blue-500 bg-blue-50 text-blue-500'
                : 'text-gray-600'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
