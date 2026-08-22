import ReasonOption from "./ReasonOption";

export default function ReasonOptions({ options, selected, onSelect }) {
  return (
    <div className="flex flex-col gap-4">
      {options.map((label) => (
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
