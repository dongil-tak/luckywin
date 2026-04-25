import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

interface SavedEntry {
  savedAt: string;
  combinations: number[][];
}

const getNumberColorClass = (n: number) => {
  if (n <= 10) return 'bg-amber-400 text-white';
  if (n <= 20) return 'bg-sky-500 text-white';
  if (n <= 30) return 'bg-rose-500 text-white';
  if (n <= 40) return 'bg-zinc-400 text-white';
  return 'bg-emerald-500 text-white';
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}년 ${pad(d.getMonth() + 1)}월 ${pad(d.getDate())}일 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function SavedNumbers() {
  const [entries, setEntries] = useState<SavedEntry[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
    setEntries(stored);
  }, []);

  const handleDelete = (idx: number) => {
    const updated = entries.filter((_, i) => i !== idx);
    setEntries(updated);
    localStorage.setItem('savedNumbers', JSON.stringify(updated));
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제1150회차</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">저장된 번호보기</h2>
          <p className="text-sm font-medium text-on-surface-variant mt-2">저장된 번호 조합과 생성 일시를 확인하세요</p>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl opacity-30">bookmark_border</span>
            <p className="text-base font-medium">저장된 번호가 없습니다</p>
            <p className="text-sm opacity-70">당첨번호 보기에서 번호를 저장해 보세요</p>
            <Link to="/dashboard" className="mt-4 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm">
              스마트 당첨번호 생성
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.map((entry, idx) => (
              <article key={idx} className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_40px_rgba(27,28,25,0.02)] border border-outline-variant/10 relative overflow-hidden">
                {/* Decorative bg */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary text-base">schedule</span>
                      <span className="text-sm font-bold text-on-surface">{formatDate(entry.savedAt)}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant/70">이 시간에 생성된 번호 조합입니다</p>
                  </div>
                  <button onClick={() => handleDelete(idx)} className="p-1.5 rounded-full hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-base text-on-surface-variant/50">delete_outline</span>
                  </button>
                </div>

                {/* Combinations */}
                <div className="space-y-3">
                  {entry.combinations.map((comb, ci) => (
                    <div key={ci} className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-on-surface-variant/50 w-8 shrink-0">조합{String.fromCharCode(65 + ci)}</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {comb.map((n, ni) => (
                          <div key={ni} className={`w-9 h-9 rounded-full flex items-center justify-center font-headline font-bold text-sm ${getNumberColorClass(n)}`}>
                            {n.toString().padStart(2, '0')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                  <span className="text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest">{entry.combinations.length}개 조합 저장됨</span>
                  <button onClick={() => handleDelete(idx)} className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-xs">delete</span>
                    삭제
                  </button>
                </div>
              </article>
            ))}

            {/* Clear all */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => { localStorage.removeItem('savedNumbers'); setEntries([]); }}
                className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-error/10 hover:text-error transition-colors"
              >
                전체 삭제
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
