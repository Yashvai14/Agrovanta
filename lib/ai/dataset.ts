import fs from "node:fs";
import path from "node:path";

export type ResidueSample = {
  species: string;
  productType: "milk" | "meat" | "eggs" | "honey";
  compound: string;
  dosageMg: number;
  withdrawalDays: number;
  daysSinceLastDose: number;
  compliant: boolean;
};

function getDataPath() {
  return path.join(process.cwd(), "data", "residue_samples.csv");
}

export function loadResidueDataset(): ResidueSample[] {
  const filePath = getDataPath();

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const [, ...rows] = lines; // skip header

  const samples: ResidueSample[] = [];

  for (const row of rows) {
    const [
      species,
      productType,
      compound,
      dosageMg,
      withdrawalDays,
      daysSinceLastDose,
      compliant,
    ] = row.split(",");

    if (
      !species ||
      !productType ||
      !compound ||
      dosageMg === undefined ||
      withdrawalDays === undefined ||
      daysSinceLastDose === undefined ||
      compliant === undefined
    ) {
      // Skip malformed rows quietly
      // eslint-disable-next-line no-continue
      continue;
    }

    const parsed: ResidueSample = {
      species,
      productType: productType as ResidueSample["productType"],
      compound,
      dosageMg: Number(dosageMg),
      withdrawalDays: Number(withdrawalDays),
      daysSinceLastDose: Number(daysSinceLastDose),
      compliant: compliant === "1" || compliant.toLowerCase() === "true",
    };

    if (
      Number.isNaN(parsed.dosageMg) ||
      Number.isNaN(parsed.withdrawalDays) ||
      Number.isNaN(parsed.daysSinceLastDose)
    ) {
      // eslint-disable-next-line no-continue
      continue;
    }

    samples.push(parsed);
  }

  return samples;
}

export function createFeatureFromInput(params: {
  withdrawalDays: number;
  daysSinceLastDose: number;
  dosageMg: number;
}) {
  const { withdrawalDays, daysSinceLastDose, dosageMg } = params;

  const safeWithdrawal = Math.max(withdrawalDays, 1);
  const safeTimeSinceDose = Math.max(daysSinceLastDose, 0);

  const timeRatio = safeTimeSinceDose / safeWithdrawal;
  const logDosage = Math.log10(Math.max(dosageMg, 1));

  return {
    timeRatio,
    logDosage,
  };
}

