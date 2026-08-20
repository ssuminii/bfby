// 판단 신호. 걸림은 주의색, 주의는 경고색으로 세기를 구분한다.
const TONES = {
  good: { label: '좋음', bg: 'bg-info' },
  caution: { label: '걸림', bg: 'bg-caution' },
  warn: { label: '주의', bg: 'bg-error' },
}

export default function ReasonList({ items }) {
  return (
    <ul className='flex w-full flex-col gap-3'>
      {items.map(({ tone, text }) => (
        <li key={text} className='flex items-center gap-[11px]'>
          <span
            className={`flex h-5 shrink-0 items-center justify-center rounded-full px-2 text-body2b text-white ${TONES[tone].bg}`}
          >
            {TONES[tone].label}
          </span>
          <p className='flex-1 text-result text-gray-600'>{text}</p>
        </li>
      ))}
    </ul>
  )
}
