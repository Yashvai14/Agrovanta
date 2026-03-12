"use client";

import React, { useState } from "react";
import { useLanguage } from "./LanguageProvider";

type FormState = {
  species: string;
  productType: "milk" | "meat";
  compound: string;
  dosageMg: string;
  withdrawalDays: string;
  daysSinceLastDose: string;
};

type ApiResponse = {
  input: {
    species: string;
    productType: string;
    compound: string;
    dosageMg: number;
    withdrawalDays: number;
    daysSinceLastDose: number;
  };
  prediction: {
    probability: number;
    riskLabel: "LOW" | "MODERATE" | "HIGH";
    compliant: boolean;
    message: string;
    safeHarvestDateStatus: "IN_WITHDRAWAL" | "COMPLIANT";
  };
};

const defaultForm: FormState = {
  species: "cattle",
  productType: "milk",
  compound: "Oxytetracycline",
  dosageMg: "500",
  withdrawalDays: "7",
  daysSinceLastDose: "3",
};

const compounds = [
  "Oxytetracycline",
  "Enrofloxacin",
  "Penicillin G",
] as const;

export default function ResidueRiskForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const { language } = useLanguage();
  const locale = language === "en" ? "en" : "hi";

  const t = {
    en: {
      heading: "Residue Risk Estimator",
      subheading:
        "Simulate an antimicrobial treatment and estimate residue risk against withdrawal guidance.",
      badge: "AI-assisted prediction",
      species: "Species",
      cattle: "Cattle",
      sheep: "Sheep",
      goat: "Goat",
      productType: "Product type",
      milk: "Milk",
      meat: "Meat",
      compound: "Compound",
      dosage: "Dosage (mg)",
      withdrawal: "Withdrawal period (days)",
      daysSinceDose: "Days since last dose",
      calculating: "Calculating...",
      runCheck: "Run risk check",
      reset: "Reset to example scenario",
      predictionSummary: "Prediction summary",
      predictionIntro:
        "Submit the form to estimate whether milk or meat from the treated animal is likely to be within safe residue limits, based on withdrawal guidance and dose.",
      estimatedRisk: "Estimated residue risk",
      low: "Low",
      moderate: "Moderate",
      high: "High",
      riskSuffix: "risk",
      modelScore: "Model risk score:",
      pastWithdrawal: "Past withdrawal period",
      inWithdrawal: "In withdrawal period",
      withdrawalCheckPrefix: "Withdrawal check based on",
      withdrawalCheckSuffix: "day window",
      scenarioInputs: "Scenario inputs",
      speciesLabel: "Species:",
      productLabel: "Product:",
      compoundLabel: "Compound:",
      treatmentDetails: "Treatment details",
      dosageLabel: "Dosage:",
      dosageUnit: "mg",
      withdrawalLabel: "Withdrawal:",
      daysUnit: "days",
      sinceDoseLabel: "Since last dose:",
      emptyState:
        "Configure a treatment scenario on the left and run a check to see whether the system would flag the batch as safe to move forward or still within a withdrawal period.",
      disclaimer:
        "This tool is a demonstration of digital workflows for antimicrobial residue risk assessment. It does not replace official MRL tables, laboratory measurements, or veterinary judgment, and should not be used for regulatory decisions in production.",
    },
    hi: {
      heading: "अवशेष जोखिम अनुमानक",
      subheading:
        "एंटीमाइक्रोबियल उपचार का परिदृश्य बनाएं और वापसी मार्गदर्शन के आधार पर अवशेष जोखिम का अनुमान लगाएँ।",
      badge: "एआई‑सहायता प्राप्त पूर्वानुमान",
      species: "प्रजाति",
      cattle: "गाय/भैंस",
      sheep: "भेड़",
      goat: "बकरी",
      productType: "उत्पाद प्रकार",
      milk: "दूध",
      meat: "मांस",
      compound: "यौगिक",
      dosage: "खुराक (mg)",
      withdrawal: "वापसी अवधि (दिन)",
      daysSinceDose: "अंतिम खुराक के बाद दिन",
      calculating: "गणना हो रही है...",
      runCheck: "जोखिम जाँच चलाएँ",
      reset: "उदाहरण परिदृश्य पर रीसेट करें",
      predictionSummary: "पूर्वानुमान सारांश",
      predictionIntro:
        "फ़ॉर्म जमा करें ताकि यह अनुमान लगाया जा सके कि उपचारित पशु से प्राप्त दूध या मांस, वापसी मार्गदर्शन और खुराक के आधार पर सुरक्षित अवशेष सीमा के भीतर है या नहीं।",
      estimatedRisk: "अनुमानित अवशेष जोखिम",
      low: "कम",
      moderate: "मध्यम",
      high: "उच्च",
      riskSuffix: "जोखिम",
      modelScore: "मॉडल जोखिम स्कोर:",
      pastWithdrawal: "वापसी अवधि समाप्त",
      inWithdrawal: "वापसी अवधि में",
      withdrawalCheckPrefix: "वापसी जाँच",
      withdrawalCheckSuffix: "दिन की खिड़की पर आधारित",
      scenarioInputs: "परिदृश्य इनपुट",
      speciesLabel: "प्रजाति:",
      productLabel: "उत्पाद:",
      compoundLabel: "यौगिक:",
      treatmentDetails: "उपचार विवरण",
      dosageLabel: "खुराक:",
      dosageUnit: "mg",
      withdrawalLabel: "वापसी:",
      daysUnit: "दिन",
      sinceDoseLabel: "अंतिम खुराक से:",
      emptyState:
        "बाएँ तरफ उपचार परिदृश्य कॉन्फ़िगर करें और जाँच चलाएँ कि क्या सिस्टम बैच को आगे भेजने के लिए सुरक्षित या अभी भी वापसी अवधि के अंदर मानेगा।",
      disclaimer:
        "यह टूल एंटीमाइक्रोबियल अवशेष जोखिम मूल्यांकन के लिए डिजिटल वर्कफ़्लो का एक डेमो है। यह आधिकारिक MRL तालिकाओं, लैब परिणामों या पशु चिकित्सकीय निर्णय का विकल्प नहीं है और उत्पादन में विनियामक निर्णयों के लिए उपयोग नहीं किया जाना चाहिए।",
    },
  }[locale];

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const endpoint = backendBaseUrl
        ? `${backendBaseUrl}/predict-residue`
        : "/api/predict-residue";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          species: form.species,
          productType: form.productType,
          compound: form.compound,
          dosageMg: Number(form.dosageMg),
          withdrawalDays: Number(form.withdrawalDays),
          daysSinceLastDose: Number(form.daysSinceLastDose),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unexpected server error");
      }

      const data = (await response.json()) as ApiResponse;
      setResult(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const probabilityPercent =
    result != null ? Math.round(result.prediction.probability * 100) : null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left: Form */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-emerald-500/40 via-blue-500/30 to-sky-400/30 blur-2xl opacity-40" />
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {t.heading}
                </h2>
                <p className="text-sm text-white/60 mt-1">{t.subheading}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                {t.badge}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t.species}
                  </label>
                  <select
                    value={form.species}
                    onChange={(e) => handleChange("species", e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="cattle">{t.cattle}</option>
                    <option value="sheep">{t.sheep}</option>
                    <option value="goat">{t.goat}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t.productType}
                  </label>
                  <select
                    value={form.productType}
                    onChange={(e) =>
                      handleChange(
                        "productType",
                        e.target.value as FormState["productType"],
                      )
                    }
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="milk">{t.milk}</option>
                    <option value="meat">{t.meat}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t.compound}
                  </label>
                  <select
                    value={form.compound}
                    onChange={(e) => handleChange("compound", e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {compounds.map((compound) => (
                      <option key={compound} value={compound}>
                        {compound}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t.dosage}
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={form.dosageMg}
                    onChange={(e) => handleChange("dosageMg", e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t.withdrawal}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.withdrawalDays}
                    onChange={(e) =>
                      handleChange("withdrawalDays", e.target.value)
                    }
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="7"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    {t.daysSinceDose}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.daysSinceLastDose}
                    onChange={(e) =>
                      handleChange("daysSinceLastDose", e.target.value)
                    }
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="3"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      {t.calculating}
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {t.runCheck}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm(defaultForm);
                    setResult(null);
                    setError(null);
                  }}
                  className="text-xs text-white/50 hover:text-white/80 underline-offset-4 hover:underline"
                >
                  {t.reset}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Result */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-white/5 border border-white/15 p-6 sm:p-8 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              {t.predictionSummary}
            </h3>
            <p className="text-sm text-white/60 mb-4">
              {t.predictionIntro}
            </p>

            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white/60 uppercase tracking-wide">
                      {t.estimatedRisk}
                    </p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {result.prediction.riskLabel === "LOW"
                        ? t.low
                        : result.prediction.riskLabel === "MODERATE"
                          ? t.moderate
                          : t.high}{" "}
                      {t.riskSuffix}
                    </p>
                    {probabilityPercent != null && (
                      <p className="text-sm text-white/60 mt-1">
                        {t.modelScore}{" "}
                        <span className="font-semibold text-emerald-300">
                          {probabilityPercent}%
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        result.prediction.compliant
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {result.prediction.safeHarvestDateStatus ===
                      "COMPLIANT"
                        ? t.pastWithdrawal
                        : t.inWithdrawal}
                    </span>
                    <span className="text-xs text-white/40">
                      {t.withdrawalCheckPrefix}{" "}
                      {result.input.withdrawalDays} {t.withdrawalCheckSuffix}
                    </span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      result.prediction.riskLabel === "LOW"
                        ? "bg-emerald-500"
                        : result.prediction.riskLabel === "MODERATE"
                          ? "bg-amber-400"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${probabilityPercent ?? 0}%`,
                    }}
                  />
                </div>

                <p className="text-sm text-white/70 leading-relaxed">
                  {result.prediction.message}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-white/60 pt-2 border-t border-white/10">
                  <div>
                    <p className="font-medium text-white/80 mb-1">
                      {t.scenarioInputs}
                    </p>
                    <p>
                      {t.speciesLabel}{" "}
                      <span className="font-semibold text-white">
                        {result.input.species}
                      </span>
                    </p>
                    <p>
                      {t.productLabel}{" "}
                      <span className="font-semibold text-white">
                        {result.input.productType}
                      </span>
                    </p>
                    <p>
                      {t.compoundLabel}{" "}
                      <span className="font-semibold text-white">
                        {result.input.compound}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-white/80 mb-1">
                      {t.treatmentDetails}
                    </p>
                    <p>
                      {t.dosageLabel}{" "}
                      <span className="font-semibold text-white">
                        {result.input.dosageMg} {t.dosageUnit}
                      </span>
                    </p>
                    <p>
                      {t.withdrawalLabel}{" "}
                      <span className="font-semibold text-white">
                        {result.input.withdrawalDays} {t.daysUnit}
                      </span>
                    </p>
                    <p>
                      {t.sinceDoseLabel}{" "}
                      <span className="font-semibold text-white">
                        {result.input.daysSinceLastDose} {t.daysUnit}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-white/15 rounded-2xl p-4 text-sm text-white/40">
                {t.emptyState}
              </div>
            )}
          </div>

          <p className="text-[11px] text-white/30 leading-relaxed">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

