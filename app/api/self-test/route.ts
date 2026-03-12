import { NextResponse } from "next/server";
import { loadResidueDataset } from "@/lib/ai/dataset";
import { predictResidueRisk } from "@/lib/ai/model";

export async function GET() {
  const samples = loadResidueDataset();
  const datasetLoaded = samples.length > 0;

  const examplePrediction = predictResidueRisk({
    species: "cattle",
    productType: "milk",
    compound: "Oxytetracycline",
    dosageMg: 500,
    withdrawalDays: 7,
    daysSinceLastDose: 3,
  });

  const sanityCheck =
    examplePrediction.safeHarvestDateStatus === "IN_WITHDRAWAL";

  return NextResponse.json({
    status: "ok",
    datasetLoaded,
    sanityCheck,
    examplePrediction,
  });
}

