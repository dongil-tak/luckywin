import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function scrapeWinningStores(round) {
  console.log(`Scraping round ${round} with Stealth...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to homepage first...');
    await page.goto('https://www.dhlottery.co.kr/', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Navigating to store.do...');
    await page.goto('https://www.dhlottery.co.kr/store.do?method=topStoreInfo&pageGubun=L645', { waitUntil: 'networkidle2' });
    
    console.log('Current URL:', page.url());
    const html = await page.content();
    console.log('HTML length:', html.length);
    
    if (page.url().includes('error')) {
      console.log('Still redirected to errorPage even with Stealth.');
    } else {
      console.log('Success! Bypass complete.');
      
      await page.waitForSelector('#drwNo');
      await page.select('#drwNo', String(round));
      await page.click('#btnSearch');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const stores = await page.evaluate(() => {
        const rows = document.querySelectorAll('.tbl_data_col tbody tr');
        const list = [];
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 4) {
            const rankText = cells[0].textContent.trim();
            const name = cells[1].textContent.trim();
            const type = cells[2].textContent.trim();
            const region = cells[3].textContent.trim();
            
            if (/^\d+$/.test(rankText)) {
              list.push({
                rank: parseInt(rankText, 10),
                name: name,
                region: region,
                type: type.includes('수동') ? '수동' : type.includes('반자동') ? '반자동' : '자동'
              });
            }
          }
        });
        return list;
      });
      console.log('Scraped stores count:', stores.length);
      console.log(JSON.stringify(stores.slice(0, 5), null, 2));
    }
  } catch (err) {
    console.error('Error during scraping:', err);
  } finally {
    await browser.close();
  }
}

scrapeWinningStores(1100);
