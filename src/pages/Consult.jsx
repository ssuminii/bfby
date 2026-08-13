import { useState } from 'react'
import QuestionSurvey from '../components/consult/QuestionSurvey'

export default function Consult() {
  const [step, setStep] = useState('questions')
  const [, setAnswers] = useState([])

  const finishQuestions = (result) => {
    setAnswers(result)
    setStep('judging')
  }

  return (
    <div className='flex flex-col h-full bg-white'>
      {step === 'questions' && <QuestionSurvey onDone={finishQuestions} />}
      {step === 'judging' && <div className='flex-1' />}
    </div>
  )
}
