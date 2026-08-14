import Button from "../Button";

const fillLabel = (label, saving) =>
  label.replace("{saving}", saving.toLocaleString());

export default function ReportActions({ actions, saving }) {
  return (
    <div className="w-full flex flex-col gap-3 mt-10">
      {actions.map(({ key, label, variant }) => (
        <Button key={key} variant={variant}>
          {fillLabel(label, saving)}
        </Button>
      ))}
    </div>
  );
}
