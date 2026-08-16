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
    // 버튼을 누른 순간이 결정이다. 이유 설문에서 뒤로 가도 결정은 남는다.
    saveDecision({
      name: product?.name,
      price: product?.price ?? 0,
      category,
      type,
      choice: key,
    });

    if (REASON_SURVEY[key])
      navigate(`/report/reason/${key}`, { state: { product } });
    // TODO: 살래요 선택 후 이동할 화면 (미정)
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
