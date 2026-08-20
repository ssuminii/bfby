import { useNavigate } from "react-router-dom";
import Button from "../Button";
import Confetti from "../Confetti";

// 한 줄씩 차례로 올라와 문장이 완성되는 느낌을 준다
const LINES = ["고민하던 상품을", "안 사기로 했어요."];

export default function SavingCelebration() {
  const navigate = useNavigate();

  return (
    <div className="relative h-full overflow-hidden bg-white">
      <Confetti />

      <div className="absolute inset-x-0 top-[calc(50%-30px)] text-center text-title text-black">
        {LINES.map((line, i) => (
          <p
            key={line}
            className="animate-rise-in"
            style={{ animationDelay: `${120 + i * 100}ms` }}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 w-[345px] -translate-x-1/2">
        <Button variant="dark" onClick={() => navigate("/reports")}>
          닫기
        </Button>
      </div>
    </div>
  );
}
