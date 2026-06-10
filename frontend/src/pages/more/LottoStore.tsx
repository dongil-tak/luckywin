/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useRef } from 'react';
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
  "상호"?: string;
  "순번"?: string;
  "지역"?: string;
}

export default function LottoStore() {
  const latestRound = lottoDB[0]?.round || 1225;
  const [activeTab, setActiveTab] = useState<'all' | 'winning'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [rawStores, setRawStores] = useState<ODCloudStoreItem[]>([]);
  const [winningStores, setWinningStores] = useState<ODCloudWinningStoreItem[]>([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 카카오 지도 관련 상태 및 Ref
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showTimeoutGuide, setShowTimeoutGuide] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    if (mapLoaded) {
      setShowTimeoutGuide(false);
      return;
    }
    const timer = setTimeout(() => {
      if (!mapLoaded) {
        setShowTimeoutGuide(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [mapLoaded]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError('');
      try {
        const apiKey = import.meta.env.VITE_DATA_GO_KR_API_KEY;
        if (!apiKey) {
          throw new Error('API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
        }

        const serviceKey = encodeURIComponent(apiKey);
        
        // 1. 전체 판매소 API URL
        const urlAll = `/api-lotto-store/api/15086355/v1/uddi:ef7ca84b-c2bc-404a-9743-85752073b61b?page=1&perPage=10000&serviceKey=${serviceKey}`;
        
        // 2. 1등 당첨 판매점 API URL
        const urlWinning = `/api-lotto-store/api/15059963/v1/uddi:5c8a1e17-cc23-438a-a458-c72197dfce74?page=1&perPage=1000&serviceKey=${serviceKey}`;

        const [resAll, resWinning] = await Promise.all([
          fetch(urlAll),
          fetch(urlWinning)
        ]);

        if (!resAll.ok || !resWinning.ok) {
          throw new Error('공공데이터 API 호출 중 일부 요청이 실패했습니다.');
        }

        const [jsonAll, jsonWinning] = await Promise.all([
          resAll.json(),
          resWinning.json()
        ]);

        if (jsonAll && jsonAll.data && jsonWinning && jsonWinning.data) {
          setRawStores(jsonAll.data as ODCloudStoreItem[]);
          setWinningStores(jsonWinning.data as ODCloudWinningStoreItem[]);
        } else {
          throw new Error('데이터 파싱 오류가 발생했습니다.');
        }
      } catch (err: unknown) {
        console.error(err);
        const errMsg = err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.';
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // 1등 당첨점 맵핑 정보 (상호명 -> 건수)
  const winningMap = useMemo(() => {
    const map = new Map<string, number>();
    winningStores.forEach(item => {
      if (item.상호) {
        const count = parseInt(item['1등 자동 당첨 건수'] || '0', 10);
        map.set(item.상호.trim(), count);
      }
    });
    return map;
  }, [winningStores]);

  // 검색 필터링 및 1등 판매점 우선 노출
  const filteredAllStores = useMemo(() => {
    const mapped = rawStores.map((item: ODCloudStoreItem) => {
      const name = item['상호'] || '이름 없음';
      const address = item['도로명주소'] || item['지번주소'] || '주소 정보 없음';
      const wins = winningMap.get(name.trim()) || 0;

      return {
        name,
        address,
        phone: '-',
        type: '온라인복권',
        winners: wins
      };
    });

    const filtered = mapped.filter(s => 
      !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.address.toLowerCase().includes(query.toLowerCase())
    );

    // 1등 당첨 건수가 많은 지점이 최상단에 오도록 정렬
    return filtered.sort((a, b) => b.winners - a.winners);
  }, [rawStores, winningMap, query]);

  // 1등 배출점 랭킹 리스트 (Tab 2용)
  const filteredWinningStores = useMemo(() => {
    const mapped = winningStores.map((item: ODCloudWinningStoreItem) => ({
      name: item.상호 || '이름 없음',
      address: item.지역 || '지역 정보 없음',
      phone: '-',
      type: '1등 배출 명당',
      winners: parseInt(item['1등 자동 당첨 건수'] || '0', 10)
    }));

    const filtered = mapped.filter(s => 
      !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.address.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.sort((a, b) => b.winners - a.winners);
  }, [winningStores, query]);

  // 현재 활성화된 탭에 따른 데이터
  const activeStores = useMemo(() => {
    return activeTab === 'all' ? filteredAllStores : filteredWinningStores;
  }, [activeTab, filteredAllStores, filteredWinningStores]);

  // 페이지네이션 처리
  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return activeStores.slice(startIndex, startIndex + itemsPerPage);
  }, [activeStores, currentPage]);

  const totalPages = Math.ceil(activeStores.length / itemsPerPage);

  // 카카오 맵 SDK 스크립트 로드
  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
    if (!kakaoKey) {
      setDebugInfo('Error: VITE_KAKAO_JAVASCRIPT_KEY is missing');
      return;
    }

    const scriptId = 'kakao-map-sdk';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initMap = () => {
      const kakao = (window as any).kakao;
      if (kakao && kakao.maps) {
        setDebugInfo('Kakao SDK found. Initializing maps...');
        if (kakao.maps.Map) {
          setDebugInfo('Map constructor exists. Loaded.');
          setMapLoaded(true);
        } else {
          setDebugInfo('Map constructor missing. Loading manually...');
          kakao.maps.load(() => {
            setDebugInfo('kakao.maps.load callback triggered. Loaded.');
            setMapLoaded(true);
          });
        }
      } else {
        setDebugInfo('Error: window.kakao or window.kakao.maps is missing in initMap');
      }
    };

    if (!script) {
      setDebugInfo('Creating script tag...');
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        setDebugInfo('Script onload event triggered.');
        initMap();
      };
      script.onerror = () => {
        setDebugInfo('Error: script failed to load (network/blocked)');
      };
      document.head.appendChild(script);
    } else {
      setDebugInfo('Script tag already exists.');
      const kakao = (window as any).kakao;
      if (kakao && kakao.maps) {
        initMap();
      } else {
        setDebugInfo('Script exists but kakao not defined, waiting for load event...');
        script.addEventListener('load', initMap);
        script.onerror = () => {
          setDebugInfo('Error: existing script failed to load');
        };
      }
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initMap);
      }
    };
  }, []);

  // 지도 객체 생성 및 기본 설정
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) return;

    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울시청 기준
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);
    kakaoMapInstance.current = map;

    // 줌 컨트롤러 추가
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
  }, [mapLoaded]);

  // 페이지에 맞는 마커 표시 및 맵 바운드 조절
  useEffect(() => {
    if (!kakaoMapInstance.current || paginatedStores.length === 0) return;

    const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) return;

    const map = kakaoMapInstance.current;
    const geocoder = new kakao.maps.services.Geocoder();

    // 기존 마커 초기화
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();
    let hasValidMarker = false;

    // 주소 검색을 통한 마커 배치 (index 0 = 첫번째 명당 → 초기 지도 중심)
    paginatedStores.forEach((store, index) => {
      const cleanAddress = store.address.split('(')[0].trim();
      geocoder.addressSearch(cleanAddress, (result: any, status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          // 첫번째 명당 위치를 초기 지도 중심으로 설정
          if (index === 0) {
            map.setCenter(coords);
            map.setLevel(5);
          }

          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            title: store.name
          });

          // 마커 클릭 시 정보 표시
          kakao.maps.event.addListener(marker, 'click', () => {
            const content = `
              <div style="padding: 10px; min-width: 150px; font-family: sans-serif; border: 0;">
                <h4 style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold; color: #1b1c19;">${store.name}</h4>
                <p style="margin: 0; font-size: 11px; color: #5c5f5a; line-height: 1.4;">${store.address}</p>
                ${store.winners > 0 ? `<p style="margin: 5px 0 0 0; font-size: 10px; font-weight: bold; color: #d97706;">🏆 1등 자동 ${store.winners}회</p>` : ''}
              </div>
            `;
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);
            map.panTo(coords);
          });

          markersRef.current.push(marker);
          bounds.extend(coords);
          hasValidMarker = true;

          // 모든 마커가 보이도록 지도 영역 조정
          if (hasValidMarker) {
            map.setBounds(bounds);
          }
        }
      });
    });
  }, [paginatedStores]);

  // 특정 판매점 클릭 시 지도의 중심으로 포커싱하는 함수
  const focusStoreOnMap = (store: any) => {
    if (!kakaoMapInstance.current) return;
    const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) return;

    const map = kakaoMapInstance.current;
    const geocoder = new kakao.maps.services.Geocoder();
    const cleanAddress = store.address.split('(')[0].trim();

    geocoder.addressSearch(cleanAddress, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        map.setLevel(3);
        map.panTo(coords);

        const content = `
          <div style="padding: 10px; min-width: 150px; font-family: sans-serif;">
            <h4 style="margin: 0 0 5px 0; font-size: 13px; font-weight: bold; color: #1b1c19;">${store.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #5c5f5a; line-height: 1.4;">${store.address}</p>
            ${store.winners > 0 ? `<p style="margin: 5px 0 0 0; font-size: 10px; font-weight: bold; color: #d97706;">🏆 1등 자동 ${store.winners}회</p>` : ''}
          </div>
        `;
        infoWindowRef.current.setContent(content);

        const matchedMarker = markersRef.current.find(m => {
          const pos = m.getPosition();
          return Math.abs(pos.getLat() - coords.getLat()) < 0.0001 && Math.abs(pos.getLng() - coords.getLng()) < 0.0001;
        });

        if (matchedMarker) {
          infoWindowRef.current.open(map, matchedMarker);
        } else {
          infoWindowRef.current.setPosition(coords);
          infoWindowRef.current.open(map);
        }
      }
    });
  };

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleTabChange = (tab: 'all' | 'winning') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="bg-background text-on-surface font-label min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black font-headline text-stone-900 dark:text-stone-50 tracking-tighter">Lucky Win</h1>
        </div>
        <span className="font-headline font-bold text-lg text-amber-600">제{latestRound}회차</span>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold font-headline tracking-tight text-on-surface">로또 복권 판매소</h2>
          <p className="text-sm text-on-surface-variant mt-2">전국의 로또 복권 판매처를 실시간 공공데이터로 검색해보세요</p>
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

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2.5 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="지역 또는 판매소명 입력"
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
              {activeTab === 'all' ? '전체 판매소' : '1등 배출 명당'} 검색 결과: {activeStores.length}개 판매소
            </p>
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
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full">🏆 1등 자동 {store.winners}회 배출</span>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded bg-surface-container-low text-on-surface disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform"
                >
                  이전
                </button>
                <span className="text-xs font-bold text-on-surface-variant">
                  {currentPage} / {totalPages} 페이지
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 rounded bg-surface-container-low text-on-surface disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
}
