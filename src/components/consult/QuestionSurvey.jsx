import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import { generateFirstQuestion, generateNextQuestion, generateJudgment } from '../../utils/gemini'
import { loadHistory } from '../../utils/history'

const AXES = ['이미 있나', '얼마나 쓸까', '왜 하필 지금', '예산이 감당되는가']

export default function QuestionSurvey({ productInfo, onDone }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [category, setCategory] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [extraText, setExtraText] = useState('')
  const [generating, setGenerating] = useState(true)
  const [phase, setPhase] = useState('idle') // idle | loading | done
  const judgmentRef = useRef(null)

  const axes = [0, 1, 2, 3]
  const totalQuestions = axes.length
  const currentAxisIndex = axes[currentIndex]
  const isQ3 = currentAxisIndex === 2
  const question = questions[currentIndex]

  useEffect(() => {
    if (!productInfo) return
    generateFirstQuestion(productInfo).then((res) => {
      setCategory(res.category)
      setQuestions([res])
      setGenerating(false)
    })
  }, [productInfo])

  useEffect(() => {
    if (phase !== 'done') return
    const timer = setTimeout(
      () => onDone({ answers, judgment: judgmentRef.current, category }),
      2000,
    )
    return () => clearTimeout(timer)
  }, [phase, onDone, answers, category])

  const next = async () => {
    const answer = selected !== null ? question.options[selected] : extraText.trim()
    const newAnswers = [
      ...answers,
      { question: question.question, answer, axis: AXES[currentAxisIndex], extraText: isQ3 ? extraText : '' },
    ]
    setAnswers(newAnswers)
    setSelected(null)
    setExtraText('')

    const nextIndex = currentIndex + 1

    if (nextIndex >= totalQuestions) {
      setPhase('loading')
      const [judgeResult] = await Promise.all([
        // 같은 카테고리의 지난 결정을 넘겨 선택지 제안에 쓰게 한다
        generateJudgment(
          productInfo,
          category,
          newAnswers,
          loadHistory().filter((record) => record.category === category),
        ),
        new Promise((resolve) => setTimeout(resolve, 2200)),
      ])
      judgmentRef.current = judgeResult
      setPhase('done')
      return
    }

    setGenerating(true)
    setCurrentIndex(nextIndex)
    const nextQ = await generateNextQuestion(productInfo, category, newAnswers, axes[nextIndex])
    setQuestions((prev) => [...prev, nextQ])
    setGenerating(false)
  }

  return (
    <div className='relative flex flex-col h-full bg-white px-6 pt-6 pb-[42px]'>
      <div className='h-[6px] shrink-0 rounded-full bg-gray-100 overflow-hidden'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{
            width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            background: 'linear-gradient(90deg, #7fb0ff 0%, #2f80ff 100%)',
          }}
        />
      </div>

      {generating || !question ? (
        <div className='mt-[56px] flex flex-col gap-[14px]'>
          <div className='h-7 w-3/4 rounded-lg bg-gray-100 animate-pulse' />
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-[50px] rounded-[16px] bg-gray-50 animate-pulse' />
          ))}
        </div>
      ) : (
        <>
          <p
            className='mt-[56px] text-head font-bold text-gray-800'
            style={{ letterSpacing: '-0.18px', lineHeight: 1.5 }}
          >
            Q{currentIndex + 1}. {question.question}
          </p>

          <div className='mt-[24px] flex flex-col gap-[14px]'>
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

            {isQ3 && (
              <input
                type='text'
                value={extraText}
                onChange={(e) => setExtraText(e.target.value)}
                placeholder='한 줄로 적어보기 (선택)'
                className='h-[50px] shrink-0 px-[15px] rounded-[16px] bg-gray-50 border-2 border-transparent outline-none text-gray-800 font-medium placeholder:text-gray-400 focus:border-blue-300'
                style={{ fontSize: '14px', letterSpacing: '-0.14px', lineHeight: 1.5 }}
              />
            )}
          </div>
        </>
      )}

      <div className='mt-auto pt-4'>
        <Button onClick={next} variant={selected !== null || (isQ3 && extraText.trim()) ? 'dark' : 'default'}>
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
