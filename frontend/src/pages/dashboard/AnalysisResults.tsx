import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';
import EmailInputDialog from '../../components/EmailInputDialog';


const getNumberColorClass = (n: number) => {
  if (n <= 10) return 'bg-amber-400 text-on-primary-fixed';
  if (n <= 20) return 'bg-sky-500 text-white';
  if (n <= 30) return 'bg-rose-500 text-white';
  if (n <= 40) return 'bg-zinc-400 text-white';
  return 'bg-emerald-500 text-white';
};

// 전체 회차 빈도 + 최근 100회차 2배 가중치
const numberWeights = (() => {
  const all = new Array(46).fill(0);
  const recent = new Array(46).fill(0);
  lottoDB.forEach(item => item.numbers.forEach(n => all[n]++));
  lottoDB.slice(0, 100).forEach(item => item.numbers.forEach(n => recent[n]++));
  return all.map((w, i) => w + recent[i] * 2);
})();

const weightedPick = (exclude: Set<number>): number => {
  let total = 0;
  for (let n = 1; n <= 45; n++) {
    if (!exclude.has(n)) total += numberWeights[n];
  }
  let rand = Math.random() * total;
  for (let n = 1; n <= 45; n++) {
    if (!exclude.has(n)) {
      rand -= numberWeights[n];
      if (rand <= 0) return n;
    }
  }
  return 45;
};

const generateCombination = (fixedNumbers: number[]): number[] => {
  const nums = new Set<number>(fixedNumbers);
  while (nums.size < 6) {
    nums.add(weightedPick(nums));
  }
  return Array.from(nums).sort((a, b) => a - b);
};

export default function AnalysisResults() {
  const location = useLocation();
  const rawFixedNumbers = location.state?.selectedNumbers;
  const fixedNumbers = useMemo(() => rawFixedNumbers || [], [rawFixedNumbers]);
  const [combinations, setCombinations] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    const email = localStorage.getItem('verified_email');
    if (email) {
      handleSaveConfirm(email);
    } else {
      setIsEmailModalOpen(true);
    }
  };

  const handleSaveConfirm = (email: string) => {
    const entry = {
      email,
      savedAt: new Date().toISOString(),
      combinations,
      type: 'ai'
    };
    const existing = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
    existing.unshift(entry);
    localStorage.setItem('savedNumbers', JSON.stringify(existing));
    
    // 번호저장 후 결과 페이지를 초기화
    localStorage.removeItem('ai_proposed');
    setCombinations([]);
    setShowGenerateButton(true);

    navigate('/saved');
  };

  const handleCopy = () => {
    if (combinations.length === 0) return;
    const text = combinations
      .map((comb, idx) => {
        const letter = String.fromCharCode(65 + idx);
        return `조합 ${letter}: ${comb.map(n => n.toString().padStart(2, '0')).join(', ')}`;
      })
      .join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('행운 번호가 클립보드에 복사되었습니다!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        alert('번호 복사에 실패했습니다.');
      });
  };

  const checkAndLoadCache = useCallback(() => {
    const cachedStr = localStorage.getItem('ai_proposed');
    if (cachedStr) {
      try {
        const data = JSON.parse(cachedStr);
        const deadline = new Date(data.deadline);
        if (new Date() < deadline) {
          setCombinations(data.combinations);
          setShowGenerateButton(false);
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  const generateAndSave = useCallback(() => {
    setIsLoading(true);
    setShowGenerateButton(false);
    
    setTimeout(() => {
      const newCombs = Array.from({ length: 5 }, () => generateCombination(fixedNumbers));
      setCombinations(newCombs);
      
      const now = new Date();
      let daysToSat = 6 - now.getDay();
      if (now.getDay() === 6 && now.getHours() >= 23) {
        daysToSat = 7;
      }
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + daysToSat);
      deadline.setHours(23, 0, 0, 0);
      
      localStorage.setItem('ai_proposed', JSON.stringify({
        combinations: newCombs,
        deadline: deadline.toISOString()
      }));
      setIsLoading(false);
    }, 1500);
  }, [fixedNumbers]);

  useEffect(() => {
    // If routing directly sets state or it's forced manually, skip cache check
    if (location.state && location.state.selectedNumbers && location.state.selectedNumbers.length > 0) {
      const timer = setTimeout(() => {
        generateAndSave();
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const hasValidCache = checkAndLoadCache();
      if (!hasValidCache) {
        setShowGenerateButton(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [location.state, generateAndSave, checkAndLoadCache]);

  return (
    <div className="bg-surface font-label text-on-surface antialiased min-h-screen pb-28">
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-headline font-bold text-on-surface">번호 조합을 만들고 있습니다.</h2>
            <p className="text-sm text-on-surface-variant">스마트 알고리즘이 작동 중입니다...</p>
          </div>
          <div className="w-64 bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-2/3"></div>
          </div>
        </div>
      )}
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 flex items-center justify-between px-6 bg-surface/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black font-headline text-stone-900 dark:text-stone-50 tracking-tighter">Lucky Win</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제{lottoDB[0].round + 1}회차</span>
        </div>
      </header>

      <main className="pt-20 px-6 max-w-2xl mx-auto">

{/* Conditional View: Empty State vs Result Canvas */}
        {showGenerateButton ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">psychology</span>
            </div>
            <h3 className="text-2xl font-headline font-bold mb-10">Lucky 주인공이 되어보세요.</h3>
            <button
              onClick={generateAndSave}
              className="px-10 py-4 text-lg rounded-full gold-gradient text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" data-icon="magic_button">magic_button</span> AI Lucky lotto 번호 받기
            </button>
            <p className="text-xs text-on-surface-variant mt-3">과거 당첨 데이터의 확률 밀도를 기반으로 생성된 조합입니다.</p>
            <p className="text-xs text-on-surface-variant mt-1">제공된 행운의 번호는 당첨을 보장하지 않습니다. 책임감있게 즐겨주세요.</p>
          </div>
        ) : (
          <>
            {/* Result Canvas */}
            <div className="space-y-6">
              {combinations.map((comb, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C...
                const rowNode = (
                  <div key={`row-${idx}`} className="paper-texture p-8 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/10">
                    <div className="flex flex-col items-start w-full md:w-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-headline font-bold text-primary tracking-widest text-sm uppercase">조합 {letter}</span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">auto_awesome</span>
                          AI 분석 추천
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/60 font-medium">조합 ID: 99421-{letter}</span>
                    </div>
                    <div className="flex gap-2 sm:gap-4 items-center justify-between w-full md:w-auto">
                      {comb.map((n, i) => (
                        <div key={i} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-bold text-lg shadow-inner ${getNumberColorClass(n)} relative overflow-hidden`}>
                          <div className="absolute inset-0 glass-shimmer"></div>{n.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                );

                return rowNode;
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-12 space-y-4 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleSave} className="w-full py-4 rounded-full bg-surface-container-highest text-on-surface font-bold hover:bg-surface-variant transition-colors active:scale-95 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" data-icon="bookmark">bookmark</span> 번호 저장
                </button>
                <button onClick={handleCopy} className="w-full py-4 rounded-full bg-surface-container-highest text-on-surface font-bold hover:bg-surface-variant transition-colors active:scale-95 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined" data-icon="content_copy">content_copy</span> 번호 복사
                </button>
              </div>
              <button onClick={generateAndSave} className="w-full py-4 rounded-full gold-gradient text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined" data-icon="refresh">refresh</span> 번호 다시 받기
              </button>
            </div>
          </>
        )}

      </main>

      <BottomNav />

      <EmailInputDialog
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onConfirm={handleSaveConfirm}
      />
    </div>
  );
}
