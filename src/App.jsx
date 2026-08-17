import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ConsultSetup from "./pages/ConsultSetup";
import Reports from "./pages/Reports";
import BuyOrNot from "./pages/BuyOrNot";
import Consult from "./pages/Consult";
import Report from "./pages/Report";
import ReasonSurvey from "./pages/ReasonSurvey";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-gray-100 flex items-center justify-center">
        <div className="w-[393px] max-w-full h-dvh bg-white relative overflow-hidden">
          <div className="h-full">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/consult/setup" element={<ConsultSetup />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/buyornot" element={<BuyOrNot />} />
              <Route path="/consult" element={<Consult />} />
              <Route path="/report" element={<Report />} />
              <Route path="/report/reason/:choice" element={<ReasonSurvey />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
