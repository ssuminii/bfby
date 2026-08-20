import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadHistory } from '../utils/history'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import ConcernProductCard from '../components/buyornot/ConcernProductCard'

export default function BuyOrNot() {
  const navigate = useNavigate()
  const concerns = useMemo(
    () => loadHistory().filter((r) => r.choice === 'hold' && !r.checkin),
    []
  )

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="살래말래" />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-6.25 pt-6 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <p className="text-price text-gray-800">고민해 보셨나요?</p>
            <div className="flex items-center justify-center size-6 rounded-full bg-gray-800 shrink-0">
              <span className="text-head text-white leading-none">{concerns.length}</span>
            </div>
          </div>

          {concerns.length === 0 ? (
            <p className="text-body2 text-gray-400 text-center mt-20">고민 중인 상품이 없어요</p>
          ) : (
            <div className="flex flex-col gap-4">
              {concerns.map((record, i) => (
                <ConcernProductCard
                  key={i}
                  record={record}
                  showChevron
                  showExpired
                  onClick={() => navigate('/buyornot/detail', { state: { record } })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  )
}
