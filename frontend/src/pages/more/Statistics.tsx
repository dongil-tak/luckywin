import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

const getNumberColorClass = (n: number) => {
  if (n <= 10) return 'bg-[#facc15] text-[#713f12]';
  if (n <= 20) return 'bg-[#3b82f6] text-white';
  if (n <= 30) return 'bg-[#ef4444] text-white';
  if (n <= 40) return 'bg-[#a1a1aa] text-zinc-900';
  return 'bg-[#10b981] text-white';
};

export default function Statistics() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'freq' | 'num'>('freq');

  // 데이터 알고리즘: 각 번호(1~45)의 출현 횟수와 비율 계산
  const stats = useMemo(() => {
    const counts = Array(46).fill(0); // 1~45
    const totalDraws = lottoDB.length;

    lottoDB.forEach((item) => {
      // 보너스 번호 제외, 정규 번호 6개만
      item.numbers.forEach((num) => {
        if (num >= 1 && num <= 45) {
          counts[num]++;
        }
      });
    });

    // 최다 출현 횟수 (그래프 상대 길이를 위해)
    const maxCount = Math.max(...counts.slice(1));

    const result = [];
    for (let i = 1; i <= 45; i++) {
      result.push({
        num: i,
        count: counts[i],
        percentage: ((counts[i] / totalDraws) * 100).toFixed(1),
        relativeHeight: (counts[i] / maxCount) * 100, // 0~100% relative max
      });
    }

    if (sortBy === 'freq') {
      result.sort((a, b) => b.count - a.count || a.num - b.num);
    }

    return { data: result, totalDraws };
  }, [sortBy]);

  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high active:scale-95 transition-colors">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="query_stats">query_stats</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">번호통계</h1>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-primary mb-1 tracking-widest uppercase">역대 통합 누적 데이터</p>
          <h2 className="text-2xl font-headline font-extrabold tracking-tight">1등 번호 최다 출현 분석</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-2">
            총 <strong className="text-on-surface">{stats.totalDraws.toLocaleString()}회차</strong>의 정규 당첨번호 데이터를 분석했습니다.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1.5 bg-surface-container-low rounded-2xl mx-auto max-w-xs mb-8">
          <button
            onClick={() => setSortBy('freq')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${sortBy === 'freq' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high text-center'}`}
          >출현 빈도순</button>
          <button
            onClick={() => setSortBy('num')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${sortBy === 'num' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high text-center'}`}
          >번호순 정렬</button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {stats.data.map((item, index) => (
            <div key={item.num} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 flex items-center gap-4 shadow-[0_4px_20px_rgba(27,28,25,0.02)] relative overflow-hidden group hover:bg-surface-container/50 transition-colors">
              {/* Highlight Rank 1, 2, 3 */}
              {sortBy === 'freq' && index < 3 && (
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-primary-container/20 rounded-full blur-xl"></div>
              )}
              {/* Rank Label if Frequency sort */}
              {sortBy === 'freq' && (
                <div className="w-6 flex shrink-0 justify-center">
                  <span className={`text-[10px] font-extrabold uppercase ${index < 3 ? 'text-primary' : 'text-on-surface-variant/40'}`}>{index + 1}위</span>
                </div>
              )}

              {/* Number Ball */}
              <div className={`w-10 h-10 shrink-0 md:w-12 md:h-12 flex items-center justify-center rounded-full font-headline font-extrabold text-[15px] shadow-sm ${getNumberColorClass(item.num)} ring-2 ring-white`}>
                {item.num.toString().padStart(2, '0')}
              </div>

              {/* Bar and Stats */}
              <div className="flex-1 shrink flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm font-extrabold text-on-surface">{item.count}회</span>
                  <span className="text-[11px] font-bold text-on-surface-variant font-label">{item.percentage}%</span>
                </div>
                {/* Progress Bar Container */}
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary bg-opacity-90 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.relativeHeight}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
