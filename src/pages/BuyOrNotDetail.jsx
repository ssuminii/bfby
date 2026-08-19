import { useEffect, useState } from 'react'
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
import { generateHoldAdvice } from '../utils/gemini'

const ADVICE_CACHE_PREFIX = 'bfby.advice.'

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
  const [advice, setAdvice] = useState(null)
  const [adviceLoading, setAdviceLoading] = useState(false)

  useEffect(() => {
    if (!record?.at) return
    const cacheKey = ADVICE_CACHE_PREFIX + record.at
    const cached = localStorage.getItem(cacheKey)
    if (cached) { setAdvice(cached); return }

    setAdviceLoading(true)
    generateHoldAdvice(record)
      .then((text) => {
        if (text) {
          setAdvice(text)
          try { localStorage.setItem(cacheKey, text) } catch {}
        }
      })
      .finally(() => setAdviceLoading(false))
  }, [record?.at])

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

          {/* AI 조언 */}
          {(advice || adviceLoading) && (
            <Card className="bg-white p-6 flex flex-col gap-3">
              <div className="flex gap-2 items-start">
                <AiIcon className="shrink-0" />
                <p className="text-head text-gray-800">다시 생각해봐요</p>
              </div>
              {adviceLoading ? (
                <p className="text-body1 text-gray-400">조언을 불러오는 중이에요...</p>
              ) : (
                <p className="text-body1 text-gray-800">{advice}</p>
              )}
            </Card>
          )}

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
