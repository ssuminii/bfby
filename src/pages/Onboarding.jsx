import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

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
      {step === 'category' && <RegretSurvey onNext={next} />}
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
  return (
    <div className='relative w-full h-full bg-gradient-to-b from-blue-300 to-blue-50'>
      <img src='/intro-bg.svg' alt='' className='absolute inset-0 w-full h-full' />

      <div
        className='absolute -translate-x-1/2 text-title font-bold text-gray-800 text-center'
        style={{
          top: '166px',
          left: '196.5px',
          letterSpacing: '-0.4px',
          lineHeight: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <p style={{ lineHeight: 1.5, marginBottom: 0, whiteSpace: 'pre' }}>반가워요!</p>
        <p style={{ lineHeight: 1.5, marginBottom: 0, whiteSpace: 'pre' }}>{'​'}</p>
        <p style={{ lineHeight: 1.5, marginBottom: 0, whiteSpace: 'pre' }}>
          비포바이는 합리적인 소비를 위해
        </p>
        <p style={{ lineHeight: 1.5, whiteSpace: 'pre' }}>구매 전 조언해주는 AI 서비스에요.</p>
      </div>

      <div
        className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2'
        style={{ top: 'calc(50% + 40.5px)', width: '374px', height: '249px' }}
      >
        <img
          src='/intro-character.png'
          alt=''
          className='absolute inset-0 w-full h-full object-cover'
        />
      </div>

      <div className='absolute' style={{ top: '758px', left: '24px' }}>
        <Button onClick={onNext} variant='dark'>
          다음으로
        </Button>
      </div>
    </div>
  )
}

const CATEGORIES = ['의류', '뷰티', '전자기기', '생활용품', '식품', '취미 · 운동']

function RegretSurvey({ onNext }) {
  const [selected, setSelected] = useState([])
  const [reason, setReason] = useState('')

  const toggle = (cat) =>
    setSelected((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]))

  return (
    <div className='relative w-full h-full bg-gray-50'>
      <img src='/category-bg.svg' alt='' className='absolute inset-0 w-full h-full' />

      <div
        className='absolute flex flex-col items-center gap-[10px] text-center w-[277px]'
        style={{ top: '166px', left: '58.5px' }}
      >
        <p
          className='text-title font-bold text-gray-800 w-full'
          style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
        >
          최근 후회했던 소비가 있었나요?
        </p>
        <div
          className='w-full text-gray-500 font-medium'
          style={{ fontSize: '13px', letterSpacing: '-0.13px' }}
        >
          <p style={{ lineHeight: 1.5 }}>있다면 비포바이가 다음 리포트에 참고하여 알려드려요.</p>
          <p style={{ lineHeight: 1.5 }}>딱히 없다면 건너뛰어도 괜찮아요.</p>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 w-full h-[572px] bg-gray-50 rounded-tl-[50px] rounded-tr-[50px] drop-shadow-[0px_0px_3px_rgba(0,0,0,0.12)]'>
        <div
          className='absolute grid grid-cols-3 grid-rows-2 gap-[9px] h-[89px] w-[345px]'
          style={{ top: '24px', left: '24px' }}
        >
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selected.includes(cat) ? 'chip-active' : 'chip'}
              onClick={() => toggle(cat)}
              className='w-full h-full'
            >
              {cat}
            </Button>
          ))}
        </div>

        <div
          className={`absolute w-[345px] h-[56px] flex items-center rounded-[16px] transition-colors
            ${reason ? 'bg-white border-2 border-blue-500' : 'bg-gray-100'}`}
          style={{ top: '133px', left: '24px', paddingLeft: '30px', paddingRight: '30px' }}
        >
          <input
            type='text'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='간단한 이유 (선택)'
            className={`w-full bg-transparent outline-none text-[14px] font-semibold
              ${reason ? 'text-gray-800' : 'text-gray-500 placeholder:text-gray-500'}`}
            style={{ letterSpacing: '-0.14px', lineHeight: 1.5 }}
          />
        </div>

        <button
          onClick={onNext}
          className='absolute flex items-center justify-center w-[345px] h-[44px] text-[12px] font-semibold text-gray-500'
          style={{ top: '209px', left: '24px' }}
        >
          지금은 건너뛰기
        </button>

        <div className='absolute' style={{ bottom: '42px', left: '24px' }}>
          <Button onClick={onNext} variant={selected.length > 0 ? 'dark' : 'default'}>
            다음으로
          </Button>
        </div>
      </div>
    </div>
  )
}
