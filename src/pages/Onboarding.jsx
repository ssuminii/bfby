import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = ['splash', 'intro', 'category']

export default function Onboarding() {
  const [step, setStep] = useState('splash')
  const navigate = useNavigate()

  const next = () => {
    if (step === 'splash') setStep('intro')
    else if (step === 'intro') setStep('category')
    else navigate('/consult')
  }

  return (
    <div className='flex flex-col h-full relative overflow-hidden'>
      {step === 'splash' && <Splash onNext={next} />}
      {step === 'intro' && <Intro onNext={next} />}
      {step === 'category' && <Category onNext={next} />}
    </div>
  )
}

function Splash({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 3000)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div
      className='relative w-full h-full'
      style={{ background: 'linear-gradient(to bottom, #ffffff 10%, #f1f2f5 50%, #f1f2f5 100%)' }}
    >
      <div
        className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-[244px]'
        style={{ top: 'calc(50% - 81px)' }}
      >
        <p
          className='text-body1 font-bold text-gray-800 text-center'
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
        style={{ top: '719px', width: '491px', height: '366px' }}
      >
        <div className='absolute' style={{ inset: '-8.2% -6.11%' }}>
          <img src='/splash-ellipse.svg' alt='' className='block w-full h-full' />
        </div>
      </div>

      <div
        className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2'
        style={{ top: 'calc(50% + 238.39px)', width: '82.64px', height: '196.79px' }}
      >
        <img src='/splash-character.svg' alt='' className='absolute inset-0 block w-full h-full' />
      </div>
    </div>
  )
}

function Intro({ onNext }) {
  return <div className='flex flex-col h-full px-6' />
}

function Category({ onNext }) {
  return <div className='flex flex-col h-full px-6' />
}
