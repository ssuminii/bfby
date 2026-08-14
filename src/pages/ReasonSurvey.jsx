import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import OtherInput from "../components/reason/OtherInput";
import ProductSummary from "../components/reason/ProductSummary";
import ReasonOptions from "../components/reason/ReasonOptions";
import { REASON_SURVEY } from "../constants/reasonSurvey";
import { PRODUCT } from "../mocks/report";

export default function ReasonSurvey() {
  const navigate = useNavigate();
  const { choice } = useParams();
  const survey = REASON_SURVEY[choice];

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

  const submit = () => {
    // TODO: answer 를 서버로 보내고 이동할 화면 결정 (미정)
    navigate(-1);
  };

  if (!survey) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      <Header />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col px-6 pb-[42px]">
          {survey.showProduct && (
            <div className="mt-6">
              <ProductSummary name={PRODUCT.name} price={PRODUCT.price} />
            </div>
          )}

          <p
            className={`whitespace-pre-line text-title font-bold text-gray-800 leading-[1.5] tracking-tight-2
              ${survey.showProduct ? "mt-6" : "mt-10"}`}
          >
            {survey.question}
          </p>

          <div className={survey.showProduct ? "mt-6" : "mt-12"}>
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
