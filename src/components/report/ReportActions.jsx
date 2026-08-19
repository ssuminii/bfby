import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { needsReasonSurvey } from "../../constants/reasonSurvey";
import { saveDecision } from "../../utils/history";

const fillLabel = (label, saving) =>
  label.replace("{saving}", saving.toLocaleString());

export default function ReportActions({
  actions,
  saving,
  product,
  category,
  type,
  note,
}) {
  const navigate = useNavigate();

  const handle = (key) => {
    // 안 살래요·더 고민할게요는 이유 설문까지 마쳐야 결정으로 친다.
    // 중간에 뒤로 가면 기록에 남지 않아야 집계가 부풀지 않는다.
    if (needsReasonSurvey(key, type)) {
      navigate(`/report/reason/${key}`, {
        state: { product, category, type, choice: key },
      });
      return;
    }

    // 살래요는 물어볼 이유가 없으니 누른 순간이 결정
    const record = {
      name: product?.name,
      price: product?.price ?? 0,
      image: product?.image ?? null,
      category,
      type,
      choice: key,
    };
    const saved = saveDecision(record);

    navigate("/report/card", {
      state: { record: saved, note, link: product?.link },
    });
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
