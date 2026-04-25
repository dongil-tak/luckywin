import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

export default function Dashboard() {
  const navigate = useNavigate();
  // Load persisted numbers from localStorage on first render
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fixedNumbers') || '[]');
    } catch { return []; }
  });
  const [saveNumbers, setSaveNumbers] = useState<boolean>(() => {
    return localStorage.getItem('saveNumbersEnabled') === 'true';
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    // Persist if save is enabled, clear otherwise
    if (saveNumbers) {
      localStorage.setItem('fixedNumbers', JSON.stringify(selectedNumbers));
      localStorage.setItem('saveNumbersEnabled', 'true');
    } else {
      localStorage.removeItem('fixedNumbers');
      localStorage.setItem('saveNumbersEnabled', 'false');
    }
    setIsGenerating(true);
    setTimeout(() => {
      navigate('/dashboard/results', { state: { selectedNumbers } });
    }, 2000);
  };

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < 5) {
        setSelectedNumbers([...selectedNumbers, num]);
      } else {
        alert("고정수는 최대 5개까지 선택할 수 있습니다.");
      }
    }
  };


  // Recent winning history (simulated)
  const recentDraws = [
    { round: 1150, date: '2026년 03월 29일', numbers: [7, 14, 22, 35, 41, 44], bonus: 3 },
    { round: 1149, date: '2026년 03월 22일', numbers: [2, 9, 18, 27, 36, 43], bonus: 11 },
    { round: 1148, date: '2026년 03월 15일', numbers: [5, 13, 21, 30, 38, 45], bonus: 7 },
    { round: 1147, date: '2026년 03월 08일', numbers: [1, 10, 19, 28, 37, 42], bonus: 24 },
    { round: 1146, date: '2026년 03월 01일', numbers: [4, 12, 20, 29, 33, 40], bonus: 15 },
  ];
  const [historyIdx, setHistoryIdx] = useState(0);
  const currentDraw = recentDraws[historyIdx];
  
  return (
    <div className="bg-background text-on-background font-label antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-surface/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm shadow-stone-200/50 dark:shadow-none z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <div className="flex items-center">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400 active:scale-95 duration-200 hover:opacity-80 transition-opacity cursor-pointer">1150회차</span>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        <section className="bg-surface-container-low rounded-lg p-4 relative overflow-hidden">
          {/* Round & Date */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setHistoryIdx(i => Math.min(i + 1, recentDraws.length - 1))}
              disabled={historyIdx === recentDraws.length - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-lowest disabled:opacity-30 hover:bg-surface-container-high active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-base text-on-surface">chevron_left</span>
            </button>
            <div className="text-center">
              <p className="text-sm font-bold text-primary uppercase tracking-widest">제{currentDraw.round}회차</p>
              <p className="text-sm text-on-surface-variant font-semibold mt-0.5">{currentDraw.date} 추첨</p>
            </div>
            <button
              onClick={() => setHistoryIdx(i => Math.max(i - 1, 0))}
              disabled={historyIdx === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-lowest disabled:opacity-30 hover:bg-surface-container-high active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-base text-on-surface">chevron_right</span>
            </button>
          </div>
          {/* Numbers */}
          <div className="flex gap-2 justify-center flex-wrap">
            {currentDraw.numbers.map((num) => (
              <span key={num} className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center font-bold text-primary border border-outline-variant/20 shadow-sm text-sm">{num}</span>
            ))}
            <span className="flex items-center text-on-surface-variant/40 text-xs font-bold mx-1">+</span>
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 shadow-sm text-sm">{currentDraw.bonus}</span>
          </div>
        </section>

        {/* Mode Toggle Section */}
        <section className="flex flex-col items-center gap-6">
          <div className="bg-surface-container-high p-1.5 rounded-full flex items-center w-full max-w-xs shadow-inner">
            <Link to="/dashboard/analysis" className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 text-on-surface-variant hover:bg-white/50 text-center">AI 자동</Link>
            <button className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-surface-container-lowest text-primary shadow-sm ring-1 ring-black/5">스마트 반자동</button>
          </div>
          <div className="text-center space-y-1 w-full">
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">고정수 선택</h2>
            <p className="text-sm text-on-surface-variant font-medium">분석을 위한 고정수를 최대 5개 선택하세요</p>
          </div>
        </section>

        {/* Number Selection Grid (1-45) */}
        <section className="bg-surface-container-low rounded-lg p-8">
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-4">
            {Array.from({ length: 45 }).map((_, i) => {
              const num = i + 1;
              const isSelected = selectedNumbers.includes(num);
              
              if (isSelected) {
                return (
                  <button key={num} onClick={() => toggleNumber(num)} className="w-full aspect-square rounded-full flex items-center justify-center text-lg font-extrabold gold-gradient text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform">{num}</button>
                );
              }

              return (
                <button key={num} onClick={() => toggleNumber(num)} className="w-full aspect-square rounded-full flex items-center justify-center text-lg font-extrabold bg-surface-container-lowest text-on-surface hover:bg-surface-container-high active:scale-90 transition-all">{num}</button>
              );
            })}
          </div>
        </section>

        {/* Save Checkbox - below number grid */}
        <label className="flex items-center gap-2 cursor-pointer py-2.5 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors select-none w-full">
          <input
            type="checkbox"
            checked={saveNumbers}
            onChange={e => {
              setSaveNumbers(e.target.checked);
              localStorage.setItem('saveNumbersEnabled', e.target.checked ? 'true' : 'false');
              if (!e.target.checked) localStorage.removeItem('fixedNumbers');
            }}
            className="w-4 h-4 accent-amber-600"
          />
          <span className="text-sm font-bold text-on-surface-variant">번호 저장</span>
          <span className="text-xs text-on-surface-variant/60">선택한 번호를 다음에도 유지합니다</span>
          <span className="material-symbols-outlined text-base text-amber-600 ml-auto" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
        </label>

        {/* Insights Bento Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-1 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10 shadow-sm">
            <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-tighter mb-2">홀짝 비율</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-headline font-black text-on-surface">3:3</span>
              <span className="text-xs text-primary font-bold pb-1 mb-1">안정</span>
            </div>
          </div>
          <div className="col-span-1 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10 shadow-sm">
            <p className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-tighter mb-2">당첨 확률</p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-headline font-black text-on-surface">84%</span>
              <span className="text-xs text-primary font-bold pb-1 mb-1">높음</span>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-6">
        <button onClick={handleGenerate} className="w-full gold-gradient text-white py-4 rounded-full font-headline font-extrabold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <span className="material-symbols-outlined" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          5개 조합 생성하기
        </button>
      </div>

      <BottomNav />

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-container/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary-container/20 blur-[100px] rounded-full"></div>
      </div>

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
