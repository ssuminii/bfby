// 설문 상단에 붙는 상품 정보
export default function ProductSummary({ name, price, image }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3.5">
        {image ? (
          <img
            src={image}
            alt=""
            className="w-13 h-13 shrink-0 rounded-lg bg-white object-contain"
          />
        ) : (
          <div className="w-13 h-13 shrink-0 rounded-lg bg-gray-100" />
        )}
        <div className="min-w-0 flex flex-col gap-1">
          <p className="truncate text-head font-bold text-gray-800 tracking-tight-1">
            {name}
          </p>
          <p className="text-body1 font-semibold text-gray-600 tracking-tight-1">
            {price.toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="mt-6 h-px bg-gray-100" />
    </div>
  );
}
