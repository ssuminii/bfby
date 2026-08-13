import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Splash from '../components/onboarding/Splash'
import Intro from '../components/onboarding/Intro'
import RegretSurvey from '../components/onboarding/RegretSurvey'
import LinkInput from '../components/onboarding/LinkInput'
import ProductConfirm from '../components/onboarding/ProductConfirm'

export default function Onboarding() {
  const [step, setStep] = useState('splash')
  const navigate = useNavigate()

  const next = () => {
    if (step === 'splash') setStep('intro')
    else if (step === 'intro') setStep('category')
    else if (step === 'category') setStep('link')
    else if (step === 'link') setStep('confirm')
    else navigate('/consult')
  }

  return (
    <div className='flex flex-col h-full relative overflow-hidden'>
      {step === 'splash' && <Splash onNext={next} />}
      {step === 'intro' && <Intro onNext={next} />}
      {step === 'category' && <RegretSurvey onNext={next} />}
      {step === 'link' && <LinkInput onNext={next} />}
      {step === 'confirm' && <ProductConfirm onNext={next} onBack={() => setStep('link')} />}
    </div>
  )
}
