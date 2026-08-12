import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Consult from './pages/Consult'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-[393px] h-[852px] bg-white relative overflow-hidden">
          <div className="h-full">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/consult" element={<Consult />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
