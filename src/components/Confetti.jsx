import { useMemo } from 'react'

// 서비스 팔레트에서 고른 색. 파랑을 주로 쓰고 금·초록으로 강세를 준다.
const COLORS = [
  'var(--color-blue-500)',
  'var(--color-blue-300)',
  'var(--color-report-card-gold)',
  'var(--color-success)',
  'var(--color-gray-300)',
]

const between = (min, max) => min + Math.random() * (max - min)

/**
 * 위에서 떨어지며 도는 축하 조각들.
 * 조각마다 위치·속도·색이 달라야 자연스러워서 마운트할 때 한 번만 뽑는다.
 */
export default function Confetti({ count = 28 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${between(0, 100)}%`,
        width: `${between(6, 11)}px`,
        height: `${between(9, 16)}px`,
        background: COLORS[Math.floor(Math.random() * COLORS.length)],
        borderRadius: Math.random() < 0.3 ? '9999px' : '2px',
        animationDelay: `${between(0, 1.6)}s`,
        animationDuration: `${between(2.4, 4)}s`,
      })),
    [count],
  )

  return (
    <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
      {pieces.map((style, i) => (
        <span key={i} className='absolute top-0 animate-confetti' style={style} />
      ))}
    </div>
  )
}
