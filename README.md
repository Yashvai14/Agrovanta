## Agrovanta – Livestock Antimicrobial Residue Risk Platform

Agrovanta is an AI-assisted livestock monitoring application focused on **antimicrobial usage (AMU)** and **Maximum Residue Limit (MRL) compliance** for milk and meat.

The system provides:

- **Marketing / product overview UI** describing the problem space (AMR, MRLs, withdrawal periods).
- A **Residue Risk Estimator** that simulates antimicrobial treatments and estimates residue risk using a lightweight AI model.
- A **database schema** for farms, animals, AMU events, and MRL tables (in `database/setup.sql`) for future full-stack expansion.

This document explains **all key logic, algorithms, dataset design, and how to run the project end to end.**

---

## 1. High-level architecture

- **Framework**: Next.js 16 (App Router) with TypeScript.
- **UI**: React 19, Tailwind CSS 4 (utility-first, glassmorphism, emerald/blue gradient theme).
- **AI / Modeling**:
  - Synthetic residue dataset in `data/residue_samples.csv`.
  - Server-side feature engineering and risk model in `lib/ai`.
  - REST-style inference API under `app/api`.
- **Database**:
  - Postgres schema for users, farms, animals, antimicrobial usage, and MRL limits in `database/setup.sql`.
  - Used as a reference schema; the current running app does not yet connect to a live database instance.

---

## 2. Frontend application

Entry point: `app/page.tsx`

Rendered sections:

- `NavBar` (`components/navBar.tsx`): Top navigation and branding.
- `Hero` (`components/hero.tsx`): High-level product pitch and KPIs.
- `Info` (`components/info.tsx`): Challenges around AMU, AMR, and MRL compliance.
- `Steps` (`components/steps.tsx`): Three-step operational workflow.
- `KeyFeatures` (`components/KeyFeatures.tsx`): Feature overview tiles.
- **Residue Risk Estimator** (`components/ResidueRiskForm.tsx`): Interactive AI-enabled form, wired to the backend.

### 2.1 Residue Risk Estimator UI

Component: `components/ResidueRiskForm.tsx`

User inputs:

- **Species**: Categorical (`"cattle" | "sheep" | "goat"`).
- **Product type**: `"milk"` or `"meat"`.
- **Compound**: One of `"Oxytetracycline" | "Enrofloxacin" | "Penicillin G"`.
- **Dosage (mg)**: Positive numeric approximate dose.
- **Withdrawal period (days)**: Labeled withdrawal period for the compound/species/product.
- **Days since last dose**: Non-negative integer days since last administration.

Behavior:

- On submit, the component sends a `POST` request to `/api/predict-residue` with a JSON payload containing the above fields.
- Displays:
  - **Risk label**: LOW / MODERATE / HIGH.
  - **Model risk score**: Residue risk probability in percent.
  - **Withdrawal status**: `Past withdrawal period` vs `In withdrawal period`.
  - **Interpretive message** describing what the score means and suggested next actions.
  - A small **input summary** panel for traceability.
- Includes a **disclaimer** clearly stating that this tool is for demonstration only and is **not** suitable for regulatory decisions.

Styling:

- Uses the same **glassmorphism** and gradient styling as the rest of the landing page (`bg-white/10`, `backdrop-blur`, emerald and blue accents).
- No base design has been altered; the estimator is added as a new section at the bottom of the page.

---

## 3. Dataset design (`data/residue_samples.csv`)

The project uses a **synthetic** dataset that approximates realistic AMU/MRL concepts while remaining simple and local to the repository.

Path: `data/residue_samples.csv`

Columns:

