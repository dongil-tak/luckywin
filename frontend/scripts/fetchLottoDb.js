import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildDb(inputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      console.error(`Not found: ${inputPath}`);
      return;
    }

    const workbook = xlsx.readFile(inputPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    // First row is headers
    // ['회차', '당첨번호1', '당첨번호2', '당첨번호3', '당첨번호4', '당첨번호5', '당첨번호6', '보너스번호', '1등당첨수', '일등 당첨금액', '로또 총 구매금액', '발표일']
    
    const db = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 12) continue; // skip incomplete rows
      
      const round = parseInt(row[0], 10);
      if (isNaN(round)) continue;
      
      const numbers = [
        parseInt(row[1], 10),
        parseInt(row[2], 10),
        parseInt(row[3], 10),
        parseInt(row[4], 10),
        parseInt(row[5], 10),
        parseInt(row[6], 10),
      ];
      const bonus = parseInt(row[7], 10);
      const winners = parseInt(row[8], 10);
      const prizeAmount = parseInt(row[9], 10);
      const totalSales = parseInt(row[10], 10);
      let drawDate = row[11];
      
      // Attempt Excel datestring conversion if necessary
      if (typeof drawDate === 'number') {
        const date = new Date(Math.round((drawDate - 25569) * 86400 * 1000));
        drawDate = date.toISOString().split('T')[0];
      }

      db.push({
        round,
        numbers,
        bonus,
        winners,
        prizeAmount,
        totalSales,
        drawDate,
      });
    }

    // save to src/data/lottoDB.json
    const outDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, 'lottoDB.json');
    fs.writeFileSync(outPath, JSON.stringify(db, null, 2), 'utf-8');
    
    console.log(`Successfully mapped ${db.length} entries to ${outPath}`);

  } catch (error) {
    console.error('Error building DB:', error);
  }
}

function main() {
  const isWatch = process.argv.includes('--watch');
  const inputPath = '/Users/takdi/Downloads/lottowinnumber_20260425.xlsx';
  
  buildDb(inputPath);
  
  if (isWatch) {
    console.log(`Watching for changes on ${inputPath}...`);
    // Use fs.watchFile for cross-platform, robust file watching
    fs.watchFile(inputPath, { interval: 1000 }, (curr, prev) => {
      // Only rebuild if the modification time changed
      if (curr.mtimeMs !== prev.mtimeMs) {
        console.log('\n[Watcher] File changed! Rebuilding DB...');
        buildDb(inputPath);
      }
    });
  }
}

main();
