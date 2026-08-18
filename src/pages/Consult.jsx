import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QuestionSurvey from '../components/consult/QuestionSurvey'

export default function Consult() {
  const { state } = useLocation()
  const productInfo = state?.product ?? null
  const [, setAnswers] = useState([])
  const navigate = useNavigate()

  const finishQuestions = (result) => {
    setAnswers(result.answers)
    navigate('/report', {
      replace: true,
      state: { judgment: result.judgment, product: productInfo, category: result.category },
    })
  }

  return (
    <div className='flex flex-col h-full bg-white'>
      <QuestionSurvey productInfo={productInfo} onDone={finishQuestions} />
    </div>
  )
}
