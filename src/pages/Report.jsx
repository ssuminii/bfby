import { Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CardList from "../components/report/CardList";
import GaugeChart from "../components/report/GaugeChart";
import ReportActions from "../components/report/ReportActions";
import Verdict from "../components/report/Verdict";
import { REPORT_THEME } from "../constants/reportTheme";
import { buildReport } from "../utils/buildReport";
import { loadHistory } from "../utils/history";

export default function Report() {
  const { state } = useLocation();

  // 상담을 거치지 않고 들어온 경우 (새로고침·직접 접근) 보여줄 판정이 없다
  if (!state?.judgment) return <Navigate to="/" replace />;

  // 이번 결정은 버튼을 눌러야 저장되므로, 여기서 읽으면 지난 기록만 들어온다
  const report = buildReport(
    state.judgment,
    state.product,
    loadHistory(),
    state.category,
  );
  const theme = REPORT_THEME[report.type];
  const usage = report.cards.find((card) =>
    card.title.startsWith("한 번 사용할 때"),
  );

  return (
    <div className="flex h-full flex-col bg-white">
      <Header title="상담 결과" />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full" style={{ background: theme.gradient }}>
          <div className="flex flex-col items-center px-6 pb-10">
            <GaugeChart value={report.score} className="mt-20" />
            <Verdict
              title={theme.title}
              subtitle={report.subtitle ?? theme.subtitle}
            />
            <CardList cards={report.cards} />
            <ReportActions
              actions={theme.actions}
              saving={report.saving}
              product={state.product}
              category={state.category}
              type={report.type}
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
