import Tag from "../Tag";

const TONES = {
  good: { label: "좋음", bg: "bg-info" },
  caution: { label: "걸림", bg: "bg-caution" },
  warn: { label: "주의", bg: "bg-error" },
};

export default function ReasonList({ items }) {
  return (
    <ul className="w-full flex flex-col gap-3">
      {items.map(({ tone, text }) => (
        <li key={text} className="flex items-center gap-[11px]">
          <Tag bg={TONES[tone].bg} className="shrink-0">
            {TONES[tone].label}
          </Tag>
          <p className="text-body2 font-medium text-gray-800 leading-[1.5] tracking-tight-1">
            {text}
          </p>
        </li>
      ))}
    </ul>
  );
}
