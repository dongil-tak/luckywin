import { useState } from 'react';
import BottomNav from '../../components/BottomNav';

interface Store {
  name: string;
  address: string;
  phone: string;
  type: string;
  winners: number;
}

// Sample data – will be replaced with real API
const SAMPLE_STORES: Store[] = [
  { name: '행운복권방', address: '서울 강남구 테헤란로 123', phone: '02-1234-5678', type: '5종', winners: 3 },
  { name: '대박복권방', address: '서울 서초구 서초대로 456', phone: '02-9876-5432', type: '5종', winners: 7 },
  { name: '황금복권방', address: '서울 송파구 올림픽로 789', phone: '02-5555-6666', type: '5종', winners: 1 },
  { name: '노다지복권방', address: '서울 마포구 홍대로 321', phone: '02-3333-4444', type: '5종', winners: 5 },
];

export default function LottoStore() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>(SAMPLE_STORES);
  const [apiNotice, setApiNotice] = useState(true);

  const handleSearch = () => {
    setLoading(true);
    // TODO: Replace with real public data API call
    // GET https://www.nlotto.co.kr/store/... (공공데이터 포털 로또 판매점 API)
    setTimeout(() => {
      setStores(SAMPLE_STORES.filter(s =>
        !query || s.name.includes(query) || s.address.includes(query)
      ));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-background text-on-surface font-label min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-600">analytics</span>
          <h1 className="text-xl font-black text-stone-900 tracking-tighter">윈웨이(Win-Way)</h1>
        </div>
        <span className="font-headline font-bold text-lg text-amber-600">제1150회차</span>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">로또 복권 판매소</h2>
          <p className="text-sm text-on-surface-variant mt-2">내 주변 로또 복권 판매처를 찾아보세요</p>
        </div>

        {/* API Notice */}
        {apiNotice && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 relative">
            <span className="material-symbols-outlined text-amber-600 mt-0.5">info</span>
            <div>
              <p className="text-sm font-bold text-amber-800">공공데이터 API 연동 준비 중</p>
              <p className="text-xs text-amber-700 mt-1">공공데이터 포털의 로또복권 판매소 API와 연동 예정입니다. 현재는 샘플 데이터가 표시됩니다.</p>
            </div>
            <button onClick={() => setApiNotice(false)} className="absolute top-3 right-3 text-amber-400 hover:text-amber-600">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2.5 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="지역 또는 판매소명 검색"
              className="flex-1 bg-transparent text-sm outline-none text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 rounded-full gold-gradient text-white font-bold text-sm active:scale-95 transition-transform"
          >
            검색
          </button>
        </div>

        {/* Map Placeholder */}
        <div className="mb-6 bg-surface-container-low rounded-lg overflow-hidden h-40 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100/50" />
          <div className="relative text-center">
            <span className="material-symbols-outlined text-4xl text-amber-400 block mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
            <p className="text-sm font-medium text-on-surface-variant">지도 API 연동 시 지도 표시</p>
            <p className="text-xs text-on-surface-variant/60">카카오맵 / 네이버맵 연동 예정</p>
          </div>
        </div>

        {/* Store List */}
        {loading ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-on-surface-variant">판매소를 검색 중입니다...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stores.length}개 판매소</p>
            {stores.map((store, i) => (
              <article key={i} className="bg-surface-container-lowest rounded-lg p-5 border border-outline-variant/10 hover:bg-surface-container transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-headline font-bold text-base text-on-surface">{store.name}</h3>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{store.type} 판매</span>
                      {store.winners > 0 && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">🏆 1등 {store.winners}회</span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-on-surface-variant/60">location_on</span>
                      {store.address}
                    </p>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-base text-on-surface-variant/60">phone</span>
                      {store.phone}
                    </p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">navigate_next</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* API Info Card */}
        <div className="mt-10 mb-6 bg-surface-container-low rounded-lg p-6">
          <h3 className="font-headline font-bold text-base mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">api</span>
            API 연동 계획
          </h3>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-green-500">check_circle</span> 공공데이터 포털 로또복권 판매소 API</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-amber-500">pending</span> 위치 기반 주변 판매소 검색</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-amber-500">pending</span> 당첨 판매소 정보 표시</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-on-surface-variant/40">radio_button_unchecked</span> 지도 연동 (카카오맵/네이버맵)</li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
