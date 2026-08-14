// 게이지 아래 판정 문구
export default function Verdict({ title, subtitle }) {
  return (
    <div className="mt-[46px] mb-9 flex flex-col gap-2">
      <p className="text-center text-price font-bold text-gray-800 leading-[1.4] tracking-tight-2">
        {title}
      </p>
      <p className="text-center text-body2 font-medium text-gray-600 leading-[1.5] tracking-tight-1">
        {subtitle}
      </p>
    </div>
  );
}
