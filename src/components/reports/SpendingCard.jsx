import beautyImage from "../../assets/reports/beauty.png";
import foodImage from "../../assets/reports/food.png";
import hobbyImage from "../../assets/reports/hobby.png";
import placeholderImage from "../../assets/reports/product-placeholder.png";
import { PENDING_TIER, tierOf } from "../../constants/cardTier";
import { cardKindOf } from "../../utils/history";

const CATEGORY_IMAGES = {
  뷰티: beautyImage,
  식품: foodImage,
  "취미·운동": hobbyImage,
};

const CATEGORY_LABELS = {
  "취미·운동": "취미",
};

const SIZES = {
  sm: {
    card: "h-[152px] w-[104px] rounded-lg",
    product: "size-[52px]",
    photo: "rounded-[6px]",
    topShadow: "shadow-[inset_0_0_2px_rgba(0,0,0,0.24)]",
    body: "gap-1",
    grade: "w-20 px-3 text-bodyb tracking-[-0.14px]",
    price: "text-[11px] leading-[1.4] tracking-[-0.22px]",
    unit: "",
  },
  lg: {
    card: "h-[304px] w-[208px] rounded-2xl",
    product: "size-[104px]",
    photo: "rounded-[12px]",
    topShadow: "shadow-[inset_0_0_4px_rgba(0,0,0,0.24)]",
    body: "gap-2",
    grade: "w-40 px-6 text-[28px] leading-[1.5] tracking-[-0.28px]",
    price: "text-[28px] leading-[1.5] tracking-[-1.12px]",
    unit: "text-bodyb tracking-[-0.14px]",
  },
};

export default function SpendingCard({ record, size = "sm", transitionName }) {
  const style = SIZES[size];

  if (!record) {
    return (
      <div
        aria-hidden
        className={`border-2 border-dashed border-gray-100 bg-gray-50 ${style.card}`}
      />
    );
  }

  const price = record.price ?? 0;
  const pending = cardKindOf(record) === "pending";
  const tier = pending ? PENDING_TIER : tierOf(price);
  const category = record.category ?? "카테고리";
  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  // 쇼핑몰 사진은 흰 배경째로 들어온다. 지우려 하면 상품까지 비쳐서,
  // 대신 모서리를 둥글리고 살짝 띄워 사진 타일처럼 보이게 한다.
  // 카테고리 일러스트는 배경이 투명해 이 처리가 필요 없다.
  const shopImage = record.image;
  const image = shopImage || CATEGORY_IMAGES[category] || placeholderImage;

  return (
    <article
      className={`flex flex-col overflow-hidden drop-shadow-[0_0_2px_rgba(0,0,0,0.12)] ${style.card}`}
      style={
        transitionName ? { viewTransitionName: transitionName } : undefined
      }
    >
      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden ${tier.color}`}
      >
        {tier.sunburst && (
          <img
            src={tier.sunburst}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <img
          src={image}
          alt=""
          className={`relative object-contain ${style.product} ${
            shopImage
              ? `bg-white ${style.photo} shadow-[0_1px_4px_rgba(0,0,0,0.16)]`
              : ""
          }`}
        />
        <span
          className={`pointer-events-none absolute inset-0 ${style.topShadow}`}
        />
      </div>

      <div
        className={`relative flex flex-1 flex-col items-center justify-center ${style.body} ${tier.color}`}
      >
        <span
          className={`truncate rounded-full bg-black/25 text-center text-white ${style.grade}`}
        >
          {categoryLabel}
        </span>
        <strong className={`text-gray-800 ${style.price}`}>
          {price.toLocaleString()}
          <span className={style.unit}>원</span>
        </strong>
        <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_4px_rgba(0,0,0,0.24)]" />
      </div>
    </article>
  );
}
