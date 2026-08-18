import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { REASON_SURVEY } from "../../constants/reasonSurvey";
import { saveDecision } from "../../utils/history";

const fillLabel = (label, saving) =>
  label.replace("{saving}", saving.toLocaleString());

export default function ReportActions({
  actions,
  saving,
  product,
  category,
  type,
}) {
  const navigate = useNavigate();

  const handle = (key) => {
    // 안 살래요·더 고민할게요는 이유 설문까지 마쳐야 결정으로 친다.
    // 중간에 뒤로 가면 기록에 남지 않아야 집계가 부풀지 않는다.
    if (REASON_SURVEY[key]) {
      navigate(`/report/reason/${key}`, {
        state: { product, category, type, choice: key },
      });
      return;
    }

    // 살래요는 물어볼 이유가 없으니 누른 순간이 결정
    // 추천 리포트에서 누른 것만 좋은 소비가 된다 (utils/history.js의 isGoodSpending).
    saveDecision({
      name: product?.name,
      price: product?.price ?? 0,
      category,
      type,
      choice: key,
    });
    navigate("/reports");
  };

  return (
    <div className="w-full flex flex-col gap-3 mt-10">
      {actions.map(({ key, label, variant }) => (
        <Button key={key} variant={variant} onClick={() => handle(key)}>
          {fillLabel(label, saving)}
        </Button>
      ))}
    </div>
  );
}
