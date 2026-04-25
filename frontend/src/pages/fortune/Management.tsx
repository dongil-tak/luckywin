import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

export default function Management() {
  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      {/* Top Navigation Shell */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
            <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제1150회차</span>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-2">나의 행운 관리</h1>
          <p className="text-on-surface-variant text-sm font-medium">관리 중인 번호 조합과 당첨 기록입니다.</p>
        </div>

        {/* Sticky Filter Tabs */}
        <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md pb-4 pt-2 -mx-2 px-2">
          <div className="flex p-1.5 bg-surface-container-low rounded-2xl">
            <button className="flex-1 py-3 text-sm font-bold rounded-xl bg-surface-container-lowest text-primary shadow-sm transition-all">최근 항목</button>
            <Link to="/fortune/winning" className="flex-1 py-3 text-sm font-bold rounded-xl text-on-surface-variant hover:text-on-surface transition-all text-center">당첨 항목</Link>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-6 mt-6">
          {/* History Card: Winner */}
          <Link to="/fortune/details" className="block">
            <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_30px_rgba(27,28,25,0.02)] border border-outline-variant/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-headline font-extrabold text-lg text-on-surface">제1149회차</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-primary-container text-on-primary-container">당첨</span>
                  </div>
                  <p className="text-[11px] font-medium text-on-surface-variant/70 tracking-wide">생성일: 2024.10.26</p>
                </div>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">ios_share</span>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#facc15] text-white shadow-sm ring-2 ring-white">7</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#facc15] text-white shadow-sm ring-2 ring-white">10</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#3b82f6] text-white shadow-sm ring-2 ring-white">12</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#3b82f6] text-white shadow-sm ring-2 ring-white">19</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#ef4444] text-white shadow-sm ring-2 ring-white">23</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#a855f7] text-white shadow-sm ring-2 ring-white">34</div>
                  </div>
                  <span className="text-[10px] font-bold text-primary-container">4등 당첨</span>
                </div>
                <div className="h-px bg-surface-container-high w-full opacity-50"></div>
                <div className="flex items-center justify-center py-1">
                  <span className="text-[11px] font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-all">
                      외 4개 세트 더보기
                      <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Ad Space Placeholder */}
          <div className="bg-surface-container-low rounded-lg h-24 flex items-center justify-center border-2 border-dashed border-outline-variant/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/40 mb-1">광고</p>
              <p className="text-xs font-medium text-on-surface-variant/60">구글 애드센스 영역</p>
            </div>
          </div>

          {/* History Card: Missed */}
          <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_30px_rgba(27,28,25,0.02)] border border-outline-variant/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-headline font-extrabold text-lg text-on-surface">제1148회차</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-surface-container-highest text-on-surface-variant">낙첨</span>
                </div>
                <p className="text-[11px] font-medium text-on-surface-variant/70 tracking-wide">생성일: 2024.10.19</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40">history</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between opacity-60 grayscale-[0.5]">
                <div className="flex gap-1.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#3b82f6] text-white">11</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#ef4444] text-white">22</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#ef4444] text-white">28</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#a855f7] text-white">31</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#10b981] text-white">42</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#10b981] text-white">45</div>
                </div>
              </div>
            </div>
          </div>

          {/* History Card: Upcoming */}
          <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_10px_30px_rgba(27,28,25,0.02)] border border-primary-container/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-headline font-extrabold text-lg text-on-surface">제1150회차</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-700">대기 중</span>
                </div>
                <p className="text-[11px] font-medium text-on-surface-variant/70 tracking-wide">생성일: 2024.10.30</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-blue-600">추첨 2일 전</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#facc15] text-white">2</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#3b82f6] text-white">15</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#ef4444] text-white">24</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#ef4444] text-white">29</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#a855f7] text-white">38</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#10b981] text-white">41</div>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">more_vert</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination/Load More */}
        <div className="mt-12 flex justify-center">
          <button className="px-8 py-3 bg-surface-container-high rounded-full text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest transition-all flex items-center gap-2">
            이전 기록 더보기
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        </div>
      </main>

      <BottomNav />
      {/* Decorative Bottom Spacer for Desktop */}
      <div className="hidden md:block h-20"></div>
    </div>
  );
}
