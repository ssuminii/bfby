import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";

export default function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="relative h-[58px] flex items-center justify-center bg-white">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent"
      >
        <ChevronLeftIcon className="block text-black" />
      </button>
      {title && (
        <p className="text-title font-bold text-gray-800 leading-[30px] tracking-tight-2">
          {title}
        </p>
      )}
    </header>
  );
}
