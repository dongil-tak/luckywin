const fs = require('fs');
const path = require('path');
const https = require('https');

const dbPath = path.join(__dirname, '../src/data/lottoDB.json');

function getDrawDate(round) {
  const startDate = new Date('2002-12-07');
  const targetDate = new Date(startDate.getTime() + (round - 1) * 7 * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

function fetchNaverSearch(round) {
  const options = {
    hostname: 'search.naver.com',
    port: 443,
    path: `/search.naver?query=%EB%A1%9C%EB%98%90+${round}%ED%9A%8C`,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  };

  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Naver returned status code ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    if (!fs.existsSync(dbPath)) {
      console.error(`Database file not found at ${dbPath}`);
      process.exit(1);
    }

    const lottoDB = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    lottoDB.sort((a, b) => b.round - a.round);
    
    let latestRoundInDB = lottoDB[0]?.round || 0;
    console.log(`Current latest round in DB: ${latestRoundInDB}`);

    let nextRound = latestRoundInDB + 1;
    let addedCount = 0;

    while (true) {
      console.log(`Checking round ${nextRound} from Naver...`);
      try {
        const html = await fetchNaverSearch(nextRound);
        
        // Extract the actual round displayed in the Naver widget to prevent fallback issues
        const roundWidgetMatch = html.match(/\((\d+)\s*-\s*1\)\.toString\(\)/);
        if (!roundWidgetMatch) {
          console.log(`Could not verify round widget on Naver for round ${nextRound}. Stopping.`);
          break;
        }

        const actualDisplayedRound = parseInt(roundWidgetMatch[1], 10);
        if (actualDisplayedRound !== nextRound) {
          console.log(`Naver search fell back to round ${actualDisplayedRound} (requested ${nextRound}). Round is not drawn yet. Stopping.`);
          break;
        }

        // Parse winning numbers
        const winNumSectionMatch = html.match(/<div class="winning_number">([\s\S]*?)<\/div>/);
        if (!winNumSectionMatch) {
          console.log(`Could not parse winning numbers section for round ${nextRound}. Stopping.`);
          break;
        }
        const winNumMatches = winNumSectionMatch[1].match(/<span[^>]*>(\d+)<\/span>/g);
        if (!winNumMatches) {
          console.log(`Could not parse winning balls for round ${nextRound}. Stopping.`);
          break;
        }
        const numbers = winNumMatches.map(m => parseInt(m.replace(/<[^>]+>/g, ''), 10)).sort((a, b) => a - b);

        // Parse bonus number
        const bonusSectionMatch = html.match(/<div class="bonus_number">([\s\S]*?)<\/div>/);
        if (!bonusSectionMatch) {
          console.log(`Could not parse bonus number section for round ${nextRound}. Stopping.`);
          break;
        }
        const bonusMatch = bonusSectionMatch[1].match(/<span[^>]*>(\d+)<\/span>/);
        if (!bonusMatch) {
          console.log(`Could not parse bonus ball for round ${nextRound}. Stopping.`);
          break;
        }
        const bonus = parseInt(bonusMatch[1], 10);

        // Parse winners and prize amount
        const winTextMatch = html.match(/1등\s*당첨금\s*<strong[^>]*>([\d,]+)<\/strong>원\s*\(당첨\s*복권수\s*(\d+)개\)/);
        let winners = 0;
        let prizeAmount = 0;
        if (winTextMatch) {
          prizeAmount = parseInt(winTextMatch[1].replace(/,/g, ''), 10);
          winners = parseInt(winTextMatch[2], 10);
        }

        const newEntry = {
          round: nextRound,
          numbers,
          bonus,
          winners,
          prizeAmount,
          totalSales: null,
          drawDate: getDrawDate(nextRound)
        };

        lottoDB.unshift(newEntry);
        console.log(`Successfully synced round ${nextRound} (drawn on ${newEntry.drawDate})`);
        
        nextRound++;
        addedCount++;
      } catch (err) {
        console.error(`Error fetching/parsing round ${nextRound}:`, err.message);
        break;
      }
    }

    if (addedCount > 0) {
      lottoDB.sort((a, b) => b.round - a.round);
      fs.writeFileSync(dbPath, JSON.stringify(lottoDB, null, 2), 'utf8');
      console.log(`Database updated successfully. Added ${addedCount} rounds.`);
    } else {
      console.log('Database is already up to date.');
    }
  } catch (error) {
    console.error('Sync script failed:', error);
  }
}

main();
