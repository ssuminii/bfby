import { REASON_OPTIONS } from "../../constants/reasonSurvey";
import ReasonOption from "./ReasonOption";

export default function ReasonOptions({ selected, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {REASON_OPTIONS.map((label) => (
        <ReasonOption
          key={label}
          label={label}
          selected={selected === label}
          onSelect={() => onSelect(label)}
        />
      ))}
    </div>
  );
}
