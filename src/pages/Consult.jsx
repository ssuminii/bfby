import { useState } from 'react'

const STEPS = ['input', 'analyzing', 'questions', 'judging', 'report']

export default function Consult() {
  const [step, setStep] = useState('input')
  const [data, setData] = useState({ url: '', product: null, answers: {} })

  return (
    <div className="flex flex-col h-full">
      {/* step별 컴포넌트 나중에 여기에 */}
    </div>
  )
}
