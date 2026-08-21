import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Card from "../components/Card";
import Chip from "../components/Chip";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import ReasonList from "../components/report/ReasonList";
import CardTitle from "../components/report/CardTitle";
import ConcernProductCard from "../components/buyornot/ConcernProductCard";
import { REPORT_THEME } from "../constants/reportTheme";
import { generateHoldAdvice } from "../utils/gemini";
import fetchProductInfo from "../utils/fetchProductInfo";

const ADVICE_CACHE_PREFIX = "bfby.advice.";

const REASON_SECTION_TITLE = {
  recommend: "구매를 추천했던 이유",
  hold: "보류를 조언했던 이유",
  avoid: "추천하지 않았던 이유",
};

const ANSWER_TONE = {
  recommend: "info",
  hold: "caution",
  avoid: "caution",
};

export default function BuyOrNotDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const record = state?.record;
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    if (!record?.at) return;
    const cacheKey = ADVICE_CACHE_PREFIX + record.at;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setAdvice(cached);
      return;
    }
    setAdviceLoading(true);
    generateHoldAdvice(record)
      .then((text) => {
        if (text) {
          setAdvice(text);
          try { localStorage.setItem(cacheKey, text); } catch {}
        }
      })
      .finally(() => setAdviceLoading(false));
  }, [record?.at]);

  useEffect(() => {
    if (!record?.link) return;
    fetchProductInfo(record.link).then((info) => {
      if (info?.price != null) setCurrentPrice(info.price);
    });
  }, [record?.link]);

  if (!record) return null;

  const type = record.type ?? "hold";
  const gradient = REPORT_THEME[type]?.gradient ?? REPORT_THEME.hold.gradient;
  const answerTone = ANSWER_TONE[type] ?? "caution";
  const reasonTitle = REASON_SECTION_TITLE[type];

  const tryFirstOptions = record.tryFirst
    ? (Array.isArray(record.tryFirst) ? record.tryFirst : [record.tryFirst]).filter((o) => o?.lead)
    : null;

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: gradient }}>
        <div className="flex flex-col gap-9 px-6 pt-6 pb-6">
          <ConcernProductCard record={record} />

          {/* 그 때 이렇게 답하셨어요 */}
          {record.signalAnswers?.length > 0 && (
            <Card className="bg-white p-6 flex flex-col gap-3">
              <p className="text-head text-gray-800">그 때 이렇게 답하셨어요</p>
              <div className="flex flex-wrap gap-2">
                {record.signalAnswers.map((answer) => (
                  <Chip key={answer} tone={answerTone}>{answer}</Chip>
                ))}
              </div>
            </Card>
          )}

          {/* 보류/추천 이유 */}
          {record.reasonItems?.length > 0 && (
            <Card className="bg-white p-6 flex flex-col gap-6">
              <CardTitle icon="reason">{reasonTitle}</CardTitle>
              <ReasonList items={record.reasonItems} />
            </Card>
          )}

          {/* 가격 정보 */}
          {record.price > 0 &&
            (() => {
              const saved = record.price;
              const now = currentPrice;
              const diff = now != null ? now - saved : 0;
              const displayPrice = now ?? saved;
              const perUse = Math.round(displayPrice / 30);

              let title = "가격이 그대로예요";
              let body = `처음 고민할 때와 같은 ${saved.toLocaleString()}원으로, 한 번 쓸 때마다 약 ${perUse.toLocaleString()}원이 들어요.`;

              if (now != null && diff < 0) {
                title = "가격이 내려갔어요";
                body = `처음 고민할 때보다 ${Math.abs(diff).toLocaleString()}원 내려간 가격이에요. 한 번 쓸 때마다 약 ${perUse.toLocaleString()}원이 들어요.`;
              } else if (now != null && diff > 0) {
                title = "가격이 올랐어요";
                body = `처음 고민할 때보다 ${diff.toLocaleString()}원 오른 가격이에요. 한 번 쓸 때마다 약 ${perUse.toLocaleString()}원이 들어요.`;
              }

              return (
                <Card className="bg-white p-6 flex flex-col gap-6">
                  <CardTitle icon="cost">{title}</CardTitle>
                  <p className="text-result text-gray-600">{body}</p>
                </Card>
              );
            })()}

          {/* AI 조언 */}
          {(advice || adviceLoading) && (
            <Card className="bg-white p-6 flex flex-col gap-6">
              <CardTitle icon="ai">다시 생각해봐요</CardTitle>
              {adviceLoading ? (
                <p className="text-result text-gray-400">조언을 불러오는 중이에요...</p>
              ) : (
                <p className="text-result text-gray-600">{advice}</p>
              )}
            </Card>
          )}

          {/* 이런 선택지도 있었어요 */}
          {tryFirstOptions?.length > 0 && (
            <Card className="bg-white p-6 flex flex-col gap-6">
              <CardTitle icon="idea">이런 선택지도 있었어요</CardTitle>
              <div className="flex flex-col gap-3">
                {tryFirstOptions.map((option, index) => (
                  <div key={option.lead} className="flex flex-col gap-3">
                    {index > 0 && <div className="h-px w-full bg-gray-100" />}
                    <div className="flex flex-col gap-1">
                      <p className="text-result font-bold text-gray-800">{option.lead}</p>
                      <p className="text-result text-gray-600">{option.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="px-6 pt-4 pb-4 shrink-0 bg-white">
        <Button
          variant="dark"
          onClick={() => navigate("/buyornot/decide", { state: { record } })}
        >
          결정하기
        </Button>
      </div>

      <NavBar />
    </div>
  );
}
