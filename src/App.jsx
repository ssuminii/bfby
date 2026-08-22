import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ConsultSetup from "./pages/ConsultSetup";
import Reports from "./pages/Reports";
import BuyOrNot from "./pages/BuyOrNot";
import BuyOrNotDetail from "./pages/BuyOrNotDetail";
import Consult from "./pages/Consult";
import Report from "./pages/Report";
import CardAcquired from "./pages/CardAcquired";
import ReasonSurvey from "./pages/ReasonSurvey";
import HoldDecision from "./pages/HoldDecision";
import { preloadCardImages } from "./utils/preloadCardImages";

function App() {
  // 첫 화면을 그린 뒤에 카드 무늬를 미리 받아 둔다
  useEffect(preloadCardImages, []);

  // useTransitions를 끄지 않으면 라우터가 위치 변경을 React.startTransition으로 감싼다.
  // transition 업데이트는 flushSync로 동기화되지 않아, withViewTransition의 콜백이
  // 끝날 때까지 DOM이 그대로다. 전환 전후 스냅샷이 같아지면 브라우저는 바뀐 게 없다고
  // 보고 전환을 통째로 건너뛴다. 카드가 도는 애니메이션이 여기에 달려 있다.
  return (
    <BrowserRouter useTransitions={false}>
      <div className="min-h-dvh bg-gray-100 flex items-center justify-center">
        <div
          id="app-frame"
          className="w-[393px] max-w-full h-dvh bg-white relative overflow-hidden"
        >
          <div className="h-full">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/consult/setup" element={<ConsultSetup />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/buyornot" element={<BuyOrNot />} />
              <Route path="/buyornot/detail" element={<BuyOrNotDetail />} />
              <Route path="/buyornot/decide" element={<HoldDecision />} />
              <Route path="/consult" element={<Consult />} />
              <Route path="/report" element={<Report />} />
              <Route path="/report/card" element={<CardAcquired />} />
              <Route path="/report/reason/:choice" element={<ReasonSurvey />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