- `species` (string): Animal species. Example: `"cattle"`.
- `product_type` (string): Output product. Example: `"milk"` or `"meat"`.
- `compound` (string): Active compound. Example: `"Oxytetracycline"`, `"Enrofloxacin"`, `"Penicillin G"`.
- `dosage_mg` (number): Approximate administered dose in mg.
- `withdrawal_days` (integer): Labeled withdrawal period.
- `days_since_last_dose` (integer): Days elapsed since the last dose.
- `compliant` (0/1): Label indicating if the sample is assumed **compliant with MRL**:
  - `1` → compliant / safe.
  - `0` → non-compliant / at-risk.

Example rows:

```text
species,product_type,compound,dosage_mg,withdrawal_days,days_since_last_dose,compliant
cattle,milk,Oxytetracycline,500,7,2,0
cattle,milk,Oxytetracycline,500,7,7,1
cattle,meat,Enrofloxacin,600,14,4,0
cattle,meat,Enrofloxacin,600,14,14,1
...
```

### 3.1 Dataset loading and preprocessing

File: `lib/ai/dataset.ts`

Types:

```ts
export type ResidueSample = {
  species: string;
  productType: "milk" | "meat" | "eggs" | "honey";
  compound: string;
  dosageMg: number;
  withdrawalDays: number;
  daysSinceLastDose: number;
  compliant: boolean;
};
```

Key functions:

- **`loadResidueDataset()`**:
  - Reads `data/residue_samples.csv` using Node `fs`.
  - Splits into lines, skips header, parses each row.
  - Casts fields to correct types and drops malformed rows.
  - Returns `ResidueSample[]`.

- **`createFeatureFromInput({ withdrawalDays, daysSinceLastDose, dosageMg })`**:
  - Computes model-ready features from raw user inputs:
    - \( \text{timeRatio} = \frac{\max(\text{daysSinceLastDose}, 0)}{\max(\text{withdrawalDays}, 1)} \)
    - \( \text{logDosage} = \log_{10}(\max(\text{dosageMg}, 1)) \)
  - The ratio encodes how far into or past the withdrawal period the treatment is.
  - The log-dosage compresses dose range to avoid extreme scales.

### 3.2 Synthetic dataset generation script

File: `scripts/generateSyntheticResidueDataset.js`

- Recreates `data/residue_samples.csv` with the same schema.
- Encodes a few hand-crafted scenarios (early vs late in withdrawal period, different compounds and dosages).
- Run manually with:

```bash
npm run data:generate
```

This is useful if the dataset file is ever deleted or corrupted.

---

## 4. AI model and algorithm

File: `lib/ai/model.ts`

### 4.1 Input and output types

```ts
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
```

### 4.2 Core algorithm (logistic-style risk model)

The model is intentionally **simple and interpretable**, inspired by pharmacokinetic decay but not tied to a specific real-world PK model.

1. **Feature computation**

   Given `ResidueInput`, we reuse `createFeatureFromInput`:

   - \( \text{timeRatio} = \frac{\text{daysSinceLastDose}}{\text{withdrawalDays}} \) (with safe guards for zero/negative values).
   - \( \text{logDosage} = \log_{10}(\text{dosageMg}) \).

2. **Linear risk score**

   The model uses hand-tuned coefficients:

   - Bias \( b = 0.5 \)
   - Weight on `timeRatio`: \( w_{\text{time}} = -4.0 \)
   - Weight on `logDosage`: \( w_{\text{dose}} = 0.8 \)

   Linear score:

   \[
   s = b + w_{\text{time}} \cdot \text{timeRatio} + w_{\text{dose}} \cdot \text{logDosage}
   \]

   Intuition:

   - Larger **timeRatio** (further past withdrawal period) → **decreases** risk.
   - Larger **dosage** → **increases** risk (but on a log scale).

3. **Sigmoid to probability**

   The score is fed through a logistic (sigmoid) function:

   \[
   p = \sigma(s) = \frac{1}{1 + e^{-s}}
   \]

   This yields a probability \( p \in (0, 1) \) representing “estimated residue risk.”

4. **Risk label bucketing**

   - `LOW` if \( p < 0.33 \)
   - `MODERATE` if \( 0.33 \le p < 0.66 \)
   - `HIGH` if \( p \ge 0.66 \)

