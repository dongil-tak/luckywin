import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

export default function Storage() {
  return (
    <div className="bg-surface text-on-surface font-label min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md z-50 shadow-sm shadow-stone-200/50 dark:shadow-none">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-['Manrope'] font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제1150회차</span>
          <button className="hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined text-stone-500" data-icon="search">search</span>
          </button>
        </div>
      </header>
      
      <main className="pt-24 pb-48 px-6 max-w-5xl mx-auto space-y-10">
        {/* Type A Banner (Large Top) */}
        <section className="relative w-full h-48 rounded-lg overflow-hidden group">
          <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Luxurious golden particles" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8qvT4igSgaUc-pphYvn2EiZ6hfEMgyWJMCpN2lMARDzvu4wxVHgf2TZirn0LUhnaEhfAPOoPmNKoQ77OcmstBr1EmHov2KrOW8aH0fvkS5_ZodrK59A3uRBn3chcQjT85SRo8zck4qTdrb6fQPZu-iogkLTetkbmUi8oNiWwsAjYX1jMsKbCuo5AyWMwDzPm6zIk1nzpOVQ84Zj5uDMezEOApXfQVBGk6GFo--D01i0Rz6mzKl2qzoVkbyEJZwSqZ2e0YQSSKKWw" />
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 to-transparent flex flex-col justify-center px-10">
            <span className="text-primary-fixed font-headline font-extrabold tracking-widest text-xs mb-2">프리미엄 분석</span>
            <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight max-w-md">AI 기반 예측 모델로 당첨 확률을 높이세요</h2>
            <div className="mt-4">
              <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-primary/20 transition-all">멤버십 둘러보기</button>
            </div>
          </div>
        </section>

        {/* Frequency Charts */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-8 shadow-sm">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-headline font-bold text-xl">최근 핫 넘버 통계</h3>
                <p className="text-on-surface-variant text-sm">최근 100회차 분석 데이터 기반</p>
              </div>
              <span className="material-symbols-outlined text-primary" data-icon="monitoring">monitoring</span>
            </div>
            <div className="flex items-end justify-between h-40 gap-2 overflow-x-auto pb-2 hide-scrollbar">
              <div className="flex flex-col items-center gap-2 flex-1 min-w-[32px]">
                <div className="w-full bg-primary-container/20 rounded-t-sm h-[40%]"></div>
                <span className="text-[10px] font-bold">07</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 min-w-[32px]">
                <div className="w-full bg-primary-container/40 rounded-t-sm h-[65%]"></div>
                <span className="text-[10px] font-bold">12</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 min-w-[32px]">
                <div className="w-full bg-primary rounded-t-sm h-[90%]"></div>
                <span className="text-[10px] font-bold text-primary">23</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 min-w-[32px]">
                <div className="w-full bg-primary-container/30 rounded-t-sm h-[55%]"></div>
                <span className="text-[10px] font-bold">29</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 min-w-[32px]">
                <div className="w-full bg-primary-container/60 rounded-t-sm h-[75%]"></div>
                <span className="text-[10px] font-bold">33</span>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 min-w-[32px]">
                <div className="w-full bg-primary/80 rounded-t-sm h-[85%]"></div>
                <span className="text-[10px] font-bold">41</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 bg-primary-container/10 border border-primary-container/20 rounded-lg p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-headline font-bold text-xl mb-1">정밀 통계 분석</h3>
              <p className="text-on-surface-variant text-sm">홀짝 비율</p>
            </div>
            <div className="py-6 flex justify-center">
              <div className="relative w-32 h-32 rounded-full border-8 border-surface-container-high flex items-center justify-center">
                <div className="absolute inset-[-8px] rounded-full border-8 border-primary border-r-transparent border-b-transparent rotate-45"></div>
                <span className="font-headline font-extrabold text-2xl">4:2</span>
              </div>
            </div>
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>홀 67%</span>
              <span>짝 33%</span>
            </div>
          </div>
        </section>

        {/* Result List Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <h2 className="text-2xl font-bold font-headline tracking-tight">명예의 전당</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant" data-icon="filter_list">filter_list</span>
            </button>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant" data-icon="sort">sort</span>
            </button>
          </div>
        </div>

        {/* Result List */}
        <div className="space-y-6">
          <Link to="/fortune/details" className="block">
            <article className="bg-surface-container-low p-6 md:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-container transition-colors group">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-headline font-extrabold text-2xl tracking-tighter">제1149회차</span>
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">서비스 추천 당첨</span>
                </div>
                <p className="text-on-surface-variant text-sm">추첨일: 2024년 10월 26일</p>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-sm ring-1 ring-primary/20">3</div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-sm ring-1 ring-primary/20">11</div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-sm ring-1 ring-primary/20">21</div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-sm ring-1 ring-primary/20">34</div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-sm ring-1 ring-primary/20">40</div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-headline font-bold shadow-sm ring-1 ring-primary/20">45</div>
                <div className="flex items-center px-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-surface-container-highest border-2 border-primary-container text-primary font-headline font-extrabold">22</div>
              </div>
              <button className="bg-surface-container-highest p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
              </button>
            </article>
          </Link>

          {/* Ad In-feed */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-4 flex flex-col items-center justify-center min-h-[100px] overflow-hidden">
            <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest mb-2 self-start">광고</span>
            <div className="w-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center py-6 rounded">
              <div className="text-center">
                <span className="material-symbols-outlined text-stone-300 block mb-1" data-icon="ads_click">ads_click</span>
                <p className="text-stone-400 text-xs font-medium">구글 애드센스</p>
              </div>
            </div>
          </div>

          <article className="bg-surface-container-lowest p-6 md:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-container transition-colors group">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-headline font-extrabold text-2xl tracking-tighter text-on-surface/80">제1148회차</span>
              </div>
              <p className="text-on-surface-variant text-sm">추첨일: 2024년 10월 19일</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[7, 12, 13, 29, 33, 42].map(n => (
                <div key={n} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-headline font-bold">{n}</div>
              ))}
              <div className="flex items-center px-1 text-on-surface-variant"><span className="material-symbols-outlined text-lg" data-icon="add">add</span></div>
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-surface-container-highest border border-outline-variant text-on-surface-variant font-headline font-bold">5</div>
            </div>
          </article>

          {/* Type B Banner */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="bg-surface-dim rounded-lg p-8 flex items-center gap-6 overflow-hidden relative">
              <div className="z-10 flex flex-col">
                <h4 className="font-headline font-bold text-lg mb-2 text-on-surface">행운의 번호 10</h4>
                <p className="text-sm text-on-surface-variant mb-4">다음 회차를 위한 알고리즘의 최적 선택입니다.</p>
                <button className="bg-white text-on-surface px-4 py-2 rounded-full text-xs font-bold w-max">번호 받기</button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-9xl" data-icon="psychology" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-container to-primary rounded-lg p-8 flex flex-col justify-center text-white">
              <h4 className="font-headline font-bold text-lg mb-2">예상 당첨금</h4>
              <p className="text-2xl font-black mb-1">₩24,850,230,000</p>
              <p className="text-xs opacity-80 uppercase tracking-widest">1등 예상 당첨 금액</p>
            </div>
          </section>

          <article className="bg-surface-container-lowest p-6 md:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-container transition-colors group">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-headline font-extrabold text-2xl tracking-tighter text-on-surface/80">제1147회차</span>
                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">서비스 추천 당첨</span>
              </div>
              <p className="text-on-surface-variant text-sm">추첨일: 2024년 10월 12일</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[1, 4, 19, 31, 39, 44].map(n => (
                <div key={n} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-headline font-bold">{n}</div>
              ))}
              <div className="flex items-center px-1 text-on-surface-variant"><span className="material-symbols-outlined text-lg" data-icon="add">add</span></div>
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-surface-container-highest border border-outline-variant text-on-surface-variant font-headline font-bold">2</div>
            </div>
          </article>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
