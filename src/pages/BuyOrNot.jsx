import { useMemo } from 'react'
import { loadHistory } from '../utils/history'
import Card from '../components/Card'
import Tag from '../components/Tag'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon'

const EXPIRY_DAYS = 7

function daysSince(isoDate) {
  return Math.floor((Date.now() - new Date(isoDate)) / (1000 * 60 * 60 * 24))
}

function ConcernCard({ record }) {
  const days = daysSince(record.at)
  const expired = days >= EXPIRY_DAYS
  const dateLabel = days === 0 ? '오늘' : `${days}일 지남`

  return (
    <Card className={`bg-white p-6 flex flex-col gap-3 ${expired ? 'border-2 border-error' : ''}`}>
      <div className="flex items-start">
        <div className="flex flex-1 min-w-0 gap-5 items-start h-[52px]">
          {record.image ? (
            <img
              src={record.image}
              alt=""
              className="size-13 rounded-lg object-cover shrink-0 bg-gray-100"
            />
          ) : (
            <div className="size-13 rounded-lg bg-gray-100 shrink-0" />
          )}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <p className="text-head text-gray-800 truncate">{record.name}</p>
            <p className="text-body1 font-semibold text-gray-600">
              {record.price != null && `${record.price.toLocaleString()}원 `}
              <span className="text-gray-500">· </span>
              <span className={expired ? 'text-error' : 'text-gray-500'}>{dateLabel}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center shrink-0">
          <ChevronLeftIcon className="rotate-180 text-gray-300" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {record.reason && (
          <Tag bg="bg-[#464950]" weight="font-bold" className="h-7 px-3">
            {record.reason}
          </Tag>
        )}
        {expired && (
          <Tag bg="bg-[#ffe6e6]" text="text-error" weight="font-bold" className="h-7 px-3">
            오래됐어요. 정리할까요?
          </Tag>
        )}
      </div>
    </Card>
  )
}

export default function BuyOrNot() {
  const concerns = useMemo(
    () => loadHistory().filter((r) => r.choice === 'hold' && !r.checkin),
    []
  )

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="살래말래" />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-[25px] pt-6 pb-8">
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
                <ConcernCard key={i} record={record} />
              ))}
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  )
}
