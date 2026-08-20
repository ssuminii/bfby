import { useEffect } from 'react'

export default function Splash({ onNext }) {
  useEffect(() => {
    new Image().src = '/intro-character.png'
    const timer = setTimeout(onNext, 3000)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div
      className='relative w-full h-full'
      style={{ background: 'linear-gradient(to bottom, #ffffff 10%, #f1f2f5 50%, #f1f2f5 100%)' }}
    >
      <div
        className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 items-center w-61'
        style={{ top: 'calc(50% + 0.5px)' }}
      >
        <p
          className='text-body1 font-bold text-gray-800 text-center w-full'
          style={{ letterSpacing: '-0.16px', lineHeight: 1.45 }}
        >
          {'후회 없는 소비를 위한 당신만의 비서'.split('').map((char, i) => (
            <span
              key={i}
              className='inline-block'
              style={{
                animation: 'wave-char 2s ease-in-out 1',
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </p>
        <p
          className='text-gray-800 w-full'
          style={{
            fontFamily: "'Racing Sans One', cursive",
            fontSize: '48px',
            lineHeight: 'normal',
          }}
        >
          Before Buy
        </p>
      </div>
    </div>
  )
}
