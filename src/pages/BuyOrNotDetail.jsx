import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Tag from '../components/Tag'
import Button from '../components/Button'
import NavBar from '../components/NavBar'
import AiIcon from '../components/icons/AiIcon'
import ReasonList from '../components/report/ReasonList'
import ConcernProductCard from '../components/buyornot/ConcernProductCard'
import { REPORT_THEME } from '../constants/reportTheme'

const REASON_SECTION_TITLE = {
  recommend: '구매를 추천했던 이유',
  hold: '보류를 조언했던 이유',
  avoid: '추천하지 않았던 이유',
}

const ANSWER_TAG = {
  recommend: { bg: 'bg-blue-100', text: 'text-[#1f6ae0]' },
  hold: { bg: 'bg-[#fff4db]', text: 'text-caution' },
  avoid: { bg: 'bg-[#fff4db]', text: 'text-caution' },
}

export default function BuyOrNotDetail() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const record = state?.record

  if (!record) return null

  const type = record.type ?? 'hold'
  const gradient = REPORT_THEME[type]?.gradient ?? REPORT_THEME.hold.gradient
  const answerTag = ANSWER_TAG[type] ?? ANSWER_TAG.hold
  const reasonTitle = REASON_SECTION_TITLE[type]

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: gradient }}>
        <div className="flex flex-col gap-4 px-6 pt-6 pb-6">

          <ConcernProductCard record={record} />

          {/* 그 때 이렇게 답하셨어요 */}
          {record.reason && (
            <Card className="bg-white p-6 flex flex-col gap-3">
              <p className="text-head text-gray-800">그 때 이렇게 답하셨어요</p>
              <div className="flex flex-wrap gap-2">
                <Tag
                  bg={answerTag.bg}
                  text={answerTag.text}
                  weight="font-bold"
                  className="h-7 px-3"
                >
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

      <div className="px-6 pt-4 pb-4 shrink-0 bg-white">
        <Button
          variant="dark"
          onClick={() => navigate('/buyornot/decide', { state: { record } })}
        >
          결정하기
        </Button>
      </div>

      <NavBar />
    </div>
  )
}
