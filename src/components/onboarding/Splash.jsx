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
        className='absolute left-[calc(50%-0.5px)] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[8px] items-center w-[244px]'
        style={{ top: 'calc(50% - 81px)' }}
      >
        <p
          className='text-body1 font-bold text-gray-800 text-center w-full'
          style={{ letterSpacing: '-0.16px', lineHeight: 1.45 }}
        >
          후회 없는 소비를 위한 당신만의 비서
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

      <div
        className='absolute left-1/2 -translate-x-1/2'
        style={{ bottom: '-233px', width: '491px', height: '366px' }}
      >
        <div className='absolute' style={{ inset: '-8.2% -6.11%' }}>
          <img src='/splash-ellipse.svg' alt='' className='block w-full h-full' />
        </div>
      </div>

      <div
        className='absolute left-1/2 -translate-x-1/2'
        style={{ bottom: '89px', width: '82.64px', height: '196.79px' }}
      >
        <img src='/splash-character.svg' alt='' className='absolute inset-0 block w-full h-full' />
      </div>
    </div>
  )
}
