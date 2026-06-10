import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import EmailInputDialog from '../../components/EmailInputDialog';
import AdSenseBanner from '../../components/AdSenseBanner';

const getNumberColorClass = (n: number) => {
  if (n <= 10) return 'bg-[#facc15] text-[#713f12]';
  if (n <= 20) return 'bg-[#3b82f6] text-white';
  if (n <= 30) return 'bg-[#ef4444] text-white';
  if (n <= 40) return 'bg-[#a1a1aa] text-zinc-900';
  return 'bg-[#10b981] text-white';
};

const DRAFT_KEY = 'dashboard_draft_sets';

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
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    if (savedSets.length > 0) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(savedSets));
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [savedSets]);

  const toggleNumber = (num: number) => {
    if (savedSets.length >= 5) return; // 5세트 꽉 참
    
    if (currentSelection.includes(num)) {
      setCurrentSelection(currentSelection.filter(n => n !== num));
    } else {
      if (currentSelection.length < 6) {
        setCurrentSelection([...currentSelection, num].sort((a, b) => a - b));
      }
    }
  };

  const handleAddSet = () => {
    if (currentSelection.length === 6 && savedSets.length < 5) {
      setSavedSets([...savedSets, { numbers: currentSelection, isAi: false }]);
      setCurrentSelection([]);
    }
  };

  const handleSemiAuto = () => {
    if (savedSets.length >= 5) return;
    if (currentSelection.length >= 6) return;

    // AI가 최적의 번호를 조합하여 제공한다는 컨셉에 맞춰 AI 알고리즘 메시지를 보여주거나 처리
    const available = Array.from({ length: 45 }).map((_, i) => i + 1).filter(n => !currentSelection.includes(n));
    const toPick = 6 - currentSelection.length;
    
    const picked = [];
    for (let i = 0; i < toPick; i++) {
        const randIndex = Math.floor(Math.random() * available.length);
        picked.push(available[randIndex]);
        available.splice(randIndex, 1);
    }

    const finalSet = [...currentSelection, ...picked].sort((a, b) => a - b);
    setSavedSets([...savedSets, { numbers: finalSet, isAi: true }]);
    setCurrentSelection([]);
  };

  const handleDeleteSet = (index: number) => {
    setSavedSets(savedSets.filter((_, i) => i !== index));
  };

  const handleFinalSave = () => {
    if (savedSets.length === 0) return;
    
    const email = localStorage.getItem('verified_email');
    if (email) {
      handleSaveConfirm(email);
    } else {
      setIsEmailModalOpen(true);
    }
  };

  const handleSaveConfirm = (email: string) => {
    // 하나라도 AI 반자동이 있으면 type을 'semi-auto'로 설정하고, 개별 정보도 같이 저장되도록 보강
    const hasAiSet = savedSets.some(s => s.isAi);
    const entry = {
      email,
      savedAt: new Date().toISOString(),
      combinations: savedSets.map(s => s.numbers),
      aiFlags: savedSets.map(s => s.isAi), // 개별 AI 생성 여부 플래그
      type: hasAiSet ? 'semi-auto' : 'manual'
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
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 flex items-center justify-between px-6 bg-surface/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm shadow-stone-200/50 dark:shadow-none z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="edit_square">edit_square</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">번호 직접선택</h1>
        </div>
      </header>

      <main className="pt-16 pb-48 max-w-2xl mx-auto space-y-6">
        
        {/* 1. TOP Viewer - 현재 선택 영역 (상단 스크롤 밀착 고정) */}
        <section className="sticky top-16 z-40 bg-surface-container-lowest p-6 border-b border-outline-variant/15 shadow-md w-full">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-lg font-headline font-extrabold text-on-surface mb-0.5">선택 중인 번호</h2>
              <p className="text-xs font-medium text-on-surface-variant">정확히 6개를 골라 1세트를 완성하세요.</p>
            </div>
            <span className="text-xs font-bold bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface">{currentSelection.length} / 6</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6">
            {slots.map((_, i) => {
              const num = currentSelection[i];
              return (
                <div key={i} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-black text-sm sm:text-lg transition-all duration-300 ${
                  num 
                    ? `${getNumberColorClass(num)} shadow-md ring-2 ring-white scale-100` 
                    : 'bg-surface-container-high border-2 border-dashed border-outline-variant/40 text-transparent scale-95'
                }`}>
                  {num ? num.toString().padStart(2, '0') : ''}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAddSet}
              disabled={currentSelection.length !== 6 || savedSets.length >= 5}
              className="flex-1 py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:bg-surface-container-high disabled:text-on-surface-variant/50 bg-primary text-white shadow-lg shadow-primary/20 pointer-events-auto"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              {savedSets.length >= 5 ? '최대 세트 완료' : '세트 저장'}
            </button>
            <button 
              onClick={handleSemiAuto}
              disabled={currentSelection.length === 6 || savedSets.length >= 5}
              className="flex-1 py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:bg-surface-container-high disabled:text-on-surface-variant/50 gold-gradient text-white shadow-lg shadow-amber-500/20 pointer-events-auto"
            >
              <span className="material-symbols-outlined text-lg">psychology</span>
              AI 반자동 생성
            </button>
            </div>
          </div>
        </section>

        {/* 나머지 콘텐츠를 위한 좌우 여백 패딩 컨테이너 */}
        <div className="px-6 space-y-6">
          {/* 2. MIDDLE Area - 확정된 세트 리스트 */}
        <section className="space-y-3">
          <div className="flex justify-between items-center mb-2 px-2">
             <h3 className="text-sm font-bold text-on-surface-variant">나의 수동 조합함</h3>
             <span className="text-[11px] font-black tracking-widest uppercase text-primary bg-primary-container px-2 py-0.5 rounded-full">{savedSets.length} / 5 SETS</span>
          </div>

          {savedSets.length === 0 ? (
             <div className="bg-surface-container-low border border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center opacity-70">
               <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">inbox</span>
               <p className="text-xs font-bold text-on-surface-variant">아직 추가된 조합이 없습니다.</p>
               <p className="text-[11px] font-medium text-on-surface-variant/60 mt-1">번호 6개를 고른 후 추가 버튼을 눌러주세요.</p>
             </div>
          ) : (
            <div className="space-y-3">
              {savedSets.map((set, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C...
                return (
                  <div key={idx} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 shadow-sm flex items-center justify-between group animation-fade-in">
                    <div className="flex flex-col items-start w-full md:w-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-headline font-bold text-primary tracking-widest text-[11px] uppercase">
                          {set.isAi ? `반자동 세트 ${letter}` : `수동 세트 ${letter}`}
                        </span>
                        {set.isAi && (
                          <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[9px]">psychology</span>
                            AI 반자동
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        {set.numbers.map(n => (
                          <div key={n} className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-[11px] shadow-sm ${getNumberColorClass(n)}`}>
                            {n.toString().padStart(2, '0')}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteSet(idx)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors">
                       <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                );
              })}
              
              {/* List Inner Save Button */}
              {savedSets.length > 0 && (
                <div className="pt-4 pb-2 animation-fade-in">
                  <button onClick={handleFinalSave} className="w-full bg-surface-container-highest text-on-surface hover:bg-surface-variant py-4 rounded-xl font-headline font-extrabold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-xl text-primary" data-icon="bookmark">bookmark</span>
                    번호 저장하기
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Google Adsense Banner above Number Pad */}
        <div className="w-full border border-outline-variant/10 rounded-2xl overflow-hidden bg-surface-container-low/30 my-4">
          <AdSenseBanner client="ca-pub-4554368744270377" slot="1076190784" format="fluid" layoutKey="-hi-7+2w-11-86" />
        </div>

        {/* 3. BOTTOM - Number Pad (1~45) */}
        <section className={`bg-surface-container-low rounded-3xl p-6 transition-opacity duration-300 ${savedSets.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-sm font-bold text-on-surface mb-4 text-center">번호 선택 패드</h3>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2.5 sm:gap-3">
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
