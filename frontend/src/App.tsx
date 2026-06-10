import { Routes, Route, Navigate } from 'react-router-dom';

// Dashboard Imports
import Dashboard from './pages/dashboard/Dashboard';
import AIAnalysis from './pages/dashboard/AIAnalysis';
import AnalysisResults from './pages/dashboard/AnalysisResults';

// Fortune Imports
import Management from './pages/fortune/Management';
import SavedNumbers from './pages/saved/SavedNumbers';
import LuckyHistory from './pages/more/LuckyHistory';
import LottoStore from './pages/more/LottoStore';
import Statistics from './pages/more/Statistics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard">
        <Route index element={<Dashboard />} />
        <Route path="analysis" element={<AIAnalysis />} />
        <Route path="results" element={<AnalysisResults />} />
      </Route>
      <Route path="/fortune" element={<Management />} />
      <Route path="/saved" element={<SavedNumbers />} />
      <Route path="/lucky-history" element={<LuckyHistory />} />
      <Route path="/lotto-store" element={<LottoStore />} />
      <Route path="/statistics" element={<Statistics />} />
    </Routes>
  );
}

export default App;
