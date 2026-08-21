import { Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CardList from "../components/report/CardList";
import GaugeChart from "../components/report/GaugeChart";
import { markOf } from "../constants/resultMark";
import ReportActions from "../components/report/ReportActions";
import Verdict from "../components/report/Verdict";
import { REPORT_THEME } from "../constants/reportTheme";
import { buildReport } from "../utils/buildReport";
import { MOCK_HISTORY } from "../mocks/history";
import { loadHistory } from "../utils/history";

export default function Report() {
  const { state } = useLocation();

  // 상담을 거치지 않고 들어온 경우 (새로고침·직접 접근) 보여줄 판정이 없다
  if (!state?.judgment) return <Navigate to="/" replace />;

  // 이번 결정은 버튼을 눌러야 저장되므로, 여기서 읽으면 지난 기록만 들어온다
  const report = buildReport(
    state.judgment,
    state.product,
    // 보관함과 같은 기록을 봐야 한다. 여기만 실제 기록만 쓰면 지난 선택과 견줄 수 없다.
    // TODO: 기록이 쌓이면 MOCK_HISTORY 제거
    [...MOCK_HISTORY, ...loadHistory()],
    state.category,
  );
  const theme = REPORT_THEME[report.type];
  const usage = report.cards.find((card) =>
    card.title.startsWith("한 번 사용할 때"),
  );
  // 나중에 내 기록 카드가 "그때 이렇게 답하셨는데" 라고 말하려면 이 답변이 필요하다
  const usageAnswer = state.judgment.signals?.find(
    (signal) => signal.axis === "얼마나 쓸까",
  )?.answer;
  const signalAnswers = (state.judgment.signals ?? [])
    .map((s) => s.answer)
    .filter(Boolean);
  const reasonItems = report.cards[0]?.items
  const tryFirst = state.judgment.tryFirst

  return (
    <div className="flex h-full flex-col bg-white">
      <Header title="상담 결과" />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full" style={{ background: theme.gradient }}>
          {/* 게이지·판정 / 카드 / 버튼을 같은 간격으로 떨어뜨린다 */}
          <div className="flex flex-col gap-9 px-6 pb-10 pt-14">
            <div className="flex flex-col items-center gap-[46px]">
              {/* 게이지의 파란 구간(70~100점)은 오른쪽 위에 있다.
                  그 위에 표정을 겹쳐 올린다. 위치는 left/top으로 조절하면 된다. */}
              <div className="relative">
                <GaugeChart value={report.score} />
                <img
                  src={markOf(report.type)}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute left-4/5 top-[68%] -translate-y-1/2"
                />
              </div>
              <Verdict
                title={theme.title}
                subtitle={report.subtitle ?? theme.subtitle}
              />
            </div>

            <CardList cards={report.cards} />

            <ReportActions
              actions={theme.actions}
              saving={report.saving}
              product={state.product}
              category={state.category}
              type={report.type}
              reasonItems={reasonItems}
              tryFirst={tryFirst}
              usageAnswer={usageAnswer}
              signalAnswers={signalAnswers}
              kind={state.judgment.kind}
              note={
                usage &&
                `한 번 사용할 때마다 ${usage.amount} 정도의 비용이에요.`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
