import { useEffect, useState } from 'react'
import Button from '../Button'

const QUESTIONS = [
  { title: '지금 쓰는 태블릿이 있나요?', options: ['쓰고있는데 고장났어요', '문항', '문항', '문항'] },
  { title: '질문', options: ['문항', '문항', '문항', '문항'] },
  { title: '질문', options: ['문항', '문항', '문항', '문항'] },
  { title: '질문', options: ['문항', '문항', '문항', '문항'] },
]

export default function QuestionSurvey({ onDone }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [phase, setPhase] = useState('idle') // idle | loading | done
  const question = QUESTIONS[index]

  useEffect(() => {
    if (phase === 'idle') return
    const timer = setTimeout(
      () => (phase === 'loading' ? setPhase('done') : onDone(answers)),
      phase === 'loading' ? 2200 : 2000,
    )
    return () => clearTimeout(timer)
  }, [phase, onDone, answers])

  const next = () => {
    const nextAnswers = [...answers, question.options[selected]]
    setAnswers(nextAnswers)
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1)
      setSelected(null)
    } else {
      setPhase('loading')
    }
  }

  return (
    <div className='relative flex flex-col h-full bg-white px-6 pt-6 pb-[42px]'>
      <div className='h-[6px] shrink-0 rounded-full bg-gray-100 overflow-hidden'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{
            width: `${((index + 1) / QUESTIONS.length) * 100}%`,
            background: 'linear-gradient(90deg, #7fb0ff 0%, #2f80ff 100%)',
          }}
        />
      </div>

      <p
        className='mt-[56px] text-head font-bold text-gray-800'
        style={{ letterSpacing: '-0.18px', lineHeight: 1.5 }}
      >
        Q{index + 1}. {question.title}
      </p>

      <div className='mt-[40px] flex flex-col gap-[14px]'>
        {question.options.map((option, i) => {
          const isSelected = selected === i
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex items-center justify-between h-[50px] shrink-0 px-[15px] rounded-[16px] border-2 transition-colors text-left
                ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-transparent'}`}
            >
              <span
                className={`font-medium ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}
                style={{ fontSize: '14px', letterSpacing: '-0.14px', lineHeight: 1.5 }}
              >
                {option}
              </span>
              <span
                className={`w-5 h-5 shrink-0 rounded-full bg-white transition-colors
                  ${isSelected ? 'border-[6px] border-blue-500' : 'border-[6px] border-gray-100'}`}
              />
            </button>
          )
        })}
      </div>

      <div className='mt-auto pt-4'>
        <Button onClick={next} variant={selected !== null ? 'dark' : 'default'}>
          다음으로
        </Button>
      </div>

      {phase !== 'idle' && (
        <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80'>
          {phase === 'loading' ? (
            <div className='w-[64px] h-[64px] rounded-full border-4 border-white/20 border-t-white animate-spin' />
          ) : (
            <p
              className='text-title font-bold text-white text-center'
              style={{ letterSpacing: '-0.4px', lineHeight: 1.5 }}
            >
              충동구매 분석 결과가 나왔어요!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
