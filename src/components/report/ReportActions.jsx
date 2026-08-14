import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { REASON_SURVEY } from "../../constants/reasonSurvey";

const fillLabel = (label, saving) =>
  label.replace("{saving}", saving.toLocaleString());

export default function ReportActions({ actions, saving }) {
  const navigate = useNavigate();

  const handle = (key) => {
    if (REASON_SURVEY[key]) navigate(`/report/reason/${key}`);
    // TODO: 살래요 / 비추천 상품 buy 선택 시 처리 (미정)
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
