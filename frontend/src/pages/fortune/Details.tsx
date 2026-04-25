import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

export default function Details() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="hover:bg-black/5 p-2 rounded-full -ml-2 transition-colors">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">arrow_back</span>
          </button>
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제1150회차</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* New Title Area */}
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">나의 행운 관리</h2>
          <p className="text-sm font-medium text-on-surface-variant mt-2">관리 중인 번호 조합과 당첨 기록입니다</p>
        </div>

        {/* Tab Navigation (Contextual) */}
        <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-md pb-3 pt-2 -mx-2 px-2 mb-6">
          <div className="flex p-1.5 bg-surface-container-low rounded-2xl">
            <button
              onClick={() => navigate('/fortune')}
              className="flex-1 py-3 text-sm font-bold rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all"
            >최근 항목</button>
            <button className="flex-1 py-3 text-sm font-bold rounded-xl bg-surface-container-lowest text-primary shadow-sm transition-all">당첨 항목</button>
          </div>
        </div>

        {/* Header Summary Card: Glassmorphism */}
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
          {/* Winner Card 1 */}
          <article className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_40px_rgba(27,28,25,0.02)] border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-headline font-bold text-on-surface">제1149회차</h3>
                <p className="text-xs text-on-surface-variant font-label">2024년 11월 23일 추첨</p>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20">
                <span className="text-primary font-bold text-sm">3등 당첨</span>
              </div>
            </div>
            <div className="flex gap-2 mb-8 flex-wrap">
              {[7, 12, 19, 23, 31].map(n => (
                <span key={n} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-bold font-headline text-sm winning-glow ring-2 ring-primary-container ring-offset-2">{n}</span>
              ))}
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/40 font-bold font-headline text-sm">45</span>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">당첨 금액</span>
                <span className="text-xl font-bold font-headline text-primary">₩1,540,230</span>
              </div>
              <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high transition-colors px-4 py-2 rounded-full active:scale-95">
                <span className="material-symbols-outlined text-sm">share</span>
                <span className="text-xs font-bold font-label">당첨 소식 공유하기</span>
              </button>
            </div>
          </article>

          {/* Subtle Ad Space */}
          <aside className="py-4 px-6 bg-surface-container-low/50 rounded-xl border border-dashed border-outline-variant/30 text-center">
            <span className="text-[10px] font-label text-on-surface-variant/40 uppercase tracking-[0.2em] block mb-2">광고</span>
            <div className="h-20 flex items-center justify-center overflow-hidden grayscale opacity-50 text-xs text-on-surface-variant/50">
              광고 배너 영역
            </div>
          </aside>

          {/* Winner Card 2 */}
          <article className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_40px_rgba(27,28,25,0.02)] border border-outline-variant/10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-headline font-bold text-on-surface">제1145회차</h3>
                <p className="text-xs text-on-surface-variant font-label">2024년 10월 26일 추첨</p>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20">
                <span className="text-on-surface-variant font-bold text-sm">4등 당첨</span>
              </div>
            </div>
            <div className="flex gap-2 mb-8 flex-wrap">
              {[2, 11, 28].map(n => (
                <span key={n} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-bold font-headline text-sm winning-glow ring-2 ring-primary-container/40 ring-offset-2">{n}</span>
              ))}
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/40 font-bold font-headline text-sm">33</span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-bold font-headline text-sm winning-glow ring-2 ring-primary-container/40 ring-offset-2">39</span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/40 font-bold font-headline text-sm">44</span>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">당첨 금액</span>
                <span className="text-xl font-bold font-headline text-on-surface">₩50,000</span>
              </div>
              <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high transition-colors px-4 py-2 rounded-full active:scale-95">
                <span className="material-symbols-outlined text-sm">share</span>
                <span className="text-xs font-bold font-label">당첨 소식 공유하기</span>
              </button>
            </div>
          </article>

          {/* Winner Card 3 */}
          <article className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_40px_rgba(27,28,25,0.02)] border border-outline-variant/10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-headline font-bold text-on-surface">제1138회차</h3>
                <p className="text-xs text-on-surface-variant font-label">2024년 09월 07일 추첨</p>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/20">
                <span className="text-on-surface-variant font-bold text-sm">5등 당첨</span>
              </div>
            </div>
            <div className="flex gap-2 mb-8 flex-wrap">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-bold font-headline text-sm winning-glow ring-2 ring-primary-container/20 ring-offset-2">1</span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/40 font-bold font-headline text-sm">15</span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-bold font-headline text-sm winning-glow ring-2 ring-primary-container/20 ring-offset-2">22</span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/40 font-bold font-headline text-sm">29</span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-bold font-headline text-sm winning-glow ring-2 ring-primary-container/20 ring-offset-2">35</span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/40 font-bold font-headline text-sm">41</span>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">당첨 금액</span>
                <span className="text-xl font-bold font-headline text-on-surface">₩5,000</span>
              </div>
              <button className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high transition-colors px-4 py-2 rounded-full active:scale-95">
                <span className="material-symbols-outlined text-sm">share</span>
                <span className="text-xs font-bold font-label">당첨 소식 공유하기</span>
              </button>
            </div>
          </article>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
