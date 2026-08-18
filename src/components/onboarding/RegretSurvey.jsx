import { useState } from 'react'
import Button from '../Button'
import BottomSheetPage from '../BottomSheetPage'

const CATEGORIES = ['의류', '뷰티', '전자기기', '생활용품', '식품', '취미 · 운동']

export default function RegretSurvey({ onNext }) {
  const [selected, setSelected] = useState([])
  const [reason, setReason] = useState('')

  const toggle = (cat) =>
    setSelected((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]))

  return (
    <BottomSheetPage
      title={
        <>
          <p className='text-title font-bold text-gray-800'>
            최근 후회했던 소비가 있었나요?
          </p>
          <div className='text-gray-500 font-medium'
            style={{ fontSize: '13px', letterSpacing: '-0.13px' }}>
            <p style={{ lineHeight: 1.5 }}>있다면 비포바이가 다음 리포트에 참고하여 알려드려요.</p>
            <p style={{ lineHeight: 1.5 }}>딱히 없다면 건너뛰어도 괜찮아요.</p>
          </div>
        </>
      }
    >
      <div className='grid grid-cols-3 grid-rows-2 gap-2.25 h-22.25 shrink-0'>
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
        className={`mt-5 flex items-center shrink-0 h-14 rounded-2xl transition-colors
          ${reason ? 'bg-white border-2 border-blue-500' : 'bg-gray-100'}`}
        style={{ paddingLeft: '30px', paddingRight: '30px' }}
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
        className='mt-5 flex items-center justify-center shrink-0 h-11 text-[12px] font-semibold text-gray-500'
      >
        지금은 건너뛰기
      </button>

      <div className='mt-auto pt-4'>
        <Button onClick={onNext} variant={selected.length > 0 ? 'dark' : 'default'}>
          다음으로
        </Button>
      </div>
    </BottomSheetPage>
  )
}
