import { useState, useMemo } from 'react';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

interface Winner {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  prizes: {
    rank1: { amount: string; count: number };
  };
}

const winners: Winner[] = lottoDB.map((item) => ({
  round: item.round,
  date: `${item.drawDate.substring(0, 4)}년 ${item.drawDate.substring(5, 7)}월 ${item.drawDate.substring(8, 10)}일`,
  numbers: item.numbers,
  bonus: item.bonus,
  prizes: {
    rank1: { amount: item.prizeAmount.toLocaleString('ko-KR'), count: item.winners },
  },
}));

function NumberBall({ n }: { n: number }) {
  return (
    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-headline font-bold text-sm shadow-sm bg-surface-container-high text-on-surface">
      {n}
    </div>
  );
}

function PrizeRow({ rank, label, amount, count }: {
  rank: string; label: string; amount: string; count: number;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-outline-variant/15 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold
          ${rank === '1' ? 'bg-amber-400 text-white' : rank === '2' ? 'bg-stone-300 text-stone-700' : 'bg-amber-800/20 text-amber-900'}`}>
          {rank}등
        </span>
        <div>
          <p className="text-xs text-on-surface-variant">{label}</p>
          <p className="font-headline font-bold text-sm text-on-surface">₩{amount}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-on-surface-variant">당첨인원</p>
        <p className="font-bold text-sm text-on-surface">{count.toLocaleString()}명</p>
      </div>
    </div>
  );
}

interface AppWinningHistoryItem {
  round: number;
  drawDate: string;
  combination: number[];
  type: 'ai' | 'semi-auto' | 'manual';
  matchCount: number;
  bonusMatched: boolean;
  rank: string;
}

export default function LuckyHistory() {
  const [selectedRound, setSelectedRound] = useState<Winner | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [activeTab, setActiveTab] = useState<'official' | 'app'>('official');

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  /** savedAt 기준 해당 주의 다음 토요일(추첨일) 반환 */
  const getNextSaturday = (savedAt: string): Date => {
    const d = new Date(savedAt);
    const day = d.getDay();
    const daysUntilSaturday = day === 6 ? 7 : 6 - day;
    d.setDate(d.getDate() + daysUntilSaturday);
    d.setHours(23, 0, 0, 0);
    return d;
  };

  // 우리 앱 배출/당첨 데이터 계산
  const appWinningHistory = useMemo((): AppWinningHistoryItem[] => {
    try {
      const allEntries = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
      const results: AppWinningHistoryItem[] = [];

      allEntries.forEach((entry: any) => {
        const sat = getNextSaturday(entry.savedAt);
        const draw = lottoDB.find((row) => {
          const drawDate = new Date(row.drawDate);
          return (
            drawDate.getFullYear() === sat.getFullYear() &&
            drawDate.getMonth() === sat.getMonth() &&
            drawDate.getDate() === sat.getDate()
          );
        });

        if (draw) {
          entry.combinations.forEach((comb: number[], cIdx: number) => {
            const main = comb.filter(n => draw.numbers.includes(n)).length;
            const hasBonus = comb.includes(draw.bonus);
            if (main >= 3) { // 5등 이상
              let rank = '5등';
              if (main === 6) rank = '1등';
              else if (main === 5 && hasBonus) rank = '2등';
              else if (main === 5) rank = '3등';
              else if (main === 4) rank = '4등';

              const type = entry.type || (entry.aiFlags?.[cIdx] ? 'ai' : 'manual');

              results.push({
                round: draw.round,
                drawDate: draw.drawDate,
                combination: comb,
                type: type,
                matchCount: main,
                bonusMatched: hasBonus,
                rank
              });
            }
          });
        }
      });

      return results.sort((a, b) => b.round - a.round);
    } catch (e) {
      return [];
    }
  }, []);

  // 총 생성 조합 및 당첨 통계
  const stats = useMemo(() => {
    try {
      const allEntries = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
      let totalGenerated = 0;
      allEntries.forEach((entry: any) => {
        totalGenerated += (entry.combinations || []).length;
      });

      const wins = {
        '1등': 0,
        '2등': 0,
        '3등': 0,
        '4등': 0,
        '5등': 0,
      };

      appWinningHistory.forEach(item => {
        if (item.rank in wins) {
          wins[item.rank as keyof typeof wins]++;
        }
      });

      const totalWins = appWinningHistory.length;
      const winRate = totalGenerated > 0 ? ((totalWins / totalGenerated) * 100).toFixed(1) : '0.0';

      return { totalGenerated, totalWins, wins, winRate };
    } catch (e) {
      return { totalGenerated: 0, totalWins: 0, wins: { '1등': 0, '2등': 0, '3등': 0, '4등': 0, '5등': 0 }, winRate: '0.0' };
    }
  }, [appWinningHistory]);

  return (
    <div className="bg-surface text-on-surface font-label min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md z-50 shadow-sm shadow-stone-200/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">럭키윈(LUCKY WIN)</h1>
        </div>
        <span className="font-headline font-bold text-lg text-amber-600">제{lottoDB[0].round + 1}회차</span>
      </header>

      {/* Prize Detail Popup */}
      {selectedRound && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end justify-center"
          onClick={() => setSelectedRound(null)}
        >
          <div
            className="w-full max-w-lg bg-surface rounded-t-3xl px-6 pt-6 pb-12 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-outline-variant/40 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{selectedRound.date} 추첨</p>
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">제{selectedRound.round}회차</h3>
              </div>
              <button onClick={() => setSelectedRound(null)} className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Winning Numbers */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedRound.numbers.map(n => (
                <NumberBall key={n} n={n} />
              ))}
              <div className="flex items-center px-1 text-on-surface-variant/60">
                <span className="material-symbols-outlined text-lg">add</span>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest border-2 border-primary-container text-primary font-headline font-extrabold text-sm">
                {selectedRound.bonus}
              </div>
            </div>

            {/* Prize Table */}
            <div className="bg-surface-container-low rounded-xl p-4 space-y-0">
              <PrizeRow
                rank="1"
                label="1등 당첨금 (1인)"
                amount={selectedRound.prizes.rank1.amount}
                count={selectedRound.prizes.rank1.count}
              />
            </div>
          </div>
        </div>
      )}

      <main className="pt-24 pb-48 px-6 max-w-2xl mx-auto space-y-6">
        {/* Title Section */}
        <div className="border-b border-outline-variant/30 pb-4">
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-1">명예의 전당</h2>
          <p className="text-sm font-medium text-on-surface-variant">당첨 번호 조회 및 우리 앱 예측 매핑 통계입니다.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1.5 bg-surface-container-low rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('official')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'official' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            역대 당첨번호
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'app' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            우리 앱 배출 성과
          </button>
        </div>

        {activeTab === 'official' ? (
          <>
            {/* Winner Cards */}
            <div className="space-y-4">
              {winners.slice(0, visibleCount).map((w) => (
                <article key={w.round} className="p-5 md:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                  <div className="space-y-1">
                    <span className="font-headline font-extrabold text-xl tracking-tighter text-on-surface">제{w.round}회차</span>
                    <p className="text-on-surface-variant text-xs">{w.date} 추첨</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {w.numbers.map(n => <NumberBall key={n} n={n} />)}
                    <div className="flex items-center px-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">add</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-surface-container-highest border-2 border-primary-container text-primary font-headline font-extrabold text-sm">
                      {w.bonus}
                    </div>
                    <button
                      onClick={() => setSelectedRound(w)}
                      className="ml-3 bg-surface-container-highest w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all shrink-0"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            {visibleCount < winners.length && (
              <div className="flex justify-center py-6">
                <button onClick={handleLoadMore} className="bg-surface-container-highest text-on-surface font-bold px-10 py-4 rounded-full flex items-center gap-3 hover:bg-surface-variant transition-colors group">
                  이전 회차 더보기
                  <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline-variant/10 shadow-sm">
                <p className="text-[10px] font-bold text-on-surface-variant mb-1">총 추천 번호 수</p>
                <p className="font-headline font-black text-2xl text-on-surface">{stats.totalGenerated}개</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline-variant/10 shadow-sm">
                <p className="text-[10px] font-bold text-on-surface-variant mb-1">총 당첨 조합 수</p>
                <p className="font-headline font-black text-2xl text-primary">{stats.totalWins}개</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline-variant/10 shadow-sm">
                <p className="text-[10px] font-bold text-on-surface-variant mb-1">종합 적중률</p>
                <p className="font-headline font-black text-2xl text-amber-600">{stats.winRate}%</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-outline-variant/10 shadow-sm">
                <p className="text-[10px] font-bold text-on-surface-variant mb-1">5등 이상 당첨</p>
                <p className="font-headline font-black text-2xl text-emerald-600">{stats.totalWins}건</p>
              </div>
            </div>

            {/* Rank Distribution breakdown */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-4">등수별 상세 매핑 내역</h3>
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.entries(stats.wins).map(([rank, count]) => (
                  <div key={rank} className="bg-surface-container-low/60 rounded-xl p-3">
                    <p className="text-xs font-black text-on-surface">{rank}</p>
                    <p className="text-base font-extrabold text-primary mt-1">{count}건</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Winning Combinations Generated List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-on-surface">앱 배출 당첨 조합 목록</h3>
              
              {appWinningHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl opacity-30 mb-3">military_tech</span>
                  <p className="text-sm font-medium">배출된 당첨 조합이 없습니다.</p>
                  <p className="text-xs opacity-75 mt-1">번호를 생성하고 저장한 뒤, 추첨 시간이 지나면 당첨 결과가 여기에 자동 매핑됩니다.</p>
                </div>
              ) : (
                appWinningHistory.map((item, idx) => (
                  <article key={idx} className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-black text-lg text-on-surface">제{item.round}회차</span>
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full text-white bg-amber-500`}>
                          {item.rank}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {item.type === 'ai' ? 'AI 추천' : item.type === 'semi-auto' ? '반자동' : '직접선택'}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant">추첨일: {item.drawDate}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {item.combination.map((n, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm bg-surface-container-high text-on-surface`}
                        >
                          {n}
                        </div>
                      ))}
                      <span className="text-xs font-extrabold text-primary ml-2">({item.matchCount}개 일치)</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
