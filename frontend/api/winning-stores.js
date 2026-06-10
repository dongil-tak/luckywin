/**
 * Vercel Serverless Function: /api/winning-stores?drwNo=1227
 * 동행복권 공식 API에서 해당 회차 1등 당첨 판매점 정보를 반환합니다.
 * API: GET /wnprchsplcsrch/selectLtWnShp.do?srchWnShpRnk=1&srchLtEpsd=<round>
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

    const apiUrl = `https://www.dhlottery.co.kr/wnprchsplcsrch/selectLtWnShp.do?srchWnShpRnk=1&srchLtEpsd=${round}&srchShpLctn=`;
    const apiRes = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.dhlottery.co.kr/wnprchsplcsrch/home',
      },
    });

    if (!apiRes.ok) {
      throw new Error(`동행복권 API 오류: ${apiRes.status}`);
    }

    const json = await apiRes.json();
    const list = json?.data?.list;

    if (!list || list.length === 0) {
      return res.status(200).json({ round, stores: [], source: 'dhlottery' });
    }

    const stores = list.map((item) => ({
      rank: item.rnum,
      name: item.shpNm || '',
      region: item.shpAddr || item.region || '',
      type: item.atmtPsvYnTxt || (item.atmtPsvYn === 'Q' ? '자동' : item.atmtPsvYn === 'M' ? '수동' : '반자동'),
      lat: item.shpLat || null,
      lng: item.shpLot || null,
    }));

    return res.status(200).json({ round, stores, source: 'dhlottery' });
  } catch (err) {
    console.error('winning-stores error:', err);
    return res.status(500).json({ error: err.message || '서버 오류가 발생했습니다.' });
  }
}
