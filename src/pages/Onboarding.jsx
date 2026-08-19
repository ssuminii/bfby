import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Splash from '../components/onboarding/Splash'
import Intro from '../components/onboarding/Intro'
import RegretSurvey from '../components/onboarding/RegretSurvey'
import LinkInput from '../components/onboarding/LinkInput'
import ProductConfirm from '../components/onboarding/ProductConfirm'

const ONBOARDED_KEY = 'bfby.onboarded'

export default function Onboarding() {
  const isReturn = localStorage.getItem(ONBOARDED_KEY) === 'true'
  const [step, setStep] = useState(isReturn ? 'link' : 'splash')
  const [link, setLink] = useState('')
  const navigate = useNavigate()

  const next = () => {
    if (step === 'splash') setStep('intro')
    else if (step === 'intro') setStep('category')
    else if (step === 'category') {
      localStorage.setItem(ONBOARDED_KEY, 'true')
      setStep('link')
    }
    else if (step === 'link') setStep('confirm')
  }

  return (
    <div className='flex flex-col h-full relative overflow-hidden'>
      {step === 'splash' && <Splash onNext={next} />}
      {step === 'intro' && <Intro onNext={next} />}
      {step === 'category' && <RegretSurvey onNext={next} />}
      {step === 'link' && (
        <LinkInput
          showHeader
          onBack={isReturn ? undefined : () => setStep('category')}
          hideBack={isReturn}
          onNext={(value) => {
            setLink(value)
            next()
          }}
        />
      )}
      {step === 'confirm' && (
        <ProductConfirm
          link={link}
          onNext={(product) => navigate('/consult', { state: { product } })}
          onBack={() => setStep('link')}
        />
      )}
    </div>
  )
}
