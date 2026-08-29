import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import EmailInputDialog from '../../components/EmailInputDialog';
import lottoDB from '../../data/lottoDB.json';

// 전체 회차 빈도 + 최근 100회차 2배 가중치
const numberWeights = (() => {
  const all = new Array(46).fill(0);
  const recent = new Array(46).fill(0);
  lottoDB.forEach((item: { numbers: number[] }) => item.numbers.forEach(n => all[n]++));
  lottoDB.slice(0, 100).forEach((item: { numbers: number[] }) => item.numbers.forEach(n => recent[n]++));
  return all.map((w, i) => w + recent[i] * 2);
})();

const getNumberColorClass = (n: number) => {
  if (n <= 10) return 'bg-[#facc15] text-[#713f12]';
  if (n <= 20) return 'bg-[#3b82f6] text-white';
  if (n <= 30) return 'bg-[#ef4444] text-white';
  if (n <= 40) return 'bg-[#a1a1aa] text-zinc-900';
  return 'bg-[#10b981] text-white';
};

const DRAFT_KEY = 'dashboard_draft_sets';

// 빈도 가중치 기반 6개 번호 생성 (fixed: 사용자가 이미 선택한 번호 → 반드시 포함)
const weightedPickWithFixed = (fixed: number[]): number[] => {
  const selected = new Set<number>(fixed);
  while (selected.size < 6) {
    let total = 0;
    for (let n = 1; n <= 45; n++) {
      if (!selected.has(n)) total += numberWeights[n];
    }
    let rand = Math.random() * total;
    for (let n = 1; n <= 45; n++) {
      if (!selected.has(n)) {
        rand -= numberWeights[n];
        if (rand <= 0) { selected.add(n); break; }
      }
    }
  }
  return Array.from(selected).sort((a, b) => a - b);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentSelection, setCurrentSelection] = useState<number[]>([]);
  const [savedSets, setSavedSets] = useState<{ numbers: number[]; isAi: boolean }[]>(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      return draft ? JSON.parse(draft) : [];
    } catch {
      return [];
    }
  });
  const [aiSets, setAiSets] = useState<number[][]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isSavingAI, setIsSavingAI] = useState(false);
  const [isSavingSingle, setIsSavingSingle] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    if (savedSets.length > 0) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(savedSets));
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [savedSets]);

  const toggleNumber = (num: number) => {
    if (savedSets.length >= 5) return;
    if (currentSelection.includes(num)) {
      setCurrentSelection(currentSelection.filter(n => n !== num));
    } else {
      if (currentSelection.length < 6) {
        setCurrentSelection([...currentSelection, num].sort((a, b) => a - b));
      }
    }
  };

  // AI 반자동: 선택번호를 고정 시드로 5세트 생성 (2.5초 로딩)
  const handleAIGenerate = () => {
    const newSets = Array.from({ length: 5 }, () => weightedPickWithFixed(currentSelection));
    setIsAILoading(true);
    setTimeout(() => {
      setAiSets(newSets);
      setIsAILoading(false);
    }, 2500);
  };

  const handleDeleteSet = (index: number) => {
    setSavedSets(savedSets.filter((_, i) => i !== index));
  };

  // 수동 세트 저장 트리거
  const handleFinalSave = () => {
    if (savedSets.length === 0) return;
    const email = localStorage.getItem('verified_email');
    if (email) { doSaveManual(email); }
    else { setIsSavingAI(false); setIsEmailModalOpen(true); }
  };

  // AI 세트 저장 트리거
  const handleSaveAISets = () => {
    if (aiSets.length === 0) return;
    const email = localStorage.getItem('verified_email');
    if (email) { doSaveAI(email); }
    else { setIsSavingAI(true); setIsEmailModalOpen(true); }
  };

  // 6개 완성 번호 단독 저장 트리거
  const handleSaveSingle = () => {
    if (currentSelection.length !== 6) return;
    const email = localStorage.getItem('verified_email');
    if (email) { doSaveSingle(email); }
    else { setIsSavingSingle(true); setIsEmailModalOpen(true); }
  };

  // 6개 선택 번호 복사
  const handleCopySingle = () => {
    const text = currentSelection.map(n => n.toString().padStart(2, '0')).join(', ');
    navigator.clipboard.writeText(text).then(() => alert('번호가 복사되었습니다!'));
  };

  // AI 세트 전체 복사
  const handleCopyAISets = () => {
    const text = aiSets
      .map((set, idx) => `세트 ${String.fromCharCode(65 + idx)}: ${set.map(n => n.toString().padStart(2, '0')).join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => alert('번호가 복사되었습니다!'));
  };

  // 이메일 다이얼로그 확인 → AI / 단독 / 수동 분기
  const handleEmailConfirm = (email: string) => {
    if (isSavingAI) doSaveAI(email);
    else if (isSavingSingle) doSaveSingle(email);
    else doSaveManual(email);
  };

  const doSaveSingle = (email: string) => {
    const entry = {
      email,
      savedAt: new Date().toISOString(),
      combinations: [currentSelection],
      aiFlags: [false],
      type: 'manual',
    };
    const existing = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
    existing.unshift(entry);
    localStorage.setItem('savedNumbers', JSON.stringify(existing));
    setCurrentSelection([]);
    setIsSavingSingle(false);
    navigate('/saved');
  };

  const doSaveAI = (email: string) => {
    const entry = {
      email,
      savedAt: new Date().toISOString(),
      combinations: aiSets,
      aiFlags: aiSets.map(() => true),
      type: 'semi-auto',
    };
    const existing = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
    existing.unshift(entry);
    localStorage.setItem('savedNumbers', JSON.stringify(existing));
    setAiSets([]);
    navigate('/saved');
  };

  const doSaveManual = (email: string) => {
    const hasAiSet = savedSets.some(s => s.isAi);
    const entry = {
      email,
      savedAt: new Date().toISOString(),
      combinations: savedSets.map(s => s.numbers),
      aiFlags: savedSets.map(s => s.isAi),
      type: hasAiSet ? 'semi-auto' : 'manual',
    };
    const existing = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
    existing.unshift(entry);
    localStorage.setItem('savedNumbers', JSON.stringify(existing));
    localStorage.removeItem(DRAFT_KEY);
    navigate('/saved');
  };

  const slots = Array.from({ length: 6 });

  return (
    <div className="bg-background text-on-background font-label antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* AI 로딩 오버레이 */}
      {isAILoading && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-screen z-[200] bg-background flex flex-col items-center justify-center gap-6 px-8">
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center shadow-xl ai-pulse ring-8 ring-amber-400/20">
            <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-lg font-headline font-bold text-on-surface">번호 조합 중...</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">AI가 1등 번호가 가장 많이 나온<br />가중치로 번호를 조합중 입니다.</p>
          </div>
          <div className="w-64 bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ animation: 'loading 2.5s ease-out forwards' }}></div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 flex items-center justify-between px-6 bg-surface/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm shadow-stone-200/50 dark:shadow-none z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black font-headline text-stone-900 dark:text-stone-50 tracking-tighter">Lucky Win</h1>
        </div>
      </header>

      <main className="pt-16 pb-28 max-w-2xl mx-auto">

        {/* 1. Sticky - 수동 선택 슬롯 + AI 버튼 */}
        <section className="sticky top-16 z-40 bg-surface-container-lowest border-b border-outline-variant/15 shadow-md w-full">
          {/* Row 1: 선택 슬롯 + 카운터 */}
          <div className="px-5 pt-3 pb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {slots.map((_, i) => {
                const num = currentSelection[i];
                return (
                  <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-black text-sm transition-all duration-200 ${
                    num
                      ? `${getNumberColorClass(num)} shadow-md ring-2 ring-white scale-100`
                      : 'bg-surface-container-high border-2 border-dashed border-outline-variant/30 text-transparent scale-95'
                  }`}>
                    {num ? num.toString().padStart(2, '0') : ''}
                  </div>
                );
              })}
            </div>
            <span className="text-xs font-bold bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface shrink-0">{currentSelection.length} / 6</span>
          </div>
          {/* Row 2: AI 버튼 + 초기화 버튼 */}
          <div className="px-5 pb-3 flex gap-2">
            {currentSelection.length === 6 ? (
              <>
                <button
                  onClick={handleSaveSingle}
                  className="flex-1 py-2.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 gold-gradient text-white shadow-md shadow-amber-500/20 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">bookmark</span>
                  번호저장
                </button>
                <button
                  onClick={handleCopySingle}
                  className="flex-1 py-2.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 bg-surface-container-high text-on-surface active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-base">content_copy</span>
                  번호복사
                </button>
              </>
            ) : (
              <button
                onClick={handleAIGenerate}
                className="flex-1 py-2.5 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 gold-gradient text-white shadow-md shadow-amber-500/20 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                AI 반자동 생성 (5세트 완성)
              </button>
            )}
            <button
              onClick={() => { setCurrentSelection([]); setAiSets([]); }}
              className="px-4 py-2.5 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-1 bg-surface-container-high text-on-surface-variant active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              초기화
            </button>
          </div>
        </section>

        {/* 2. 세트조합 - AI 결과 (생성 후 sticky 바로 아래 노출) */}
        {aiSets.length > 0 && (
          <div className="px-5 pt-4 pb-2 space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-bold text-on-surface">세트조합</h3>
              <span className="text-[11px] font-black text-primary bg-primary-container px-2 py-0.5 rounded-full">5 / 5 SETS</span>
            </div>

            <div className="space-y-2">
              {aiSets.map((set, idx) => {
                const letter = String.fromCharCode(65 + idx);
                return (
                  <div key={idx} className="bg-surface-container-lowest rounded-2xl px-4 py-3 border border-outline-variant/20 shadow-sm flex items-center gap-3">
                    <span className="font-headline font-bold text-primary text-[11px] uppercase tracking-widest shrink-0 w-10">세트 {letter}</span>
                    <div className="flex gap-1.5 flex-1 justify-center">
                      {set.map(n => (
                        <div key={n} className={`w-9 h-9 rounded-full flex items-center justify-center font-headline font-bold text-[12px] shadow-sm ${getNumberColorClass(n)}`}>
                          {n.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveAISets}
                className="flex-1 py-4 rounded-2xl gold-gradient text-white font-headline font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
              >
                <span className="material-symbols-outlined text-xl">bookmark</span>
                번호저장
              </button>
              <button
                onClick={handleCopyAISets}
                className="flex-1 py-4 rounded-2xl bg-surface-container-high text-on-surface font-headline font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-xl">content_copy</span>
                번호복사
              </button>
            </div>
          </div>
        )}

        {/* 3. 번호 선택 패드 (수동) */}
        <div className="px-5 pt-4 pb-3">
          <section className={`bg-surface-container-low rounded-3xl p-4 transition-opacity duration-300 ${savedSets.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 45 }).map((_, i) => {
                const num = i + 1;
                const isSelected = currentSelection.includes(num);
                if (isSelected) {
                  return (
                    <button key={num} onClick={() => toggleNumber(num)} className="w-full aspect-square rounded-full flex items-center justify-center text-sm font-extrabold bg-primary text-white shadow-md shadow-primary/20 active:scale-95 transition-transform ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low">{num}</button>
                  );
                }
                return (
                  <button key={num} onClick={() => toggleNumber(num)} disabled={currentSelection.length >= 6 && !isSelected} className="w-full aspect-square rounded-full flex items-center justify-center text-sm font-extrabold bg-surface-container-lowest text-on-surface hover:bg-surface-container-high active:scale-90 transition-all shadow-sm border border-outline-variant/10 disabled:opacity-30">{num}</button>
                );
              })}
            </div>
          </section>
        </div>

        {/* 4. 나의 수동 조합함 (수동 세트 있을 때만) */}
        <div className="px-5 space-y-4">
          {savedSets.length > 0 && (
            <section className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-on-surface-variant">나의 수동 조합함</h3>
                <span className="text-[11px] font-black tracking-widest uppercase text-primary bg-primary-container px-2 py-0.5 rounded-full">{savedSets.length} / 5 SETS</span>
              </div>
              <div className="space-y-3">
                {savedSets.map((set, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <div key={idx} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 shadow-sm flex items-center justify-between animation-fade-in">
                      <div className="flex flex-col items-start w-full">
                        <span className="font-headline font-bold text-primary tracking-widest text-[11px] uppercase mb-2">
                          수동 세트 {letter}
                        </span>
                        <div className="flex gap-1.5">
                          {set.numbers.map(n => (
                            <div key={n} className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-[11px] shadow-sm ${getNumberColorClass(n)}`}>
                              {n.toString().padStart(2, '0')}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteSet(idx)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  );
                })}
                <button onClick={handleFinalSave} className="w-full bg-surface-container-highest text-on-surface hover:bg-surface-variant py-4 rounded-xl font-headline font-extrabold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-xl text-primary">bookmark</span>
                  번호 저장하기
                </button>
              </div>
            </section>
          )}

        </div>
      </main>

      <BottomNav />

      <EmailInputDialog
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onConfirm={handleEmailConfirm}
      />
    </div>
  );
}
