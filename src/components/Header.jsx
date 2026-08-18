import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";

export default function Header({ title, onBack }) {
  const navigate = useNavigate();

  return (
    <header className="relative h-[58px] shrink-0 flex items-center justify-center bg-white">
      <button
        type="button"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="뒤로 가기"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent"
      >
        <ChevronLeftIcon className="block text-black" />
      </button>
      {title && (
        <p className="absolute bottom-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap text-title text-black">
          {title}
        </p>
      )}
    </header>
  );
}
