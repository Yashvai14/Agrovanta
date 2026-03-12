import { createFeatureFromInput } from "./dataset";

export type ResidueInput = {
  species: string;
  productType: "milk" | "meat" | "eggs" | "honey";
  compound: string;
  dosageMg: number;
  withdrawalDays: number;
  daysSinceLastDose: number;
};

export type ResiduePrediction = {
  probability: number;
  riskLabel: "LOW" | "MODERATE" | "HIGH";
  compliant: boolean;
  message: string;
  safeHarvestDateStatus: "IN_WITHDRAWAL" | "COMPLIANT";
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Simple interpretable model inspired by pharmacokinetic decay.
 * Not a clinical tool – intended for demonstration and workflow wiring.
 */
export function predictResidueRisk(input: ResidueInput): ResiduePrediction {
  const { dosageMg, withdrawalDays, daysSinceLastDose } = input;

  const { timeRatio, logDosage } = createFeatureFromInput({
    dosageMg,
    withdrawalDays,
    daysSinceLastDose,
  });

  // Hand-tuned coefficients, could be re-estimated from data if needed.
  const bias = 0.5;
  const wTimeRatio = -4.0;
  const wLogDosage = 0.8;

  const linearScore = bias + wTimeRatio * timeRatio + wLogDosage * logDosage;
  const probability = sigmoid(linearScore);

  let riskLabel: ResiduePrediction["riskLabel"];
  if (probability < 0.33) {
    riskLabel = "LOW";
  } else if (probability < 0.66) {
    riskLabel = "MODERATE";
  } else {
    riskLabel = "HIGH";
  }

  const compliant = timeRatio >= 1;
  const safeHarvestDateStatus: ResiduePrediction["safeHarvestDateStatus"] =
    compliant ? "COMPLIANT" : "IN_WITHDRAWAL";

  let message: string;
  if (!compliant) {
    const remainingDays = Math.max(
      0,
      Math.ceil(withdrawalDays - daysSinceLastDose),
    );
    message =
      remainingDays === 0
        ? "The animal is at the edge of the withdrawal period. Consider waiting at least one more day before harvesting."
        : `Product is still within the withdrawal period. Wait at least ${remainingDays} more day${remainingDays === 1 ? "" : "s"} before sending to market.`;
  } else if (riskLabel === "LOW") {
    message =
      "The sample is past the recommended withdrawal period with a low estimated residue risk. Continue routine monitoring.";
  } else if (riskLabel === "MODERATE") {
    message =
      "The sample is past the withdrawal period but the estimated risk is moderate. Consider additional screening tests before release.";
  } else {
    message =
      "Despite meeting the withdrawal period, the estimated residue risk is still high. Conduct confirmatory laboratory testing before release.";
  }

  return {
    probability,
    riskLabel,
    compliant,
    message,
    safeHarvestDateStatus,
  };
}

