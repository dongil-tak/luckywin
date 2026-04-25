import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

export default function WinningItems() {
  const navigate = useNavigate();
  // DB에서 최근 당첨 3건 추출 (목업용 필터링)
  const myWinningHistory = [
    { ...lottoDB[0], rank: 3, prizeAmount: 1540230 },
    { ...lottoDB[4], rank: 4, prizeAmount: 50000 },
    { ...lottoDB[11], rank: 5, prizeAmount: 5000 }
  ];
  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제{lottoDB[0].round + 1}회차</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Title Area */}
        <div className="mb-4">
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">나의 행운 관리</h2>
          <p className="text-sm font-medium text-on-surface-variant mt-2">관리 중인 번호 조합과 당첨 기록입니다</p>
        </div>

        {/* Sticky Tab Navigation */}
        <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-md pb-3 pt-2 -mx-2 px-2 mb-6">
          <div className="flex p-1.5 bg-surface-container-low rounded-2xl">
            <button
              onClick={() => navigate('/fortune')}
              className="flex-1 py-3 text-sm font-bold rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-center"
            >최근 항목</button>
            <button className="flex-1 py-3 text-sm font-bold rounded-xl bg-surface-container-lowest text-primary shadow-sm transition-all">당첨 항목</button>
          </div>
        </div>

        {/* Summary Card */}
        <section className="glass-card rounded-lg p-8 mb-12 shadow-[0_40px_40px_rgba(27,28,25,0.04)] border border-white/20">
          <div className="flex flex-col gap-2">
            <span className="text-on-surface-variant font-label text-sm font-medium">총 당첨 금액</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-headline font-extrabold text-primary-container">₩2,450,000</span>
              <span className="text-on-surface-variant font-body text-lg">원</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface">1st</div>
              <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface">3rd</div>
              <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface">4th</div>
            </div>
            <span className="text-xs text-on-surface-variant font-label">총 12회의 행운이 함께했습니다.</span>
          </div>
        </section>

        {/* Winner Cards List */}
        <div className="space-y-10">
          {myWinningHistory.map((item, index) => {
            const rankText = `${item.rank}등 당첨`;
            const formattedPrize = `₩${item.prizeAmount.toLocaleString('ko-KR')}`;
            const drawDateLabel = `${item.drawDate.substring(0, 4)}년 ${item.drawDate.substring(5, 7)}월 ${item.drawDate.substring(8, 10)}일 추첨`;
            
            return (
              <div key={item.round}>
                <article className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_40px_rgba(27,28,25,0.02)] border border-outline-variant/10 relative overflow-hidden">
                  {item.rank <= 3 && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  )}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-headline font-bold text-on-surface">제{item.round}회차</h3>
                      <p className="text-xs text-on-surface-variant font-label">{drawDateLabel}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full ${item.rank <= 3 ? 'bg-primary-container/10 border-primary-container/20 text-primary' : 'bg-surface-container-high border-outline-variant/20 text-on-surface-variant'} border`}>
                      <span className="font-bold text-sm">{rankText}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-8 flex-wrap">
                    {/* Dummy highlight logic for UI representation */}
                    {item.numbers.map((n, i) => {
                      const isMatch = i < (6 - item.rank + 1); // Mock matching numbers
                      return (
                        <span key={n} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold font-headline text-sm ${isMatch ? 'bg-surface-container-high text-on-surface winning-glow ring-2 ring-primary-container ring-offset-2' : 'bg-surface-container-low text-on-surface-variant/40'}`}>
                          {n}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">당첨 금액</span>
                      <span className={`text-xl font-bold font-headline ${item.rank <= 3 ? 'text-primary' : 'text-on-surface'}`}>{formattedPrize}</span>
                    </div>
                    <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high transition-colors px-4 py-2 rounded-full active:scale-95">
                      <span className="material-symbols-outlined text-sm">share</span>
                      <span className="text-xs font-bold font-label">소식 공유</span>
                    </button>
                  </div>
                </article>
                {index === 0 && (
                  <aside className="py-4 px-6 mt-10 bg-surface-container-low/50 rounded-xl border border-dashed border-outline-variant/30 text-center">
                    <span className="text-[10px] font-label text-on-surface-variant/40 uppercase tracking-[0.2em] block mb-2">광고</span>
                    <div className="h-20 flex items-center justify-center overflow-hidden grayscale opacity-50 text-xs text-on-surface-variant/50">광고 배너 영역</div>
                  </aside>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
