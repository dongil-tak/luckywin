import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false);
  const { pathname } = useLocation();

  const isDashboard = pathname === '/dashboard' || pathname === '/dashboard/analysis';
  const isResults   = pathname === '/dashboard/results';
  const isFortune   = pathname.startsWith('/fortune');

  const activeClass   = 'gold-gradient text-white rounded-full p-3 shadow-lg';
  const inactiveClass = 'text-[#4d4635] dark:text-[#a09a8a] p-2 hover:text-[#735c00] transition-colors';

  return (
    <>
      {/* Bottom Sheet Backdrop */}
      {showMore && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl px-6 pt-5 pb-10 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-outline-variant/50 rounded-full mx-auto mb-6"></div>
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">메뉴</h3>
            <div className="space-y-1">
              <Link
                to="/saved"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-700" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">저장된 번호</p>
                  <p className="text-xs text-on-surface-variant">저장된 번호 조합을 확인합니다</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/40 ml-auto">chevron_right</span>
              </Link>
              <Link
                to="/lucky-history"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-yellow-700" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">행운의 기록들</p>
                  <p className="text-xs text-on-surface-variant">서비스가 예측한 1등 번호를 공개합니다</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/40 ml-auto">chevron_right</span>
              </Link>
              <Link
                to="/lotto-store"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-700" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">로또 복권 판매소</p>
                  <p className="text-xs text-on-surface-variant">내 주변 복권 판매처를 찾아보세요</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/40 ml-auto">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#fbf9f4]/80 dark:bg-[#1b1c19]/80 backdrop-blur-xl rounded-t-[2rem] shadow-[0_-4px_40px_rgba(27,28,25,0.06)]">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center active:scale-90 duration-200 ${isDashboard ? activeClass : inactiveClass}`}
        >
          <span className="material-symbols-outlined" style={isDashboard ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-wide mt-1">스마트번호생성</span>
        </Link>

        <Link
          to="/dashboard/results"
          className={`flex flex-col items-center justify-center active:scale-90 duration-200 ${isResults ? activeClass : inactiveClass}`}
        >
          <span className="material-symbols-outlined mb-1" style={isResults ? { fontVariationSettings: "'FILL' 1" } : {}}>history</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-wide">AI 분석번호</span>
        </Link>

        <Link
          to="/fortune"
          className={`flex flex-col items-center justify-center active:scale-90 duration-200 ${isFortune ? activeClass : inactiveClass}`}
        >
          <span className="material-symbols-outlined mb-1" style={isFortune ? { fontVariationSettings: "'FILL' 1" } : {}}>military_tech</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-wide">당첨 결과</span>
        </Link>

        <button
          onClick={() => setShowMore(true)}
          className={`flex flex-col items-center justify-center active:scale-90 duration-200 ${inactiveClass}`}
        >
          <span className="material-symbols-outlined mb-1">more_horiz</span>
          <span className="font-headline text-[10px] font-semibold uppercase tracking-wide">더보기</span>
        </button>
      </nav>
    </>
  );
}
