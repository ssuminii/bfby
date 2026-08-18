import Muted from "./Muted";

// 큰 금액 + 바로 아래 붙는 산출 근거
export default function Amount({ value, formula }) {
  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-display text-gray-800">{value}</p>
      {formula && <Muted>{formula}</Muted>}
    </div>
  );
}
