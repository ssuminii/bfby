import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LinkInput from '../components/onboarding/LinkInput'
import ProductConfirm from '../components/onboarding/ProductConfirm'

export default function ConsultSetup() {
  const [step, setStep] = useState('link')
  const [link, setLink] = useState('')
  const navigate = useNavigate()

  return (
    <div className='flex flex-col h-full relative overflow-hidden'>
      {step === 'link' && (
        <LinkInput
          onNext={(value) => {
            setLink(value)
            setStep('confirm')
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
