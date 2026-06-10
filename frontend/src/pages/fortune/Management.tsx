import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import AdSenseBanner from '../../components/AdSenseBanner';
import lottoDB from '../../data/lottoDB.json';

const getNumberColorClass = (n: number) => {
  if (n <= 10) return 'bg-[#facc15] text-[#713f12]';
  if (n <= 20) return 'bg-[#3b82f6] text-white';
  if (n <= 30) return 'bg-[#ef4444] text-white';
  if (n <= 40) return 'bg-[#a1a1aa] text-zinc-900';
  return 'bg-[#10b981] text-white';
};

interface WinningStore {
  rank: number;
  name: string;
  region: string;
  type: string;
}

export default function Management() {
  const latestRound = lottoDB[0];
  
  const [queryRound, setQueryRound] = useState('');
  const [displayRound, setDisplayRound] = useState(latestRound);
  const [searchError, setSearchError] = useState('');
  const [storesForRound, setStoresForRound] = useState<WinningStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchWinningStores = async () => {
      setLoading(true);
      setApiError('');
      setStoresForRound([]);
      try {
        const res = await fetch(`/api/winning-stores?drwNo=${displayRound.round}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || '데이터 로딩 실패');
        setStoresForRound(json.stores || []);
      } catch (err: unknown) {
        console.error(err);
        setApiError(err instanceof Error ? err.message : '데이터 로딩 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchWinningStores();
  }, [displayRound]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const r = parseInt(queryRound.replace(/,/g, ''), 10);
    if (isNaN(r) || r < 1 || r > latestRound.round) {
      setSearchError(`1회부터 ${latestRound.round}회 사이의 숫자를 입력해주세요.`);
      return;
    }
    const found = lottoDB.find(item => item.round === r);
    if (found) {
      setDisplayRound(found);
      setSearchError('');
    } else {
      setSearchError('해당 회차 정보를 찾을 수 없습니다.');
    }
  };

  const showLatest = () => {
    setDisplayRound(latestRound);
    setQueryRound('');
    setSearchError('');
  };

  const drawDateObj = new Date(displayRound.drawDate);
  const formattedDate = `${drawDateObj.getFullYear()}년 ${drawDateObj.getMonth() + 1}월 ${drawDateObj.getDate()}일`;

  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      {/* Top Navigation Shell */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 flex items-center justify-between bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm shadow-stone-200/50 z-50 px-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" data-icon="analytics">analytics</span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter">Lucky Win</h1>
        </div>
        <div className="flex items-center">
          <span className="font-headline font-bold text-lg tracking-tight text-amber-600 dark:text-amber-400">제{latestRound.round}회차</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="mb-2">
          <h1 className="text-xl font-bold font-headline tracking-tight text-on-surface mb-2">금주의 당첨현황</h1>
          <p className="text-on-surface-variant text-sm font-medium">이번 주 당첨 결과를 분석하고 서비스 성과를 확인하세요.</p>
        </div>

        {/* 0. 회차 검색 영역 */}
        <section className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/15 shadow-sm">
          <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-lg">search</span>
            역대 당첨번호 회차 검색 (1회 ~ {latestRound.round}회)
          </h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="검색할 회차 입력 (예: 500)"
              value={queryRound}
              onChange={(e) => setQueryRound(e.target.value)}
              className="flex-1 bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/20 text-sm outline-none placeholder:text-on-surface-variant/40"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold active:scale-95 transition-transform whitespace-nowrap"
            >
              조회
            </button>
            {displayRound.round !== latestRound.round && (
              <button
                type="button"
                onClick={showLatest}
                className="px-4 py-2.5 bg-surface-container-highest text-on-surface rounded-xl text-sm font-bold active:scale-95 transition-transform whitespace-nowrap"
              >
                최신회차
              </button>
            )}
          </form>
          {searchError && (
            <p className="text-xs text-red-500 font-bold mt-2 ml-1">{searchError}</p>
          )}
        </section>

        {/* 1. 이번주 당첨 정보 Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_15px_40px_rgba(27,28,25,0.03)] border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[40px] -mr-10 -mt-10 rounded-full"></div>
          
          <div className="flex justify-between items-start mb-6 align-top">
            <div>
              <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                {displayRound.round === latestRound.round ? '최신 회차' : '검색 결과'}
              </p>
              <h3 className="font-headline font-extrabold text-2xl text-on-surface">제{displayRound.round}회 당첨번호</h3>
              <p className="text-xs font-medium text-on-surface-variant/70 tracking-wide mt-1">추첨일 : {formattedDate}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Numbers */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {displayRound.numbers.map((n, i) => (
                <div key={i} className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-black text-sm sm:text-lg shadow-sm ring-2 ring-white ${getNumberColorClass(n)}`}>
                  {n.toString().padStart(2, '0')}
                </div>
              ))}
              <div className="w-5 flex justify-center text-on-surface-variant/40 mx-0.5"><span className="material-symbols-outlined font-black">add</span></div>
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-black text-sm sm:text-lg shadow-inner ring-4 ring-primary/20 ${getNumberColorClass(displayRound.bonus)} relative overflow-hidden`}>
                {displayRound.bonus.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="h-px bg-surface-container-high w-full"></div>

            {/* Prize Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low rounded-2xl p-4 text-center">
                <p className="text-[11px] font-bold text-on-surface-variant mb-1 whitespace-nowrap">1등 당첨인원</p>
                <p className="font-headline font-black text-base sm:text-xl text-on-surface whitespace-nowrap">{displayRound.winners}명</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 text-center border border-amber-200/50">
                <p className="text-[11px] font-bold text-amber-700/80 dark:text-amber-500 mb-1 whitespace-nowrap">1등 당첨금액 (1인당)</p>
                <p className="font-headline font-black text-base sm:text-xl text-amber-600 dark:text-amber-400 whitespace-nowrap">
                  {displayRound.prizeAmount >= 100000000 
                    ? `${Math.floor(displayRound.prizeAmount / 100000000)}억 ${Math.floor((displayRound.prizeAmount % 100000000) / 10000).toLocaleString()}만원`
                    : `${displayRound.prizeAmount.toLocaleString()}원`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ad — 당첨번호와 당첨점 정보 사이 */}
        <AdSenseBanner client="ca-pub-4554368744270377" slot="1076190784" format="fluid" layoutKey="-hi-7+2w-11-86" />

        {/* 2. 1등 당첨점 정보 Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_15px_40px_rgba(27,28,25,0.03)] border border-outline-variant/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <h3 className="font-headline font-extrabold text-lg text-on-surface">
                1등 당첨점 정보
                {!loading && storesForRound.length > 0 && (
                  <span className="ml-2 text-sm font-medium text-on-surface-variant">({storesForRound.length}개소)</span>
                )}
              </h3>
            </div>
            <Link to="/lotto-store" className="text-xs font-bold text-primary hover:underline">내 주변보기</Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center py-6 gap-2">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-on-surface-variant">1등 당첨점 정보를 불러오는 중...</p>
              </div>
            ) : apiError ? (
              <p className="text-xs text-center text-red-500 py-4 font-semibold">{apiError}</p>
            ) : storesForRound.length === 0 ? (
              <p className="text-xs text-center text-on-surface-variant py-4">제{displayRound.round}회차 1등 당첨점 정보를 불러오지 못했습니다.</p>
            ) : (
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {storesForRound.map((store, i) => (
                  <div key={i} className="bg-surface-container-low/50 hover:bg-surface-container-low transition-colors rounded-2xl p-4 flex items-center justify-between group cursor-default border border-transparent hover:border-outline-variant/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center shrink-0">
                        <span className="text-amber-600 font-black text-xs">{store.rank}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{store.name}</h4>
                        <p className="text-[11px] text-on-surface-variant truncate max-w-[180px] sm:max-w-xs">{store.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${
                        store.type === '자동' ? 'bg-sky-100 text-sky-700' :
                        store.type === '수동' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>{store.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-3 flex justify-center">
               <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                 <span className="material-symbols-outlined text-[12px]">info</span>
                 공식 당첨 판매점 정보는 동행복권에서 실시간으로 제공됩니다.
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
