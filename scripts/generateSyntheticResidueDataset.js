// Simple script to (re)generate the synthetic residue_samples.csv file.
// You can run it with: `node scripts/generateSyntheticResidueDataset.js`

const fs = require("node:fs");
const path = require("node:path");

const outputPath = path.join(process.cwd(), "data", "residue_samples.csv");

const header =
  "species,product_type,compound,dosage_mg,withdrawal_days,days_since_last_dose,compliant";

const rows = [
  ["cattle", "milk", "Oxytetracycline", 500, 7, 2, 0],
  ["cattle", "milk", "Oxytetracycline", 500, 7, 5, 0],
  ["cattle", "milk", "Oxytetracycline", 500, 7, 7, 1],
  ["cattle", "milk", "Oxytetracycline", 500, 7, 9, 1],
  ["cattle", "milk", "Oxytetracycline", 250, 7, 3, 0],
  ["cattle", "milk", "Oxytetracycline", 250, 7, 6, 1],
  ["cattle", "meat", "Oxytetracycline", 800, 28, 7, 0],
  ["cattle", "meat", "Oxytetracycline", 800, 28, 14, 0],
  ["cattle", "meat", "Oxytetracycline", 800, 28, 28, 1],
  ["cattle", "meat", "Oxytetracycline", 800, 28, 35, 1],
  ["cattle", "milk", "Enrofloxacin", 300, 5, 1, 0],
  ["cattle", "milk", "Enrofloxacin", 300, 5, 3, 0],
  ["cattle", "milk", "Enrofloxacin", 300, 5, 5, 1],
  ["cattle", "milk", "Enrofloxacin", 150, 5, 2, 0],
  ["cattle", "milk", "Enrofloxacin", 150, 5, 4, 1],
  ["cattle", "meat", "Enrofloxacin", 600, 14, 4, 0],
  ["cattle", "meat", "Enrofloxacin", 600, 14, 10, 0],
  ["cattle", "meat", "Enrofloxacin", 600, 14, 14, 1],
  ["cattle", "meat", "Enrofloxacin", 600, 14, 18, 1],
  ["cattle", "milk", "Penicillin G", 50, 4, 1, 0],
  ["cattle", "milk", "Penicillin G", 50, 4, 3, 0],
  ["cattle", "milk", "Penicillin G", 50, 4, 4, 1],
  ["cattle", "milk", "Penicillin G", 25, 4, 2, 0],
  ["cattle", "milk", "Penicillin G", 25, 4, 4, 1],
  ["cattle", "meat", "Penicillin G", 100, 10, 3, 0],
  ["cattle", "meat", "Penicillin G", 100, 10, 7, 0],
  ["cattle", "meat", "Penicillin G", 100, 10, 10, 1],
  ["cattle", "meat", "Penicillin G", 100, 10, 15, 1],
];

const csv = [header, ...rows.map((r) => r.join(","))].join("\n");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, csv);

// eslint-disable-next-line no-console
console.log(`Synthetic dataset written to ${outputPath}`);