5. **Compliance and withdrawal status**

   - `compliant = (timeRatio >= 1)` → has passed labeled withdrawal period.
   - `safeHarvestDateStatus`:
     - `"COMPLIANT"` if `compliant` is `true`.
     - `"IN_WITHDRAWAL"` otherwise.

6. **Explanatory message**

   - If still in withdrawal (`timeRatio < 1`):
     - Computes remaining days:
       \[
       \text{remainingDays} = \max\left(0,\lceil \text{withdrawalDays} - \text{daysSinceLastDose} \rceil\right)
       \]
     - Returns a message recommending to wait the remaining days.
   - If past withdrawal (`timeRatio >= 1`):
     - Different messages for LOW, MODERATE, HIGH risk, suggesting more conservative workflows (e.g., **additional screening** or **confirmatory lab testing** for higher risk).

### 4.3 Implementation summary

The main exported function is:

- **`predictResidueRisk(input: ResidueInput): ResiduePrediction`**
  - Computes features and probability.
  - Derives risk label, compliance, status, and text message.
  - Used by API routes and tests to ensure consistent logic.

---

## 5. API endpoints

### 5.1 `POST /api/predict-residue`

File: `app/api/predict-residue/route.ts`

Request body (JSON):

```json
{
  "species": "cattle",
  "productType": "milk",
  "compound": "Oxytetracycline",
  "dosageMg": 500,
  "withdrawalDays": 7,
  "daysSinceLastDose": 3
}
```

Validation rules:

- `species`, `productType`, `compound`: required non-empty strings.
- `dosageMg`:
  - Parsed from number or numeric string.
  - Must be `> 0`.
- `withdrawalDays`:
  - Parsed from number or numeric string.
  - Must be `>= 0`.
- `daysSinceLastDose`:
  - Parsed from number or numeric string.
  - Must be `>= 0`.

Responses:

- **200 OK**:

  ```json
  {
    "input": { "...": "echoed normalized input" },
    "prediction": {
      "probability": 0.57,
      "riskLabel": "MODERATE",
      "compliant": false,
      "message": "Product is still within the withdrawal period...",
      "safeHarvestDateStatus": "IN_WITHDRAWAL"
    }
  }
  ```

- **400 Bad Request**:
  - JSON `{ "error": "Missing or invalid 'dosageMg' field." }` etc.

- **500 Internal Server Error**:
  - JSON `{ "error": "Failed to process request. Please check your input and try again." }`
  - Any unexpected runtime error is logged to the server console.

### 5.2 Python FastAPI backend (`backend/`)

You can also run a **standalone Python backend** using FastAPI. This mirrors the logic of the Next.js API routes but lives in a dedicated `backend` folder.

Structure:

- `backend/requirements.txt`: Python dependencies.
- `backend/app/main.py`: FastAPI app with endpoints.
- `backend/app/schemas.py`: Pydantic models and response schemas.
- `backend/app/ai/dataset.py`: Dataset loading and feature engineering.
- `backend/app/ai/model.py`: Risk model implementation (Python version).

Install and run:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate,ps1
pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Key endpoints:

- `GET /health`
  - Simple health probe: `{ "status": "ok" }`.

- `POST /predict-residue`
  - Request body (JSON, snake_case for Python):

    ```json
    {
      "species": "cattle",
      "product_type": "milk",
      "compound": "Oxytetracycline",
      "dosage_mg": 500,
      "withdrawal_days": 7,
      "days_since_last_dose": 3
    }
    ```

  - Response (shape equivalent to the Next.js route but with snake_case keys):

    ```json
    {
      "input": { "...": "echoed normalized input" },
      "prediction": {
        "probability": 0.57,
        "risk_label": "MODERATE",
        "compliant": false,
        "message": "Product is still within the withdrawal period...",
        "safe_harvest_date_status": "IN_WITHDRAWAL"
      }
    }
    ```

