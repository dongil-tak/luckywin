import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 사용자님의 공개 구글 드라이브 파일 ID
const FILE_ID = '1pHFEg54xkaSUBEmXmld2GAcrtKuAyN4W';
const DRIVE_URL = `https://docs.google.com/spreadsheets/d/${FILE_ID}/export?format=xlsx`;

async function buildDb() {
  try {
    console.log(`Downloading latest Excel file from Google Drive...`);
    const response = await fetch(DRIVE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Drive: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Parsing Excel data (Size: ${buffer.length} bytes)...`);
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
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

    const outDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, 'lottoDB.json');
    fs.writeFileSync(outPath, JSON.stringify(db, null, 2), 'utf-8');
    
    console.log(`Successfully mapped ${db.length} entries to src/data/lottoDB.json!`);

  } catch (error) {
    console.error('Error building DB:', error);
  }
}

buildDb();
