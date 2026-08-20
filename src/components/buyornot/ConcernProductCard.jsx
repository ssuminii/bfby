import Card from '../Card'
import Tag from '../Tag'
import ChevronLeftIcon from '../icons/ChevronLeftIcon'

const EXPIRY_DAYS = 7

function daysSince(isoDate) {
  const saved = new Date(isoDate)
  const today = new Date()
  const savedDay = new Date(saved.getFullYear(), saved.getMonth(), saved.getDate())
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.floor((todayDay - savedDay) / (1000 * 60 * 60 * 24))
}

export default function ConcernProductCard({
  record,
  onClick,
  showChevron = false,
  showExpired = false,
}) {
  const days = daysSince(record.at)
  const expired = showExpired && days >= EXPIRY_DAYS
  const dateLabel = days === 0 ? '오늘' : `${days}일 지남`

  return (
    <Card
      className={`bg-white p-6 flex flex-col gap-3
        ${onClick ? 'cursor-pointer active:opacity-80' : ''}
        ${expired ? 'border-2 border-error' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="flex flex-1 min-w-0 gap-5 items-start h-13">
          {record.image ? (
            <img
              src={record.image}
              alt=""
              referrerPolicy="no-referrer"
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
        {showChevron && (
          <div className="flex items-center justify-center shrink-0">
            <ChevronLeftIcon className="rotate-180 text-gray-300" />
          </div>
        )}
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
