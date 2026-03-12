// Minimal smoke test for the residue risk model logic.
// Run with: `node scripts/testResidueModel.js`

const path = require("node:path");
const { createRequire } = require("node:module");

// Allow importing the compiled TypeScript by going through Next's build output
// if available, otherwise fall back to the source with ts-node/register if present.
const projectRoot = process.cwd();
const requireFromRoot = createRequire(path.join(projectRoot, "scripts", "testResidueModel.js"));

let predictResidueRisk;

try {
  // Try to load from the compiled Next output (after `next build`)
  // This path mirrors the TS file location under .next.
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const built = requireFromRoot("./.next/server/chunks/lib_ai_model.js");
  predictResidueRisk = built.predictResidueRisk;
} catch {
  // Fallback: attempt to load the TS source via ts-node if the user has it installed.
  try {
    // eslint-disable-next-line global-require
    requireFromRoot("ts-node/register");
    // eslint-disable-next-line global-require, import/no-dynamic-require
    predictResidueRisk = requireFromRoot("./lib/ai/model.ts").predictResidueRisk;
  } catch {
    // eslint-disable-next-line no-console
    console.error(
      "Unable to load residue model. Run `next build` first or install ts-node if you want to execute this test script.",
    );
    process.exit(1);
  }
}

function runScenario(label, input) {
  const result = predictResidueRisk(input);
  // eslint-disable-next-line no-console
  console.log(`\n=== ${label} ===`);
  // eslint-disable-next-line no-console
  console.log("Input:", input);
  // eslint-disable-next-line no-console
  console.log("Prediction:", {
    probability: Number(result.probability.toFixed(3)),
    riskLabel: result.riskLabel,
    compliant: result.compliant,
    status: result.safeHarvestDateStatus,
  });
}

runScenario("Within withdrawal period", {
  species: "cattle",
  productType: "milk",
  compound: "Oxytetracycline",
  dosageMg: 500,
  withdrawalDays: 7,
  daysSinceLastDose: 2,
});

runScenario("Past withdrawal period", {
  species: "cattle",
  productType: "milk",
  compound: "Oxytetracycline",
  dosageMg: 500,
  withdrawalDays: 7,
  daysSinceLastDose: 9,
});

