from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .ai.dataset import load_residue_dataset
from .ai.model import predict_residue_risk
from .schemas import (
  PredictionResponse,
  ResidueInput,
  ResiduePrediction,
  SelfTestResponse,
)


app = FastAPI(
  title="Agrovanta Backend",
  description=(
    "FastAPI backend for the Agrovanta livestock antimicrobial residue risk "
    "platform. Provides AI-assisted residue risk estimation and self-test "
    "endpoints."
  ),
  version="0.1.0",
)


# Allow local frontend development by default.
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
  return {"status": "ok"}


@app.post(
  "/predict-residue",
  response_model=PredictionResponse,
  tags=["residue"],
)
def predict_residue(input_data: ResidueInput) -> PredictionResponse:
  try:
    prediction = predict_residue_risk(
      species=input_data.species,
      product_type=input_data.product_type,
      compound=input_data.compound,
      dosage_mg=input_data.dosage_mg,
      withdrawal_days=input_data.withdrawal_days,
      days_since_last_dose=input_data.days_since_last_dose,
    )

    return PredictionResponse(
      input=input_data,
      prediction=ResiduePrediction(
        probability=prediction.probability,
        risk_label=prediction.risk_label,
        compliant=prediction.compliant,
        message=prediction.message,
        safe_harvest_date_status=prediction.safe_harvest_date_status,
      ),
    )
  except ValueError as exc:
    raise HTTPException(status_code=400, detail=str(exc)) from exc
  except Exception as exc:  # noqa: BLE001
    raise HTTPException(
      status_code=500,
      detail="Failed to process request. Please check your input and try again.",
    ) from exc


@app.get(
  "/self-test",
  response_model=SelfTestResponse,
  tags=["system"],
)
def self_test() -> SelfTestResponse:
  samples = load_residue_dataset()
  dataset_loaded = len(samples) > 0

  example_prediction = predict_residue_risk(
    species="cattle",
    product_type="milk",
    compound="Oxytetracycline",
    dosage_mg=500,
    withdrawal_days=7,
    days_since_last_dose=3,
  )

  sanity_check = example_prediction.safe_harvest_date_status == "IN_WITHDRAWAL"

  return SelfTestResponse(
    status="ok",
    dataset_loaded=dataset_loaded,
    sanity_check=sanity_check,
    example_prediction=ResiduePrediction(
      probability=example_prediction.probability,
      risk_label=example_prediction.risk_label,
      compliant=example_prediction.compliant,
      message=example_prediction.message,
      safe_harvest_date_status=example_prediction.safe_harvest_date_status,
    ),
  )

