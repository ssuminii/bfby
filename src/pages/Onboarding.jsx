import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Splash from '../components/onboarding/Splash'
import Intro from '../components/onboarding/Intro'
import RegretSurvey from '../components/onboarding/RegretSurvey'

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
