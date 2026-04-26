import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

const getNumberColorClass = (n: number) => {
  if (n <= 10) return 'bg-[#facc15] text-[#713f12]';
  if (n <= 20) return 'bg-[#3b82f6] text-white';
  if (n <= 30) return 'bg-[#ef4444] text-white';
  if (n <= 40) return 'bg-[#a1a1aa] text-zinc-900';
  return 'bg-[#10b981] text-white';
};

// 가상의 1등 판매점 데이터
const mockStores = [
  { name: "대박천하 장미상가점", address: "서울 송파구 올림픽로 35", type: "자동" },
  { name: "로또명당 스타복권", address: "경기 수원시 팔달구 매산로 1", type: "수동" },
  { name: "행운을주는곳", address: "부산 해운대구 센텀시티로 2", type: "반자동" },
];

export default function Management() {
  const latestRound = lottoDB[0]; // 최신 데이터 (1221회)
  const drawDateObj = new Date(latestRound.drawDate);
  const formattedDate = `${drawDateObj.getFullYear()}년 ${drawDateObj.getMonth() + 1}월 ${drawDateObj.getDate()}일`;

  // 모의 적중률 데이터 
  // 실제 백엔드가 없으므로, 프리미엄 UI 표현용으로 83% (당첨번호 6/6, 보너스 0)와 같은 시뮬레이티드 데이터 사용
  const hitRate = 83; // 83%

  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      {/* Top Navigation Shell */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50 px-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <div className="flex items-center">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제{latestRound.round}회차</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-2">금주의 당첨현황</h1>
          <p className="text-on-surface-variant text-sm font-medium">이번 주 당첨 결과를 분석하고 서비스 성과를 확인하세요.</p>
        </div>

        {/* 1. 이번주 당첨 정보 Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_15px_40px_rgba(27,28,25,0.03)] border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[40px] -mr-10 -mt-10 rounded-full"></div>
          
          <div className="flex justify-between items-start mb-6 align-top">
            <div>
              <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Winning Info</p>
              <h3 className="font-headline font-extrabold text-2xl text-on-surface">제{latestRound.round}회 당첨번호</h3>
              <p className="text-xs font-medium text-on-surface-variant/70 tracking-wide mt-1">추첨일 : {formattedDate}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Numbers */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {latestRound.numbers.map((n, i) => (
                <div key={i} className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-black text-sm sm:text-lg shadow-sm ring-2 ring-white ${getNumberColorClass(n)}`}>
                  {n.toString().padStart(2, '0')}
                </div>
              ))}
              <div className="w-5 flex justify-center text-on-surface-variant/40 mx-0.5"><span className="material-symbols-outlined font-black">add</span></div>
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-black text-sm sm:text-lg shadow-inner ring-4 ring-primary/20 ${getNumberColorClass(latestRound.bonus)} relative overflow-hidden`}>
                {latestRound.bonus.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="h-px bg-surface-container-high w-full"></div>

            {/* Prize Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low rounded-2xl p-4 text-center">
                <p className="text-[11px] font-bold text-on-surface-variant mb-1">1등 당첨인원</p>
                <p className="font-headline font-black text-xl text-on-surface">{latestRound.winners}명</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 text-center border border-amber-200/50">
                <p className="text-[11px] font-bold text-amber-700/80 dark:text-amber-500 mb-1">1등 당첨금액 (1인당)</p>
                <p className="font-headline font-black text-xl text-amber-600 dark:text-amber-400">
                  {Math.floor(latestRound.prizeAmount / 100000000)}억 {(latestRound.prizeAmount % 100000000).toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 우리 서비스의 적중률 Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_15px_40px_rgba(27,28,25,0.03)] border border-outline-variant/10 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>donut_large</span>
            </div>
            <div>
              <h3 className="font-headline font-extrabold text-lg text-on-surface">우리 서비스의 적중률</h3>
              <p className="text-[11px] font-medium text-on-surface-variant">모든 유저 생성 조합 중 1등 번호 포함 비율</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4 relative">
             <div className="relative w-32 h-32 flex items-center justify-center">
               {/* Background SVG Circle */}
               <svg className="w-full h-full -rotate-90">
                 <circle
                   cx="64"
                   cy="64"
                   r="56"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="12"
                   className="text-surface-container"
                 />
                 <circle
                   cx="64"
                   cy="64"
                   r="56"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="12"
                   strokeDasharray={`${2 * Math.PI * 56}`}
                   strokeDashoffset={`${2 * Math.PI * 56 * (1 - hitRate / 100)}`}
                   strokeLinecap="round"
                   className="text-primary transition-all duration-1000 ease-out"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="font-headline font-black text-3xl text-primary">{hitRate}<span className="text-lg">%</span></span>
                 <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                   Very High <span className="material-symbols-outlined text-[10px] text-green-500">trending_up</span>
                 </span>
               </div>
             </div>
             
             <div className="w-full mt-8 bg-surface-container-low rounded-xl p-4 flex justify-between items-center text-sm border border-outline-variant/10">
               <div>
                  <span className="flex items-center gap-1.5 font-bold text-on-surface"><span className="w-2 h-2 rounded-full bg-primary"></span>1등 추천 (6개 번호 일치)</span>
                  <p className="text-xs text-on-surface-variant ml-3.5 mt-0.5">이번 주 총 138건 도출</p>
               </div>
               <span className="font-black text-primary bg-primary-container/30 px-3 py-1 rounded-full">상위 1% 성과</span>
             </div>
          </div>
        </div>

        {/* 3. 1등 당첨점 정보 Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_15px_40px_rgba(27,28,25,0.03)] border border-outline-variant/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <h3 className="font-headline font-extrabold text-lg text-on-surface">1등 당첨점 정보</h3>
            </div>
            <Link to="/lotto-store" className="text-xs font-bold text-primary hover:underline">내 주변보기</Link>
          </div>

          <div className="space-y-3">
            {mockStores.map((store, i) => (
              <div key={i} className="bg-surface-container-low/50 hover:bg-surface-container-low transition-colors rounded-2xl p-4 flex items-center justify-between group cursor-default border border-transparent hover:border-outline-variant/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-500">military_tech</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{store.name}</h4>
                    <p className="text-[11px] text-on-surface-variant truncate max-w-[180px] sm:max-w-xs">{store.address}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${
                  store.type === '자동' ? 'bg-sky-100 text-sky-700' :
                  store.type === '수동' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>{store.type}</span>
              </div>
            ))}
            
            <div className="pt-3 flex justify-center">
               <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                 <span className="material-symbols-outlined text-[12px]">info</span>
                 공식 당첨 판매점 정보는 동행복권 데이터 연동 준비 중입니다.
               </span>
            </div>
          </div>
        </div>

      </main>

      <BottomNav />
      {/* Decorative Bottom Spacer for Desktop */}
      <div className="hidden md:block h-20"></div>
    </div>
  );
}
