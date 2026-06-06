import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '../../로또 회차별 당첨번호_20260528090837.xlsx');
const dbPath = path.join(__dirname, '../src/data/lottoDB.json');

function getDrawDate(round) {
  const startDate = new Date('2002-12-07');
  const targetDate = new Date(startDate.getTime() + (round - 1) * 7 * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

try {
  console.log('Reading local Excel file:', excelPath);
  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  console.log(`Successfully read Excel sheet. Total rows: ${rows.length}`);
  
  const db = [];
  
  // Skip header row at index 0
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 12) continue;
    
    const round = parseInt(row[1], 10);
    if (isNaN(round)) continue;
    
    const numbers = [
      parseInt(row[2], 10),
      parseInt(row[3], 10),
      parseInt(row[4], 10),
      parseInt(row[5], 10),
      parseInt(row[6], 10),
      parseInt(row[7], 10)
    ].map(Number).sort((a, b) => a - b);
    
    const bonus = parseInt(row[8], 10);
    const winners = parseInt(String(row[10]).replace(/[^0-9]/g, ''), 10);
    const prizeAmount = parseInt(String(row[11]).replace(/[^0-9]/g, ''), 10);
    
    db.push({
      round,
      numbers,
      bonus,
      winners,
      prizeAmount,
      totalSales: null,
      drawDate: getDrawDate(round)
    });
  }
  
  console.log(`Parsed ${db.length} rounds from Excel.`);
  
  // Add round 1226 manually
  const round1226 = {
    round: 1226,
    numbers: [4, 6, 13, 17, 26, 28],
    bonus: 41,
    winners: 10,
    prizeAmount: 2815230113,
    totalSales: 120259943000,
    drawDate: "2026-05-30"
  };
  
  db.push(round1226);
  console.log('Added round 1226 manually.');
  
  // Sort descending by round
  db.sort((a, b) => b.round - a.round);
  
  // Write to lottoDB.json
  const outDir = path.dirname(dbPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Successfully updated lottoDB.json! Total entries: ${db.length}`);
  
} catch (e) {
  console.error('Failed to sync from Excel:', e);
}
