import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

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

/** savedAt 기준 해당 주의 다음 토요일(추첨일) 반환 */
const getNextSaturday = (savedAt: string): Date => {
  const d = new Date(savedAt);
  const day = d.getDay(); // 0=일, 6=토
  const daysUntilSaturday = day === 6 ? 7 : 6 - day;
  d.setDate(d.getDate() + daysUntilSaturday);
  d.setHours(23, 0, 0, 0); // 추첨 시각 23:00
  return d;
};

/** 추첨일(토요일) 한국어 포맷 */
const formatDrawDate = (sat: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${sat.getFullYear()}년 ${pad(sat.getMonth() + 1)}월 ${pad(sat.getDate())}일 (추첨일)`;
};

/** savedAt 기준으로 해당 토요일 추첨 회차 데이터 찾기 */
const findDrawForEntry = (savedAt: string) => {
  const sat = getNextSaturday(savedAt);
  return (lottoDB as { round: number; numbers: number[]; bonus: number; winners: number; prizeAmount: number; totalSales: number | null; drawDate: string }[]).find((row) => {
    const drawDate = new Date(row.drawDate);
    return (
      drawDate.getFullYear() === sat.getFullYear() &&
      drawDate.getMonth() === sat.getMonth() &&
      drawDate.getDate() === sat.getDate()
    );
  }) || null;
};

/** 조합 하나와 당첨번호를 비교하여 맞힌 개수 반환 */
const countMatches = (combo: number[], winNumbers: number[], bonus: number) => {
  const main = combo.filter(n => winNumbers.includes(n)).length;
  const hasBonus = combo.includes(bonus);
  return { main, hasBonus };
};

/** 등수 계산 */
const getRank = (main: number, hasBonus: boolean): string => {
  if (main === 6) return '🥇 1등';
  if (main === 5 && hasBonus) return '🥈 2등';
  if (main === 5) return '🥉 3등';
  if (main === 4) return '4등';
  if (main === 3) return '5등';
  return '낙첨';
};

export default function SavedNumbers() {
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const now = new Date();

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
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">저장된 번호보기</h2>
          <p className="text-sm font-medium text-on-surface-variant mt-2">저장된 번호 조합과 추첨 결과를 확인하세요</p>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl opacity-30">bookmark_border</span>
            <p className="text-base font-medium">저장된 번호가 없습니다</p>
            <p className="text-sm opacity-70">번호 직접선택에서 번호를 저장해 보세요</p>
            <Link to="/dashboard" className="mt-4 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm">
              번호 직접선택으로 이동
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.map((entry, idx) => {
              const sat = getNextSaturday(entry.savedAt);
              const isPastDraw = now > sat;
              const drawData = isPastDraw ? findDrawForEntry(entry.savedAt) : null;

              return (
                <article key={idx} className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_40px_rgba(27,28,25,0.02)] border border-outline-variant/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-base">schedule</span>
                        <span className="text-sm font-bold text-on-surface">{formatDate(entry.savedAt)}</span>
                      </div>

                      {/* 추첨일 배지 */}
                      <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                        isPastDraw
                          ? drawData ? 'bg-amber-100 text-amber-800' : 'bg-surface-container-high text-on-surface-variant'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isPastDraw ? 'event_available' : 'event'}
                        </span>
                        {isPastDraw
                          ? drawData ? `${drawData.round}회차 당첨결과 확인` : '해당 회차 데이터 없음'
                          : formatDrawDate(sat)
                        }
                      </div>
                    </div>
                    <button onClick={() => handleDelete(idx)} className="p-1.5 rounded-full hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-base text-on-surface-variant/50">delete_outline</span>
                    </button>
                  </div>

                  {/* 추첨 결과 당첨번호 표시 (추첨일이 지난 경우) */}
                  {isPastDraw && drawData && (
                    <div className="mb-5 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">제{drawData.round}회 당첨번호</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {drawData.numbers.map((n, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getNumberColorClass(n)}`}>
                            {n.toString().padStart(2, '0')}
                          </div>
                        ))}
                        <span className="text-on-surface-variant/40 text-xs font-bold mx-0.5">+</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-primary/30 ${getNumberColorClass(drawData.bonus)}`}>
                          {drawData.bonus.toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Combinations */}
                  <div className="space-y-4">
                    {entry.combinations.map((comb, ci) => {
                      const matchResult = (isPastDraw && drawData)
                        ? countMatches(comb, drawData.numbers, drawData.bonus)
                        : null;
                      const rank = matchResult ? getRank(matchResult.main, matchResult.hasBonus) : null;
                      const isWin = matchResult && matchResult.main >= 3;

                      return (
                        <div key={ci} className={`rounded-xl p-3 ${isWin ? 'bg-amber-50 border border-amber-200/60 dark:bg-amber-900/10' : 'bg-surface-container-low/50'}`}>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">조합 {String.fromCharCode(65 + ci)}</span>
                            {rank && (
                              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                                matchResult!.main >= 5 ? 'bg-amber-500 text-white' :
                                matchResult!.main === 4 ? 'bg-sky-500 text-white' :
                                matchResult!.main === 3 ? 'bg-emerald-500 text-white' :
                                'bg-surface-container-high text-on-surface-variant'
                              }`}>
                                {rank} · {matchResult!.main}개 적중
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {comb.map((n, ni) => {
                              const isMatch = matchResult && (drawData!.numbers.includes(n) || n === drawData!.bonus);
                              return (
                                <div key={ni} className={`w-9 h-9 rounded-full flex items-center justify-center font-headline font-bold text-sm transition-all ${
                                  getNumberColorClass(n)
                                } ${isMatch ? 'ring-2 ring-offset-2 ring-amber-400 scale-110' : isPastDraw ? 'opacity-50 grayscale' : ''}`}>
                                  {n.toString().padStart(2, '0')}
                                </div>
                              );
                            })}
                          </div>
                          {/* 적중률 바 */}
                          {matchResult && (
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700"
                                  style={{ width: `${(matchResult.main / 6) * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-on-surface-variant shrink-0">{matchResult.main}/6</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
              );
            })}

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
