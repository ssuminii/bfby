import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import OtherInput from "../components/reason/OtherInput";
import ProductSummary from "../components/reason/ProductSummary";
import ReasonOptions from "../components/reason/ReasonOptions";
import { REASON_SURVEY } from "../constants/reasonSurvey";
import { saveDecision, resolveHold } from "../utils/history";

export default function ReasonSurvey() {
  const navigate = useNavigate();
  const { choice } = useParams();
  const { state } = useLocation();
  const survey = REASON_SURVEY[choice];
  const product = state?.product;

  const [selected, setSelected] = useState(null);
  const [other, setOther] = useState("");
  const answer = other.trim() || selected;

  const selectOption = (label) => {
    setSelected(label);
    setOther("");
  };
  const changeOther = (text) => {
    setOther(text);
    if (text) setSelected(null);
  };

  // 완료를 눌러야 비로소 결정으로 집계된다. 버튼을 누른 것만으로는 기록하지 않는다.
  const submit = () => {
    // holdAt이 있으면 기존 hold 기록을 업데이트, 없으면 새 기록 생성
    const holdAt = state?.holdAt;
    let saved;
    if (holdAt) {
      saved = resolveHold(holdAt, choice) ?? { ...state, choice, reason: answer };
    } else {
      const record = {
        name: product?.name,
        price: product?.price ?? 0,
        image: product?.image ?? null,
        category: state?.category,
        type: state?.type,
        choice,
        reason: answer,
        reasonItems: state?.reasonItems ?? [],
      };
      saved = saveDecision(record);
    }
    // TODO: answer 를 서버로 보내기 (미정)
    navigate("/report/card", { state: { record: saved, link: product?.link } });
  };

  if (!survey) return null;

  const showProduct = survey.showProduct && product;

  return (
    <div className="flex flex-col h-full bg-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col px-6 pb-[42px]">
          {showProduct && (
            <div className="mt-6">
              <ProductSummary name={product.name} price={product.price} />
            </div>
          )}

          <p
            className={`whitespace-pre-line text-title font-bold text-gray-800 leading-[1.5] tracking-tight-2
              ${showProduct ? "mt-6" : "mt-10"}`}
          >
            {survey.question}
          </p>

          <div className={showProduct ? "mt-6" : "mt-12"}>
            <ReasonOptions selected={selected} onSelect={selectOption} />
            <div className="mt-3 flex flex-col">
              <OtherInput value={other} onChange={changeOther} />
            </div>
          </div>

          <div className="mt-auto pt-10">
            <Button onClick={submit} variant={answer ? "dark" : "default"}>
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