- `GET /self-test`

  ```json
  {
    "status": "ok",
    "dataset_loaded": true,
    "sanity_check": true,
    "example_prediction": {
      "probability": 0.62,
      "risk_label": "HIGH",
      "compliant": false,
      "message": "...",
      "safe_harvest_date_status": "IN_WITHDRAWAL"
    }
  }
  ```

  - `dataset_loaded` verifies `data/residue_samples.csv` is present and parsed from Python.
  - `sanity_check` ensures the example scenario is still in withdrawal, as expected.

#### 5.2.1 Frontend → FastAPI integration

- `components/ResidueRiskForm.tsx` reads an optional environment variable:

  - `NEXT_PUBLIC_BACKEND_URL` (for example `http://localhost:8000`).

- If this variable is set, the frontend sends requests to:

  - `${NEXT_PUBLIC_BACKEND_URL}/predict-residue`

- If not set, it falls back to the internal Next.js route `/api/predict-residue`.

Example `.env.local` (Next.js root):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

With this setup:

- You can run **Next.js** and **FastAPI** side by side.
- The UI stays the same, but all AI inference can be handled by the Python backend.

---

## 6. Database schema (reference)

File: `database/setup.sql`

Defines a Postgres schema for a production-ready livestock AMU system:

- **Custom type**:
  - `user_role` enum: `FARMER`, `VET`, `INSPECTOR`, `ADMIN`.
- **Tables**:
  - `users`: Basic user profiles and roles.
  - `farms`: Farm ownership, location, and metadata.
  - `animals`: Livestock per farm (species, age, weight, tag number).
  - `antimicrobial_usage`: Recorded treatments (drug, compound, dosage, dates, prescriber).
  - `mrl_limits`: Maximum residue limits by compound, species, and product type (value + withdrawal days).
- **Views**:
  - `v_active_treatments`: Active treatments still within withdrawal periods.
  - `v_mrl_compliance`: Derived view computing safe date and compliance status.

The current app does **not** yet connect to this database; it is provided as a ready-made schema for future integration (e.g., via a Next.js API with a Postgres client).

---

## 7. Scripts, tests, and development workflow

### 7.1 Install dependencies

```bash
npm install
```

### 7.2 Run the dev server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### 7.3 Build and start (production)

```bash
npm run build
npm start
```

### 7.4 Linting

```bash
npm run lint
```

Configured via `eslint.config.mjs` with Next.js + TypeScript rules and Tailwind v4.

### 7.5 Dataset regeneration

Regenerate the synthetic dataset if needed:

```bash
npm run data:generate
```

### 7.6 Minimal AI/model tests

Script: `scripts/testResidueModel.js`

- Tries to load `predictResidueRisk` from the compiled Next.js server output (`.next/server/chunks/lib_ai_model.js`) or, as a fallback, from the TypeScript source if `ts-node` is available.
- Runs two scenarios:
  - **Within withdrawal period** (should be flagged as `IN_WITHDRAWAL`).
  - **Past withdrawal period** (should be `COMPLIANT` with lower risk).

Run:

```bash
npm run test:ai
```

Output is logged to the terminal for quick inspection.

---

## 8. Limitations and non-clinical use disclaimer

- The dataset in `data/residue_samples.csv` is **synthetic** and intended only to demonstrate data flows and modeling patterns.
- The AI model in `lib/ai/model.ts` is **not trained** on real MRL data; it uses hand-tuned coefficients to approximate intuitive behavior.
- The system must **not** be used for:
  - Regulatory decisions about real milk or meat batches.
  - Clinical treatment decisions for animals or humans.
  - Any safety-critical application.

It is suitable as a **prototype and educational example** of how to wire together:

- A modern **Next.js frontend**,
- A **synthetic dataset and feature engineering pipeline**,
- A simple **risk scoring model**,
- And **API endpoints** that deliver AI-assisted predictions to the UI.
