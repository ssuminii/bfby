import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Consult from './pages/Consult'
import Report from './pages/Report'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-gray-100 flex items-center justify-center">
        <div className="w-[393px] max-w-full h-dvh bg-white relative overflow-hidden">
          <div className="h-full">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/consult" element={<Consult />} />
              <Route path="/report" element={<Report />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
