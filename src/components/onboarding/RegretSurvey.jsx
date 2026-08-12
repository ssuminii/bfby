import { useState } from 'react'
import Button from '../Button'

const CATEGORIES = ['의류', '뷰티', '전자기기', '생활용품', '식품', '취미 · 운동']

export default function RegretSurvey({ onNext }) {
  const [selected, setSelected] = useState([])
  const [reason, setReason] = useState('')

  const toggle = (cat) =>
    setSelected((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]))

  return (
    <div className='relative w-full h-full bg-white'>
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
