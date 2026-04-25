import { useState } from 'react';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

interface Winner {
  round: number;
  date: string;
  serviceWinner: boolean;
  numbers: number[];
  bonus: number;
  prizes: {
    rank1: { amount: string; count: number; serviceCount?: number };
    rank2: { amount: string; count: number };
    rank3: { amount: string; count: number };
  };
}

// Map first 10 items from DB as recent history
const winners: Winner[] = lottoDB.slice(0, 10).map((item, index) => ({
  round: item.round,
  date: `${item.drawDate.substring(0, 4)}년 ${item.drawDate.substring(5, 7)}월 ${item.drawDate.substring(8, 10)}일`,
  serviceWinner: index % 3 === 0, // Mock boolean for UI representation
  numbers: item.numbers,
  bonus: item.bonus,
  prizes: {
    rank1: { amount: item.prizeAmount.toLocaleString('ko-KR'), count: item.winners, serviceCount: index % 3 === 0 ? 1 : undefined },
    rank2: { amount: '56,284,110', count: 63 }, // Dummy rank2 prize for now since it's not in DB
    rank3: { amount: '1,500,000', count: 3241 }, // Dummy rank3 prize
  },
}));

const hotNumbers = [
  { num: '07', pct: 40 }, { num: '12', pct: 65 }, { num: '23', pct: 90 },
  { num: '29', pct: 55 }, { num: '33', pct: 75 }, { num: '41', pct: 85 },
];

function NumberBall({ n, highlight }: { n: number; highlight?: boolean }) {
  return (
    <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-headline font-bold text-sm shadow-sm
      ${highlight
        ? 'bg-primary-container text-on-primary-container ring-1 ring-primary/20'
        : 'bg-surface-container-high text-on-surface'}`}>
      {n}
    </div>
  );
}

function PrizeRow({ rank, label, amount, count, badge }: {
  rank: string; label: string; amount: string; count: number; badge?: string;
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
        {badge && <p className="text-[10px] text-primary font-bold mt-0.5">{badge}</p>}
      </div>
    </div>
  );
}

export default function LuckyHistory() {
  const [selectedRound, setSelectedRound] = useState<Winner | null>(null);

  return (
    <div className="bg-surface text-on-surface font-label min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md z-50 shadow-sm shadow-stone-200/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600">analytics</span>
          <h1 className="text-xl font-black text-stone-900 tracking-tighter">윈웨이(Win-Way)</h1>
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
                {selectedRound.serviceWinner && (
                  <span className="inline-block mt-1 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">🏆 서비스 예측 적중</span>
                )}
              </div>
              <button onClick={() => setSelectedRound(null)} className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Winning Numbers */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedRound.numbers.map(n => (
                <NumberBall key={n} n={n} highlight={selectedRound.serviceWinner} />
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
              <PrizeRow
                rank="2"
                label="2등 당첨금 (1인)"
                amount={selectedRound.prizes.rank2.amount}
                count={selectedRound.prizes.rank2.count}
              />
              <PrizeRow
                rank="3"
                label="3등 당첨금 (1인)"
                amount={selectedRound.prizes.rank3.amount}
                count={selectedRound.prizes.rank3.count}
              />
            </div>

            {/* Service Winners - only for serviceWinner rounds */}
            {selectedRound.serviceWinner && selectedRound.prizes.rank1.serviceCount !== undefined && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">윈웨이 서비스 배출</p>
                  <p className="font-headline font-extrabold text-amber-900 text-xl">{selectedRound.prizes.rank1.serviceCount}명</p>
                  <p className="text-xs text-amber-600">이번 회차 1등 중 우리 서비스 이용자</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="pt-24 pb-48 px-6 max-w-3xl mx-auto space-y-10">
        {/* Hero Banner */}
        <section className="relative w-full h-44 rounded-lg overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-700 to-yellow-500" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)]" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <span className="text-yellow-200 font-headline font-extrabold tracking-widest text-xs mb-2 uppercase">윈웨이 명예의 전당</span>
            <h2 className="text-white text-2xl font-bold leading-tight">서비스가 예측한<br />1등 당첨 번호 공개</h2>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="font-headline font-bold text-xl">최근 핫 넘버 통계</h3>
                <p className="text-on-surface-variant text-sm">최근 100회차 분석 데이터 기반</p>
              </div>
              <span className="material-symbols-outlined text-primary">monitoring</span>
            </div>
            <div className="flex items-end justify-between h-36 gap-2">
              {hotNumbers.map(({ num, pct }) => (
                <div key={num} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full rounded-t-sm" style={{ height: `${pct}%`, background: pct >= 85 ? 'var(--color-primary, #735c00)' : `rgba(115,92,0,${pct / 120})` }} />
                  <span className={`text-[10px] font-bold ${pct >= 85 ? 'text-primary' : ''}`}>{num}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 bg-primary-container/10 border border-primary-container/20 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-headline font-bold text-xl mb-1">정밀 통계 분석</h3>
              <p className="text-on-surface-variant text-sm">홀짝 비율</p>
            </div>
            <div className="py-4 flex justify-center">
              <div className="relative w-28 h-28 rounded-full border-8 border-surface-container-high flex items-center justify-center">
                <div className="absolute inset-[-8px] rounded-full border-8 border-primary border-r-transparent border-b-transparent rotate-45" />
                <span className="font-headline font-extrabold text-2xl">4:2</span>
              </div>
            </div>
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>홀 67%</span><span>짝 33%</span>
            </div>
          </div>
        </section>

        {/* Winner List Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <h2 className="text-2xl font-bold font-headline tracking-tight">명예의 전당</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            </button>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">sort</span>
            </button>
          </div>
        </div>

        {/* Winner Cards */}
        <div className="space-y-6">
          {winners.map((w) => (
            <article key={w.round} className={`p-6 md:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-container transition-colors
              ${w.serviceWinner ? 'bg-surface-container-low' : 'bg-surface-container-lowest'}`}>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-headline font-extrabold text-2xl tracking-tighter">제{w.round}회차</span>
                  {w.serviceWinner && (
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">🏆 서비스 예측 적중</span>
                  )}
                </div>
                <p className="text-on-surface-variant text-sm">{w.date} 추첨</p>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                {w.numbers.map(n => <NumberBall key={n} n={n} highlight={w.serviceWinner} />)}
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
        <div className="flex justify-center py-6">
          <button className="bg-surface-container-highest text-on-surface font-bold px-10 py-4 rounded-full flex items-center gap-3 hover:bg-surface-variant transition-colors group">
            이전 기록 더보기
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
