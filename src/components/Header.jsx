import { useNavigate } from "react-router-dom";

export default function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="relative h-14 flex items-center justify-center bg-white border-b border-gray-100">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="뒤로 가기"
        className="absolute left-6 bg-transparent p-0"
      >
        <svg
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 1L1 9L9 17"
            stroke="var(--color-gray-800)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1 className="text-title font-bold text-gray-800 leading-[1.5] tracking-tight-2">
        {title}
      </h1>
    </header>
  );
}
