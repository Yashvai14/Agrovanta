import { NextResponse } from "next/server";
import type { ResidueInput } from "@/lib/ai/model";
import { predictResidueRisk } from "@/lib/ai/model";

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ResidueInput>;

    const dosageMg = parseNumber(body.dosageMg);
    const withdrawalDays = parseNumber(body.withdrawalDays);
    const daysSinceLastDose = parseNumber(body.daysSinceLastDose);

    if (!body.species || typeof body.species !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'species' field." },
        { status: 400 },
      );
    }

    if (!body.productType || typeof body.productType !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'productType' field." },
        { status: 400 },
      );
    }

    if (!body.compound || typeof body.compound !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'compound' field." },
        { status: 400 },
      );
    }

    if (dosageMg === null || dosageMg <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'dosageMg' field." },
        { status: 400 },
      );
    }

    if (withdrawalDays === null || withdrawalDays < 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'withdrawalDays' field." },
        { status: 400 },
      );
    }

    if (daysSinceLastDose === null || daysSinceLastDose < 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'daysSinceLastDose' field." },
        { status: 400 },
      );
    }

    const input: ResidueInput = {
      species: body.species,
      productType: body.productType,
      compound: body.compound,
      dosageMg,
      withdrawalDays,
      daysSinceLastDose,
    };

    const prediction = predictResidueRisk(input);

    return NextResponse.json(
      {
        input,
        prediction,
      },
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in /api/predict-residue:", error);
    return NextResponse.json(
      {
        error:
          "Failed to process request. Please check your input and try again.",
      },
      { status: 500 },
    );
  }
}

