// 고민 설문에만 붙는 상단 상품 정보
export default function ProductSummary({ name, price }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3.5">
        {/* TODO: 상품 썸네일 이미지 연결 */}
        <div className="w-13 h-13 shrink-0 rounded-lg bg-gray-100" />
        <div className="min-w-0 flex flex-col gap-1">
          <p className="truncate text-body1 font-medium text-gray-800 tracking-tight-1">
            {name}
          </p>
          <p className="text-head font-bold text-gray-800 tracking-tight-1">
            {price.toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="mt-6 h-px bg-gray-100" />
    </div>
  );
}
