import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Tag from '../components/Tag'
import Button from '../components/Button'
import NavBar from '../components/NavBar'
import AiIcon from '../components/icons/AiIcon'
import ReasonList from '../components/report/ReasonList'
import { REPORT_THEME } from '../constants/reportTheme'

const REASON_SECTION_TITLE = {
  recommend: '구매를 추천했던 이유',
  hold: '보류를 조언했던 이유',
  avoid: '추천하지 않았던 이유',
}

// "그 때 이렇게 답하셨어요" 태그 색 - recommend는 파랑, hold/avoid는 노랑
const ANSWER_TAG = {
  recommend: { bg: 'bg-blue-100', text: 'text-[#1f6ae0]' },
  hold: { bg: 'bg-[#fff4db]', text: 'text-caution' },
  avoid: { bg: 'bg-[#fff4db]', text: 'text-caution' },
}

function daysSince(isoDate) {
  return Math.floor((Date.now() - new Date(isoDate)) / (1000 * 60 * 60 * 24))
}

export default function BuyOrNotDetail() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const record = state?.record

  if (!record) return null

  const days = daysSince(record.at)
  const dateLabel = days === 0 ? '오늘' : `${days}일 지남`
  const type = record.type ?? 'hold'
  const gradient = REPORT_THEME[type]?.gradient ?? REPORT_THEME.hold.gradient
  const answerTag = ANSWER_TAG[type] ?? ANSWER_TAG.hold
  const reasonTitle = REASON_SECTION_TITLE[type]

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: gradient }}>
        <div className="flex flex-col gap-4 px-6 pt-6 pb-6">

          {/* 상품 카드 */}
          <Card className="bg-white p-6 flex flex-col gap-3">
            <div className="flex items-start">
              <div className="flex flex-1 min-w-0 gap-5 items-start h-13">
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
                    <span className="text-gray-500">· {dateLabel}</span>
                  </p>
                </div>
              </div>
            </div>
            {record.reason && (
              <div className="flex flex-wrap gap-2">
                <Tag bg="bg-[#464950]" weight="font-bold" className="h-7 px-3">
                  {record.reason}
                </Tag>
              </div>
            )}
          </Card>

          {/* 그 때 이렇게 답하셨어요 */}
          {record.reason && (
            <Card className="bg-white p-6 flex flex-col gap-3">
              <p className="text-head text-gray-800">그 때 이렇게 답하셨어요</p>
              <div className="flex flex-wrap gap-2">
                <Tag bg={answerTag.bg} text={answerTag.text} weight="font-bold" className="h-7 px-3">
                  {record.reason}
                </Tag>
              </div>
            </Card>
          )}

          {/* 추천/보류 이유 */}
          {record.reasonItems?.length > 0 && (
            <Card className="bg-white p-6 flex flex-col gap-4">
              <p className="text-head text-gray-800">{reasonTitle}</p>
              <ReasonList items={record.reasonItems} />
            </Card>
          )}

          {/* AI 답변 생성 */}
          <Card className="bg-white p-6 flex flex-col gap-3">
            <div className="flex gap-2 items-start">
              <AiIcon className="shrink-0" />
              <p className="text-head text-gray-800">AI 답변 생성</p>
            </div>
            <p className="text-body1 text-gray-800">
              이 섹션은 '어떤 점이 걸리셨나요?' 페이지에서 사용자의 응답을 토대로 AI가 1줄 정도 자동 조언합니다.
              {'\n'}(가격은 밑에 고정으로 있어서 제외)
            </p>
          </Card>

          {/* 가격 정보 */}
          {record.price > 0 && (
            <Card className="bg-white p-6 flex flex-col gap-3">
              <div className="flex gap-2 items-start">
                <AiIcon className="shrink-0" />
                <p className="text-head text-gray-800">가격이 그대로예요</p>
              </div>
              <p className="text-body1 text-gray-800">
                보관할 때와 같은 {record.price.toLocaleString()}원으로, 한 번 쓸 때마다 약{' '}
                {Math.round(record.price / 30).toLocaleString()}원이 들어요.
              </p>
            </Card>
          )}

        </div>
      </div>

      {/* 결정하기 버튼 */}
      <div className="px-6 pt-4 pb-4 shrink-0 bg-white">
        <Button
          variant="dark"
          onClick={() => navigate('/report/reason/hold', { state: { product: record } })}
        >
          결정하기
        </Button>
      </div>

      <NavBar />
    </div>
  )
}
