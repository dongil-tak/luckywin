import fs from 'fs';

const html = fs.readFileSync('naver_search.html', 'utf-8');
const round = 1226;

try {
  // 1. Verify round
  const hasRound = html.includes(`${round}회`);
  console.log(`Has round ${round} in HTML:`, hasRound);

  // 2. Extract winning numbers
  const winNumSectionMatch = html.match(/<div class="winning_number">([\s\S]*?)<\/div>/);
  if (!winNumSectionMatch) throw new Error('Could not find winning numbers section');
  const winNumMatches = winNumSectionMatch[1].match(/<span[^>]*>(\d+)<\/span>/g);
  if (!winNumMatches) throw new Error('Could not find winning numbers balls');
  const numbers = winNumMatches.map(m => parseInt(m.replace(/<[^>]+>/g, ''), 10)).sort((a, b) => a - b);
  console.log('Winning Numbers:', numbers);

  // 3. Extract bonus number
  const bonusSectionMatch = html.match(/<div class="bonus_number">([\s\S]*?)<\/div>/);
  if (!bonusSectionMatch) throw new Error('Could not find bonus number section');
  const bonusMatch = bonusSectionMatch[1].match(/<span[^>]*>(\d+)<\/span>/);
  if (!bonusMatch) throw new Error('Could not find bonus number ball');
  const bonus = parseInt(bonusMatch[1], 10);
  console.log('Bonus Number:', bonus);

  // 4. Extract 1st prize winners and amount
  // We can look at <p class="win_text">1등 당첨금 <strong class="emphasis">2,815,230,113</strong>원 (당첨 복권수 10개)</p>
  const winTextMatch = html.match(/1등\s*당첨금\s*<strong[^>]*>([\d,]+)<\/strong>원\s*\(당첨\s*복권수\s*(\d+)개\)/);
  let winners = 0;
  let prizeAmount = 0;
  if (winTextMatch) {
    prizeAmount = parseInt(winTextMatch[1].replace(/,/g, ''), 10);
    winners = parseInt(winTextMatch[2], 10);
  } else {
    // Fallback search
    console.log('Warning: win_text match failed, attempting fallback...');
  }
  console.log('Winners:', winners);
  console.log('Prize Amount:', prizeAmount);

} catch (e) {
  console.error('Parsing failed:', e.message);
}
