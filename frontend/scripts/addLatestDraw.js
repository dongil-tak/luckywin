import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../src/data/lottoDB.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (db[0].round === 1221) {
  console.log('Round 1221 already added.');
  process.exit(0);
}

const newDraw = {
  round: 1221,
  numbers: [6, 11, 15, 19, 21, 32],
  bonus: 45,
  winners: 19,
  prizeAmount: 1834219500,
  totalSales: 130541280000,
  drawDate: "2026-04-25"
};

db.unshift(newDraw);
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully added round 1221!');
