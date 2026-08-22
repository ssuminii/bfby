import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import NavBar from '../components/NavBar'
import ConcernProductCard from '../components/buyornot/ConcernProductCard'
import { resolveHold } from '../utils/history'
import curiousImg from '../assets/curious.webp'

export default function HoldDecision() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const record = state?.record

  if (!record) return null

  const handleBuy = () => {
    const resolved = resolveHold(record.at, 'buy')
    navigate('/report/card', { state: { record: resolved ?? record } })
  }

  const handleSkip = () => {
    navigate('/report/reason/skip', {
      state: {
        product: { name: record.name, price: record.price, image: record.image },
        category: record.category,
        type: record.type,
        choice: 'skip',
        reasonItems: record.reasonItems ?? [],
        holdAt: record.at,
      },
    })
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full px-6 pt-6 pb-6">
          <ConcernProductCard record={record} />

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <img src={curiousImg} alt="" className="w-55.75" />
            <p className="text-title font-bold text-gray-800 text-center">어떻게 결정하셨나요?</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-4 shrink-0 bg-white flex flex-col gap-3">
        <Button variant="dark" onClick={handleBuy}>살래요</Button>
        <Button variant="secondary" onClick={handleSkip}>안 살래요</Button>
      </div>

      <NavBar />
    </div>
  )
}
