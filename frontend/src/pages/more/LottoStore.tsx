/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import lottoDB from '../../data/lottoDB.json';

interface ODCloudStoreItem {
  상호?: string;
  도로명주소?: string;
  지번주소?: string;
  번호?: number;
}

interface ODCloudWinningStoreItem {
  "1등 자동 당첨 건수"?: string;
  "1등 수동 당첨 건수"?: string;
  "상호"?: string;
  "순번"?: string;
  "지역"?: string;
}

interface SavedAddress {
  text: string;
  si: string;
  gu: string;
  dong: string;
}

export default function LottoStore() {
  const latestRound = lottoDB[0]?.round || 1225;
  const [activeTab, setActiveTab] = useState<'all' | 'winning'>('all');
  const [loading, setLoading] = useState(true);
  const [rawStores, setRawStores] = useState<ODCloudStoreItem[]>([]);
  const [winningStores, setWinningStores] = useState<ODCloudWinningStoreItem[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 내 주소 관련
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(() => {
    try { return JSON.parse(localStorage.getItem('saved_lotto_address') || 'null'); }
    catch { return null; }
  });
  const [showNearbyFilter, setShowNearbyFilter] = useState(() =>
    !!localStorage.getItem('saved_lotto_address')
  );
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);

  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 카카오 지도 관련
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showTimeoutGuide, setShowTimeoutGuide] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (mapLoaded) { setShowTimeoutGuide(false); return; }
    const timer = setTimeout(() => { if (!mapLoaded) setShowTimeoutGuide(true); }, 5000);
    return () => clearTimeout(timer);
  }, [mapLoaded]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError('');
      try {
        const apiKey = import.meta.env.VITE_DATA_GO_KR_API_KEY;
        if (!apiKey) throw new Error('API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
        const serviceKey = encodeURIComponent(apiKey);
        const urlAll = `/api-lotto-store/api/15086355/v1/uddi:ef7ca84b-c2bc-404a-9743-85752073b61b?page=1&perPage=10000&serviceKey=${serviceKey}`;
        const urlWinning = `/api-lotto-store/api/15059963/v1/uddi:5c8a1e17-cc23-438a-a458-c72197dfce74?page=1&perPage=1000&serviceKey=${serviceKey}`;
        const [resAll, resWinning] = await Promise.all([fetch(urlAll), fetch(urlWinning)]);
        if (!resAll.ok || !resWinning.ok) throw new Error('공공데이터 API 호출 중 일부 요청이 실패했습니다.');
        const [jsonAll, jsonWinning] = await Promise.all([resAll.json(), resWinning.json()]);
        if (jsonAll?.data && jsonWinning?.data) {
          setRawStores(jsonAll.data as ODCloudStoreItem[]);
          setWinningStores(jsonWinning.data as ODCloudWinningStoreItem[]);
        } else {
          throw new Error('데이터 파싱 오류가 발생했습니다.');
        }
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // 카카오 Geocoder로 주소 자동완성 검색
  const searchAddress = useCallback((input: string) => {
    if (!mapLoaded || input.length < 2) { setAddressSuggestions([]); return; }
    const kakao = (window as any).kakao;
    if (!kakao?.maps?.services) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(input, (results: any[], status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        setAddressSuggestions(results.slice(0, 5));
      } else {
        setAddressSuggestions([]);
      }
    });
  }, [mapLoaded]);

  useEffect(() => {
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    addressDebounceRef.current = setTimeout(() => searchAddress(addressInput), 350);
    return () => { if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current); };
  }, [addressInput, searchAddress]);

  const handleSelectAddress = (suggestion: any) => {
    const a = suggestion.address || suggestion.road_address;
    const newAddr: SavedAddress = {
      text: suggestion.address_name,
      si: a?.region_1depth_name || '',
      gu: a?.region_2depth_name || '',
      dong: (a?.region_3depth_name || '').split(' ')[0],
    };
    setSavedAddress(newAddr);
    localStorage.setItem('saved_lotto_address', JSON.stringify(newAddr));
    setAddressInput('');
    setAddressSuggestions([]);
    setShowAddressInput(false);
    setShowNearbyFilter(true);
    setCurrentPage(1);
  };

  const handleDeleteSavedAddress = () => {
    setSavedAddress(null);
    localStorage.removeItem('saved_lotto_address');
    setShowNearbyFilter(false);
  };

  const winningMap = useMemo(() => {
    const map = new Map<string, { auto: number; manual: number }>();
    winningStores.forEach(item => {
      if (item.상호) {
        map.set(item.상호.trim(), {
          auto: parseInt(item['1등 자동 당첨 건수'] || '0', 10),
          manual: parseInt(item['1등 수동 당첨 건수'] || '0', 10),
        });
      }
    });
    return map;
  }, [winningStores]);

  const filteredAllStores = useMemo(() => {
    const mapped = rawStores.map((item: ODCloudStoreItem) => {
      const name = item['상호'] || '이름 없음';
      const address = item['도로명주소'] || item['지번주소'] || '주소 정보 없음';
      const wins = winningMap.get(name.trim()) || { auto: 0, manual: 0 };
      return { name, address, phone: '-', type: '복권 판매점', autoWinners: wins.auto, manualWinners: wins.manual, winners: wins.auto + wins.manual };
    });
    return mapped.sort((a, b) => b.winners - a.winners);
  }, [rawStores, winningMap]);

  const filteredWinningStores = useMemo(() => {
    const mapped = winningStores.map((item: ODCloudWinningStoreItem) => {
      const auto = parseInt(item['1등 자동 당첨 건수'] || '0', 10);
      const manual = parseInt(item['1등 수동 당첨 건수'] || '0', 10);
      return { name: item.상호 || '이름 없음', address: item.지역 || '지역 정보 없음', phone: '-', type: '1등 배출 명당', autoWinners: auto, manualWinners: manual, winners: auto + manual };
    });
    return mapped.sort((a, b) => b.winners - a.winners);
  }, [winningStores]);

  const activeStores = useMemo(() =>
    activeTab === 'all' ? filteredAllStores : filteredWinningStores,
  [activeTab, filteredAllStores, filteredWinningStores]);

  // 내 주변 필터 — 동 > 구 > 시 순서로 텍스트 매칭
  const displayStores = useMemo(() => {
    if (!showNearbyFilter || !savedAddress) return activeStores;
    const { si, gu, dong } = savedAddress;
    return activeStores
      .map(store => {
        let score = 0;
        if (dong && store.address.includes(dong)) score = 3;
        else if (gu && store.address.includes(gu)) score = 2;
        else if (si && store.address.includes(si)) score = 1;
        return { ...store, nearbyScore: score };
      })
      .filter(s => s.nearbyScore > 0)
      .sort((a, b) => b.nearbyScore - a.nearbyScore || b.winners - a.winners);
  }, [activeStores, savedAddress, showNearbyFilter]);

  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayStores.slice(start, start + itemsPerPage);
  }, [displayStores, currentPage]);

  const totalPages = Math.ceil(displayStores.length / itemsPerPage);

  // 카카오 맵 SDK 로드
  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
    if (!kakaoKey) { setDebugInfo('Error: VITE_KAKAO_JAVASCRIPT_KEY is missing'); return; }
    const scriptId = 'kakao-map-sdk';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    const initMap = () => {
      const kakao = (window as any).kakao;
      if (kakao?.maps) {
        if (kakao.maps.Map) { setDebugInfo('Loaded.'); setMapLoaded(true); }
        else kakao.maps.load(() => { setDebugInfo('kakao.maps.load callback triggered. Loaded.'); setMapLoaded(true); });
      }
    };
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => initMap();
      script.onerror = () => setDebugInfo('Error: script failed to load (network/blocked)');
      document.head.appendChild(script);
    } else {
      const kakao = (window as any).kakao;
      if (kakao?.maps) initMap();
      else { script.addEventListener('load', initMap); script.onerror = () => setDebugInfo('Error: existing script failed to load'); }
    }
    return () => { if (script) script.removeEventListener('load', initMap); };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const kakao = (window as any).kakao;
    if (!kakao?.maps) return;
    const map = new kakao.maps.Map(mapRef.current, { center: new kakao.maps.LatLng(37.566826, 126.9786567), level: 4 });
    kakaoMapInstance.current = map;
    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
    infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
  }, [mapLoaded]);

  useEffect(() => {
    if (!kakaoMapInstance.current || paginatedStores.length === 0) return;
    const kakao = (window as any).kakao;
    if (!kakao?.maps) return;
    const map = kakaoMapInstance.current;
    const geocoder = new kakao.maps.services.Geocoder();
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    const bounds = new kakao.maps.LatLngBounds();
    let hasValid = false;
    paginatedStores.forEach((store, index) => {
      const cleanAddr = store.address.split('(')[0].trim();
      geocoder.addressSearch(cleanAddr, (result: any, status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          if (index === 0) { map.setCenter(coords); map.setLevel(5); }
          const marker = new kakao.maps.Marker({ map, position: coords, title: store.name });
          kakao.maps.event.addListener(marker, 'click', () => {
            infoWindowRef.current.setContent(`<div style="padding:10px;min-width:150px;font-family:sans-serif;border:0"><h4 style="margin:0 0 5px;font-size:13px;font-weight:bold;color:#1b1c19">${store.name}</h4><p style="margin:0;font-size:11px;color:#5c5f5a;line-height:1.4">${store.address}</p>${store.winners > 0 ? `<p style="margin:5px 0 0;font-size:10px;font-weight:bold;color:#d97706">🏆 자동 ${store.autoWinners}회 / 수동 ${store.manualWinners}회</p>` : ''}</div>`);
            infoWindowRef.current.open(map, marker);
            map.panTo(coords);
          });
          markersRef.current.push(marker);
          bounds.extend(coords);
          hasValid = true;
          if (hasValid) map.setBounds(bounds);
        }
      });
    });
  }, [paginatedStores]);

  const focusStoreOnMap = (store: any) => {
    if (!kakaoMapInstance.current) return;
    const kakao = (window as any).kakao;
    if (!kakao?.maps) return;
    const map = kakaoMapInstance.current;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(store.address.split('(')[0].trim(), (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.setLevel(3);
        map.panTo(coords);
        infoWindowRef.current.setContent(`<div style="padding:10px;min-width:150px;font-family:sans-serif"><h4 style="margin:0 0 5px;font-size:13px;font-weight:bold;color:#1b1c19">${store.name}</h4><p style="margin:0;font-size:11px;color:#5c5f5a;line-height:1.4">${store.address}</p>${store.winners > 0 ? `<p style="margin:5px 0 0;font-size:10px;font-weight:bold;color:#d97706">🏆 자동 ${store.autoWinners}회 / 수동 ${store.manualWinners}회</p>` : ''}</div>`);
        const matched = markersRef.current.find(m => {
          const p = m.getPosition();
          return Math.abs(p.getLat() - coords.getLat()) < 0.0001 && Math.abs(p.getLng() - coords.getLng()) < 0.0001;
        });
        if (matched) infoWindowRef.current.open(map, matched);
        else { infoWindowRef.current.setPosition(coords); infoWindowRef.current.open(map); }
      }
    });
  };

  const handleTabChange = (tab: 'all' | 'winning') => { setActiveTab(tab); setCurrentPage(1); };

  return (
    <div className="bg-background text-on-surface font-label min-h-screen pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md z-50 shadow-sm">
        <h1 className="text-xl font-black font-headline text-stone-900 dark:text-stone-50 tracking-tighter">Lucky Win</h1>
        <span className="font-headline font-bold text-lg text-amber-600">제{latestRound}회차</span>
      </header>

      <main className="pt-20 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold font-headline tracking-tight text-on-surface">로또 복권 판매소</h2>
          <p className="text-sm text-on-surface-variant mt-1">전국의 로또 복권 판매처를 실시간 공공데이터로 검색해보세요</p>
        </div>

        {/* 내 주변 판매소 카드 */}
        <div className="mb-6 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/15">
          {savedAddress ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">저장된 주소</p>
                    <p className="text-sm font-bold text-on-surface leading-tight">{savedAddress.text}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setShowAddressInput(true); setAddressInput(''); }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-variant active:scale-95 transition-all"
                  >변경</button>
                  <button
                    onClick={handleDeleteSavedAddress}
                    className="p-1 rounded-full text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => { setShowNearbyFilter(v => !v); setCurrentPage(1); }}
                className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  showNearbyFilter
                    ? 'gold-gradient text-white shadow-md shadow-amber-500/20'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: showNearbyFilter ? "'FILL' 1" : "'FILL' 0" }}>near_me</span>
                {showNearbyFilter ? '내 주변 보기 ON' : '내 주변 보기 OFF'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant/60 text-lg">location_off</span>
                <p className="text-sm text-on-surface-variant">주소를 저장하면 주변 판매소를 바로 찾아드립니다</p>
              </div>
              <button
                onClick={() => setShowAddressInput(true)}
                className="w-full py-2.5 rounded-xl font-bold text-sm bg-primary/10 text-primary flex items-center justify-center gap-2 hover:bg-primary/15 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">add_location</span>
                내 주소 설정하기
              </button>
            </div>
          )}

          {/* 주소 입력 + 자동완성 */}
          {showAddressInput && (
            <div className="mt-3 relative z-20">
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-3 py-2.5 border border-primary/40 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-base">search</span>
                <input
                  autoFocus
                  value={addressInput}
                  onChange={e => setAddressInput(e.target.value)}
                  placeholder="예: 서울 마포구 상암동"
                  className="flex-1 bg-transparent text-sm outline-none text-on-surface placeholder:text-on-surface-variant/50"
                />
                <button onClick={() => { setShowAddressInput(false); setAddressInput(''); setAddressSuggestions([]); }}>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
                </button>
              </div>
              {!mapLoaded && addressInput.length > 0 && (
                <p className="text-[11px] text-on-surface-variant mt-1 px-1">카카오 지도 로딩 중... 잠시 후 다시 시도해주세요</p>
              )}
              {addressSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-surface shadow-xl rounded-xl mt-1 border border-outline-variant/20 overflow-hidden">
                  {addressSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={() => handleSelectAddress(s)}
                      className="w-full px-4 py-3 text-left hover:bg-surface-container-low transition-colors flex items-start gap-2 border-b border-outline-variant/10 last:border-0"
                    >
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5 shrink-0">location_on</span>
                      <span className="text-sm text-on-surface leading-tight">{s.address_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1.5 bg-surface-container-low rounded-2xl mb-6">
          <button
            onClick={() => handleTabChange('all')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'all' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >전체 판매소</button>
          <button
            onClick={() => handleTabChange('winning')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'winning' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >🏆 1등 당첨 배출점 랭킹</button>
        </div>

        {/* Kakao Map */}
        <div
          ref={mapRef}
          className="mb-6 bg-surface-container-low rounded-2xl overflow-hidden h-64 border border-outline-variant/10 shadow-inner relative z-10"
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900/50 z-20 px-6 text-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
              <p className="text-xs text-on-surface-variant">카카오 지도를 로드하는 중...</p>
              <p className="text-[9px] text-on-surface-variant/50 mt-1 uppercase tracking-wider font-mono">Status: {debugInfo}</p>
              {showTimeoutGuide && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 rounded-xl text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed max-w-sm">
                  ⚠️ <strong>로딩이 길어지는 경우:</strong> 카카오 개발자 센터의 [내 애플리케이션 &gt; 플랫폼 &gt; Web]에 현재 도메인(<code>https://luckywin.kr</code> 또는 <code>http://localhost:5173</code>)이 등록되어 있는지 확인해주세요.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Store List */}
        {loading ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-on-surface-variant">실시간 공공데이터를 불러오는 중입니다...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-center text-red-700">
            <span className="material-symbols-outlined text-3xl mb-2 text-red-500">warning</span>
            <p className="font-bold">데이터 조회 실패</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {showNearbyFilter && savedAddress
                ? `📍 ${savedAddress.dong || savedAddress.gu} 주변 판매소 ${displayStores.length}개`
                : `${activeTab === 'all' ? '전체 판매소' : '1등 배출 명당'} ${displayStores.length}개`
              }
            </p>

            {/* 주변 검색 결과 없음 */}
            {showNearbyFilter && !loading && displayStores.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">location_off</span>
                <p className="text-sm font-bold text-on-surface-variant">저장된 주소 주변에 판매소가 없습니다</p>
                <p className="text-xs text-on-surface-variant/70">주소를 변경하거나 전체 보기로 전환해보세요</p>
                <button
                  onClick={() => setShowNearbyFilter(false)}
                  className="mt-2 px-5 py-2 text-sm font-bold rounded-full bg-primary/10 text-primary hover:bg-primary/15 active:scale-95 transition-all"
                >전체 판매소 보기</button>
              </div>
            )}

            {paginatedStores.map((store, i) => (
              <article
                key={i}
                onClick={() => focusStoreOnMap(store)}
                className={`rounded-lg p-5 border transition-colors cursor-pointer ${store.winners > 0 ? 'bg-amber-50/70 border-amber-200/60 dark:bg-amber-900/10' : 'bg-surface-container-lowest border-outline-variant/10'} hover:bg-surface-container`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-headline font-bold text-base text-on-surface">{store.name}</h3>
                      {store.winners > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full">
                          🏆 1등 자동 {store.autoWinners}회, 수동 {store.manualWinners}회
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${store.winners > 0 ? 'bg-amber-100 text-amber-800' : 'bg-primary/10 text-primary'}`}>{store.type}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-on-surface-variant/60">location_on</span>
                      {store.address}
                    </p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">navigate_next</span>
                  </button>
                </div>
              </article>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded bg-surface-container-low text-on-surface disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform"
                >이전</button>
                <span className="text-xs font-bold text-on-surface-variant">{currentPage} / {totalPages} 페이지</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 rounded bg-surface-container-low text-on-surface disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform"
                >다음</button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
