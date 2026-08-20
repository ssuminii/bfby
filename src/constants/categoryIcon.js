import beautyIcon from "../assets/reports/beauty.png";
import clothingIcon from "../assets/reports/clothing.png";
import electronicsIcon from "../assets/reports/electronics.png";
import foodIcon from "../assets/reports/food.png";
import hobbyIcon from "../assets/reports/hobby.png";
import livingIcon from "../assets/reports/living.png";
import placeholderIcon from "../assets/reports/product-placeholder.png";

const CATEGORY_ICONS = {
  전자기기: electronicsIcon,
  의류: clothingIcon,
  뷰티: beautyIcon,
  생활용품: livingIcon,
  식품: foodIcon,
  "취미·운동": hobbyIcon,
};

export const iconOf = (category) => CATEGORY_ICONS[category] ?? placeholderIcon;

export const CATEGORY_ICON_LIST = Object.values(CATEGORY_ICONS);
