import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import CardList from "../components/report/CardList";
import GaugeChart from "../components/report/GaugeChart";
import ReportActions from "../components/report/ReportActions";
import Verdict from "../components/report/Verdict";
import { REPORT_THEME } from "../constants/reportTheme";
import { REPORT_MOCK } from "../mocks/report";

export default function Report() {
  const [searchParams] = useSearchParams();

  // TODO: 분석 API 응답으로 교체 (쿼리스트링은 개발용 미리보기 전용)
  // 실제 판정(type)은 서버가 내려준 값으로 교체 예정
  const report = REPORT_MOCK[searchParams.get("type")] ?? REPORT_MOCK.recommend;
  const theme = REPORT_THEME[report.type];

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
      <div className="min-h-full" style={{ background: theme.gradient }}>
        <Header title="상담 결과" />

        <div className="flex flex-col items-center px-6 pb-10">
          <GaugeChart value={report.score} className="mt-20" />
          <Verdict title={theme.title} subtitle={theme.subtitle} />
          <CardList cards={report.cards} />
          <ReportActions actions={theme.actions} saving={report.saving} />
        </div>
      </div>
    </div>
  );
}
