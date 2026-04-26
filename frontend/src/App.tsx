import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Imports
import Login from './pages/auth/Login';
import VerifyEmail from './pages/auth/VerifyEmail';
import PasswordStep2 from './pages/auth/PasswordStep2';
import PasswordStep3 from './pages/auth/PasswordStep3';
import PasswordStep4 from './pages/auth/PasswordStep4';

// Dashboard Imports
import Dashboard from './pages/dashboard/Dashboard';
import AIAnalysis from './pages/dashboard/AIAnalysis';
import AnalysisResults from './pages/dashboard/AnalysisResults';

// Fortune Imports
import Management from './pages/fortune/Management';
import Storage from './pages/fortune/Storage';
import Details from './pages/fortune/Details';
import WinningItems from './pages/fortune/WinningItems';
import SavedNumbers from './pages/saved/SavedNumbers';
import LuckyHistory from './pages/more/LuckyHistory';
import LottoStore from './pages/more/LottoStore';
import Statistics from './pages/more/Statistics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="verify" element={<VerifyEmail />} />
        <Route path="password/step2" element={<PasswordStep2 />} />
        <Route path="password/step3" element={<PasswordStep3 />} />
        <Route path="password/step4" element={<PasswordStep4 />} />
      </Route>
      <Route path="/dashboard">
        <Route index element={<Dashboard />} />
        <Route path="analysis" element={<AIAnalysis />} />
        <Route path="results" element={<AnalysisResults />} />
      </Route>
      <Route path="/fortune">
        <Route index element={<Management />} />
        <Route path="storage" element={<Storage />} />
        <Route path="details" element={<Details />} />
        <Route path="winning" element={<WinningItems />} />
      </Route>
      <Route path="/saved" element={<SavedNumbers />} />
      <Route path="/lucky-history" element={<LuckyHistory />} />
      <Route path="/lotto-store" element={<LottoStore />} />
      <Route path="/statistics" element={<Statistics />} />
    </Routes>
  );
}

export default App;
