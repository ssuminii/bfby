import { useNavigate } from "react-router-dom";
import Button from "../Button";

/**
 * 더 고민할게요를 고른 뒤 보여주는 화면.
 *
 * 카드 발급 여부가 아직 정해지지 않아서, 카드를 얻었다는 식으로 말하지 않는다.
 * 카드 자리는 물음표로 비워 두고 살래말래 탭에 보관했다는 사실만 알린다.
 */
export default function HoldSaved() {
  const navigate = useNavigate();

  return (
    <div className="relative h-full overflow-hidden bg-white">
      {/* left-1/2로 두면 절대 배치 요소가 화면 절반 폭 안에서만 줄바꿈을 계산해
          문구가 접힌다. 전체 폭을 주고 가운데 정렬한다 */}
      <div className="absolute inset-x-0 top-[calc(50%-62px)] flex -translate-y-1/2 flex-col items-center gap-10">
        <p className="whitespace-pre-line text-center text-title text-black">
          {"살래말래 탭에\n저장해 뒀어요."}
        </p>

        <div className="flex flex-col items-center gap-10">
          <div className="flex h-[152px] w-[104px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-report-pending-gradient">
            <span className="text-display text-gray-200">?</span>
          </div>
          <p className="text-center text-body1 text-gray-600">
            언제든 다시 열어서 결정할 수 있어요.
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 w-[345px] -translate-x-1/2">
        {/* 이미 결정을 미루기로 한 참이라 다시 묻지 않고 닫기만 둔다 */}
        <Button variant="dark" onClick={() => navigate("/buyornot")}>
          닫기
        </Button>
      </div>
    </div>
  );
}
