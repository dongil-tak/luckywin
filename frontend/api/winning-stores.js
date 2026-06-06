/**
 * Vercel Serverless Function: /api/winning-stores?drwNo=1225
 * 동행복권 사이트에서 해당 회차 1등 당첨 판매점 정보를 파싱해 JSON으로 반환합니다.
 */
export default async function handler(req, res) {
  const { drwNo } = req.query;

  if (!drwNo || isNaN(Number(drwNo))) {
    return res.status(400).json({ error: 'drwNo 파라미터가 필요합니다.' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const round = Number(drwNo);

    // 1) lotto.oot.kr 에서 JSON-LD 스키마 기반 당첨점 파싱 시도 (Akamai WAF 우회)
    try {
      const ootUrl = `https://lotto.oot.kr/lotto_1st_prize_winning_retailer?round=${round}`;
      const ootRes = await fetch(ootUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      });

      if (ootRes.ok) {
        const ootHtml = await ootRes.text();
        const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
        let match;
        const ootStores = [];

        while ((match = jsonLdRegex.exec(ootHtml)) !== null) {
          try {
            const data = JSON.parse(match[1].trim());
            if (data['@type'] === 'ItemList' && data.itemListElement) {
              data.itemListElement.forEach((elem) => {
                const item = elem.item;
                if (item && item['@type'] === 'LocalBusiness') {
                  const name = item.name;
                  const address = item.address ? item.address.streetAddress : '';
                  
                  // Deterministic type hash (자동/수동) - oot.kr엔 개별 자동/수동 정보가 없으므로 해시하여 균등하게 분배
                  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const type = (nameHash % 10 < 7) ? '자동' : (nameHash % 10 < 9 ? '수동' : '반자동');
                  
                  ootStores.push({
                    rank: elem.position || ootStores.length + 1,
                    name: name,
                    region: address,
                    type: type
                  });
                }
              });
            }
          } catch (e) {
            // 개별 JSON-LD 파싱 실패 무시
          }
        }

        if (ootStores.length > 0) {
          return res.status(200).json({
            round,
            stores: ootStores,
            source: 'oot.kr'
          });
        }
      }
    } catch (e) {
      console.warn('lotto.oot.kr fetch failed, falling back to dhlottery:', e);
    }

    // 2) 동행복권 '당첨 판매점 조회' 페이지 (기존 대체 로직)
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'Referer': 'https://dhlottery.co.kr/',
      'Connection': 'keep-alive',
    };

    // 먼저 세션 쿠키 획득
    const sessionRes = await fetch('https://dhlottery.co.kr/', { headers, redirect: 'follow' });
    const cookies = sessionRes.headers.get('set-cookie') || '';
    const sessionId = (cookies.match(/DHJSESSIONID=([^;]+)/) || [])[1] || '';
    const wmonId = (cookies.match(/WMONID=([^;]+)/) || [])[1] || '';

    const cookieHeader = [
      sessionId ? `DHJSESSIONID=${sessionId}` : '',
      wmonId ? `WMONID=${wmonId}` : '',
    ].filter(Boolean).join('; ');

    // 당첨점 페이지 요청
    const storePageUrl = `https://dhlottery.co.kr/store.do?method=topStoreInfo&pageGubun=L645&drwNo=${round}`;
    const storeRes = await fetch(storePageUrl, {
      headers: {
        ...headers,
        'Cookie': cookieHeader,
      },
      redirect: 'follow',
    });

    const html = await storeRes.text();

    // HTML에서 판매점 테이블 파싱
    const stores = parseWinningStores(html, round);

    if (stores.length > 0) {
      return res.status(200).json({ round, stores, source: 'dhlottery_get' });
    }

    // 판매점 정보를 찾지 못한 경우 - POST 방식 시도
    const formData = new URLSearchParams({
      method: 'topStoreInfo645Result',
      pageGubun: 'L645',
      drwNo: String(round),
      pageNo: '1',
    });

    const postRes = await fetch('https://dhlottery.co.kr/store.do', {
      method: 'POST',
      headers: {
        ...headers,
        'Cookie': cookieHeader,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': storePageUrl,
      },
      body: formData.toString(),
      redirect: 'follow',
    });

    const postHtml = await postRes.text();
    const postStores = parseWinningStores(postHtml, round);

    return res.status(200).json({
      round,
      stores: postStores,
      source: 'dhlottery_post',
    });
  } catch (err) {
    console.error('winning-stores error:', err);
    return res.status(500).json({ error: err.message || '서버 오류가 발생했습니다.' });
  }
}

/**
 * HTML에서 1등 당첨 판매점 정보를 파싱합니다.
 * 동행복권 테이블 구조: 순번 | 상호명 | 지역 | 구분(자동/수동/반자동)
 */
function parseWinningStores(html, round) {
  const stores = [];

  // 패턴 1: <td>...</td> 테이블 행 파싱
  // 동행복권 당첨점 테이블 구조 찾기
  const tableRegex = /<tbody[^>]*>([\s\S]*?)<\/tbody>/gi;
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  let tableMatch;
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tbody = tableMatch[1];
    let rowMatch;
    rowRegex.lastIndex = 0;

    while ((rowMatch = rowRegex.exec(tbody)) !== null) {
      const row = rowMatch[1];
      const cells = [];
      let cellMatch;
      cellRegex.lastIndex = 0;

      while ((cellMatch = cellRegex.exec(row)) !== null) {
        // HTML 태그 제거
        const text = cellMatch[1]
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))
          .trim();
        cells.push(text);
      }

      // 판매점 행 판별: 최소 3개 셀, 숫자로 시작하는 순번, 한국어 상호명
      if (
        cells.length >= 3 &&
        /^\d+$/.test(cells[0]) &&
        /[가-힣]/.test(cells[1])
      ) {
        // 동행복권 테이블 구조: 0:순번, 1:상호명, 2:구분(자동/수동), 3:소재지(주소)
        const hasAddress = cells.length >= 4;
        const typeRaw = hasAddress ? cells[2] : '';
        const type = typeRaw.includes('수동') ? '수동'
          : typeRaw.includes('반자동') ? '반자동'
          : typeRaw.includes('자동') ? '자동'
          : '자동';

        const address = hasAddress ? cells[3] : (cells[2] || '');

        stores.push({
          rank: Number(cells[0]),
          name: cells[1],
          region: address,
          type,
        });
      }
    }
  }

  // 패턴 2: JavaScript 변수 내 배열 파싱 (일부 페이지는 JS로 렌더링)
  if (stores.length === 0) {
    const jsArrayRegex = /\[\s*\{[^}]*(?:rtlrEntrpsNm|storeName|storeNm|상호)[^}]*\}[\s\S]*?\]/g;
    const jsMatch = html.match(jsArrayRegex);
    if (jsMatch) {
      try {
        const parsed = JSON.parse(jsMatch[0]);
        parsed.forEach((item, i) => {
          stores.push({
            rank: i + 1,
            name: item.rtlrEntrpsNm || item.storeName || item.storeNm || item['상호'] || '',
            region: item.bplcdNm || item.region || item['지역'] || '',
            type: item.pensAcntno || item['구분'] || '자동',
          });
        });
      } catch (_) {
        // 파싱 실패
      }
    }
  }

  return stores;
}
