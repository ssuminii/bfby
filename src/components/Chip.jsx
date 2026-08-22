// 근거의 출처나 상태를 밝히는 작은 알약. 리포트와 살래말래 탭이 함께 쓴다.
const TONES = {
  info: 'bg-blue-100 text-blue-600',
  caution: 'bg-[#fff4db] text-caution',
}

export default function Chip({ tone = 'info', children }) {
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center justify-center rounded-[19.2px] px-3 text-body2b ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
