import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { EnergyProvider } from './context/EnergyContext'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import DailyCheckIn from './pages/DailyCheckIn'
import Train from './pages/Train'
import Community from './pages/Community'
import Progress from './pages/Progress'
import Journal from './pages/Journal'
import Goals from './pages/Goals'
import RestroomFinder from './pages/RestroomFinder'
import NewsHub from './pages/NewsHub'
import MemoryMatch from './pages/games/MemoryMatch'
import TapTarget from './pages/games/TapTarget'
import DiscoverySurvey from './pages/DiscoverySurvey'
import AuthConfirm from './pages/AuthConfirm'
import NotFound from './pages/not-found'
// New Imports for Privacy and Safety
import About from './pages/About' 
import EmergencyResources from './components/EmergencyResources'

export default function App() {
  return (
    <BrowserRouter>
      <EnergyProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/checkin" element={<DailyCheckIn />} />
          <Route path="/train" element={<Train />} />
          <Route path="/community" element={<Community />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/restroom" element={<RestroomFinder />} />
          <Route path="/news" element={<NewsHub />} />
          <Route path="/games/memory-match" element={<MemoryMatch />} />
          <Route path="/games/tap-target" element={<TapTarget />} />
          <Route path="/survey" element={<DiscoverySurvey />} />
          <Route path="/auth/confirm" element={<AuthConfirm />} />
          
          {/* Updated Routes for Legal & Safety */}
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<EmergencyResources />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </EnergyProvider>
    </BrowserRouter>
  )
}
