import Card from "../Card";
import Tag from "../Tag";

const TONES = {
  good: { label: "좋음", bg: "bg-info" },
  caution: { label: "걸림", bg: "bg-caution" },
  warn: { label: "주의", bg: "bg-error" },
};

// 문단 안의 줄바꿈은 '\n' 으로 넣는다. 문단 사이 간격은 아래 Paragraphs 가 담당.
const Muted = ({ children }) => (
  <p className="text-[12px] font-semibold text-gray-600 leading-[1.5] whitespace-pre-line">
    {children}
  </p>
);

const Paragraphs = ({ items }) => (
  <div className="w-full flex flex-col gap-[16px]">
    {items.map((text) => (
      <Muted key={text}>{text}</Muted>
    ))}
  </div>
);

export default function ReportCard({ card }) {
  return (
    <Card>
      <p className="text-title font-bold text-gray-800 tracking-tight-1">
        {card.title}
      </p>

      {card.items && (
        <ul className="w-full flex flex-col gap-[12px]">
          {card.items.map(({ tone, text }) => (
            <li
              key={text}
              className="flex items-center self-stretch gap-[11px]"
            >
              <Tag bg={TONES[tone].bg} className="shrink-0">
                {TONES[tone].label}
              </Tag>
              <p className="text-body2 font-medium text-gray-800 leading-[1.5] tracking-tight-1">
                {text}
              </p>
            </li>
          ))}
        </ul>
      )}

      {card.amount && (
        <div className="w-full flex flex-col gap-[8px]">
          <p className="text-[28px] font-bold text-gray-800 leading-[normal]">
            {card.amount}
          </p>
          {card.formula && (
            <Muted className="self-strech">{card.formula}</Muted>
          )}
        </div>
      )}

      {card.lead && (
        <p className="text-body1 font-medium text-gray-800 leading-[1.5] tracking-tight-1">
          {card.lead}
        </p>
      )}

      {card.lines && <Paragraphs items={card.lines} />}

      {card.tag && (
        <Tag bg="bg-blue-50" text="text-blue-500">
          {card.tag}
        </Tag>
      )}

      {card.footnotes && <Paragraphs items={card.footnotes} />}
    </Card>
  );
}
