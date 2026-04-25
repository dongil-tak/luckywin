import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

export default function AIAnalysis() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      navigate('/dashboard/results', { state: { selectedNumbers: [] } });
    }, 2000);
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-surface/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제{lottoDB[0].round + 1}회차</span>
        </div>
      </header>

      <main className="pt-24 px-6 space-y-8 max-w-md mx-auto">
        {/* Mode Selector Segmented Control */}
        <div className="bg-surface-container-low p-1.5 rounded-full flex items-center">
          <Link to="/dashboard" className="flex-1 py-2.5 rounded-full text-sm font-semibold text-center text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95 duration-200 cursor-pointer">수동 분석</Link>
          <button className="flex-1 py-2.5 rounded-full text-sm font-bold bg-surface-container-lowest text-primary shadow-sm ring-1 ring-black/5">AI 자동</button>
        </div>

        {/* AI Analysis Module (The Black Box) */}
        <section className="relative space-y-6">
          <div className="bg-surface-container-lowest rounded-lg p-8 shadow-[0_-4px_40px_rgba(27,28,25,0.02)] relative overflow-hidden">
            {/* Frequency Heatmap Background Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#735c00 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-1 block">신경망 엔진 상태</span>
                <h2 className="text-2xl font-headline font-extrabold tracking-tight">AI 분석 엔진</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary ai-pulse"></span>
                <span className="text-xs font-semibold text-primary">활성</span>
              </div>
            </div>

            {/* Radar Chart Visualizer */}
            <div className="relative flex justify-center items-center py-10">
              <svg className="w-full max-w-[240px] drop-shadow-xl" viewBox="0 0 200 200">
                {/* Background Circles */}
                <circle className="text-outline-variant radar-line" cx="100" cy="100" fill="none" r="90" stroke="currentColor" strokeWidth="1"></circle>
                <circle className="text-outline-variant radar-line" cx="100" cy="100" fill="none" r="60" stroke="currentColor" strokeWidth="1"></circle>
                <circle className="text-outline-variant radar-line" cx="100" cy="100" fill="none" r="30" stroke="currentColor" strokeWidth="1"></circle>
                
                {/* Radar Lines */}
                <line className="text-outline-variant radar-line" stroke="currentColor" strokeWidth="1" x1="100" x2="100" y1="10" y2="190"></line>
                <line className="text-outline-variant radar-line" stroke="currentColor" strokeWidth="1" x1="10" x2="190" y1="100" y2="100"></line>
                
                {/* Data Polygon */}
                <polygon fill="url(#goldGradient)" fillOpacity="0.2" points="100,40 160,80 140,150 60,150 40,80" stroke="#735c00" strokeWidth="2"></polygon>
                
                {/* Data Points */}
                <circle cx="100" cy="40" fill="#735c00" r="4"></circle>
                <circle cx="160" cy="80" fill="#735c00" r="4"></circle>
                <circle cx="140" cy="150" fill="#d4af37" r="4"></circle>
                <circle cx="60" cy="150" fill="#d4af37" r="4"></circle>
                <circle cx="40" cy="80" fill="#735c00" r="4"></circle>
                <defs>
                  <linearGradient id="goldGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#735c00", stopOpacity: 1 }}></stop>
                    <stop offset="100%" style={{ stopColor: "#d4af37", stopOpacity: 1 }}></stop>
                  </linearGradient>
                </defs>
              </svg>
              {/* Central AI Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-white shadow-lg ai-pulse ring-8 ring-white/50">
                  <span className="material-symbols-outlined text-3xl" data-icon="psychology" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
              </div>
            </div>

            {/* Labels around radar */}
            <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span className="text-[11px] font-medium text-on-surface-variant">추천 번호 (강세)</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-container"></div>
                <span className="text-[11px] font-medium text-on-surface-variant">기피 번호 (약세)</span>
              </div>
            </div>
          </div>

          {/* AI Insight Cards */}
          <div className="space-y-4">
            <div className="bg-surface-container-low rounded-lg p-5 flex items-center gap-4 border-l-4 border-primary">
              <div className="w-10 h-10 min-w-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl" data-icon="search_insights">search_insights</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">10년치 패턴 분석 중...</p>
                <p className="text-xs text-on-surface-variant">과거 520개 회차의 상관관계를 계산하고 있습니다.</p>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-5 flex items-center gap-4 border-l-4 border-transparent">
              <div className="w-10 h-10 min-w-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl" data-icon="auto_awesome">auto_awesome</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">최적의 확률 발견</p>
                <p className="text-xs text-on-surface-variant">최근 미출현 번호와 이월수의 균형을 맞췄습니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Google Adsense Banner Placeholder */}
        <section className="flex flex-col items-center space-y-2">
          <span className="text-[9px] font-bold text-outline uppercase tracking-widest opacity-50">광고</span>
          <div className="w-full h-[50px] bg-surface-container-high border border-outline-variant rounded flex items-center justify-center overflow-hidden">
            <p className="text-xs font-medium text-on-surface-variant/40 italic">광고 배너 영역 (320x50)</p>
          </div>
        </section>

        {/* Dynamic Feedback Text */}
        <div className="text-center py-4">
          <p className="text-sm font-medium text-primary tracking-wide flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg animate-spin" data-icon="progress_activity" style={{ animationDuration: "3s" }}>progress_activity</span>
            AI 엔진 가동 중
          </p>
        </div>
      </main>

      {/* Floating Action Button Area */}
      <div className="fixed bottom-28 left-0 w-full px-6 z-40">
        <button onClick={handleGenerate} className="w-full gold-gradient text-white font-headline font-extrabold text-lg py-5 rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-transform">
          <span className="material-symbols-outlined" data-icon="magic_button" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
          5개 조합 생성하기
        </button>
      </div>

      <BottomNav />

      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-headline font-bold text-on-surface">AI가 번호를 조합 중입니다...</h2>
          <p className="text-sm text-on-surface-variant mt-2">최적의 패턴을 분석하고 있습니다</p>
        </div>
      )}
    </div>
  );
}
