import { useNavigate } from "react-router-dom";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="block"
        >
          <path
            d="M12 19L5 12L12 5"
            stroke="black"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      {title && (
        <p className="text-title font-bold text-gray-800 leading-[30px] tracking-tight-2">
          {title}
        </p>
      )}
    </header>
  );
}
