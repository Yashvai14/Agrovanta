import { NextResponse } from "next/server";

type LibreTranslateResponse = {
  translatedText: string;
};

const LIBRE_TRANSLATE_ENDPOINT =
  process.env.LIBRE_TRANSLATE_ENDPOINT ??
  "https://translate.astian.org/translate";

export async function POST(request: Request) {
  try {
    const { text, targetLang } = (await request.json()) as {
      text?: string;
      targetLang?: string;
    };

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field." },
        { status: 400 },
      );
    }

    if (!targetLang || typeof targetLang !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'targetLang' field." },
        { status: 400 },
      );
    }

    // LibreTranslate expects ISO 639-1 codes, map if needed
    const mappedTarget =
      targetLang === "hi"
        ? "hi"
        : targetLang === "mr"
          ? "mr"
          : targetLang === "bn"
            ? "bn"
            : targetLang === "ta"
              ? "ta"
              : targetLang === "te"
                ? "te"
                : targetLang === "gu"
                  ? "gu"
                  : targetLang === "kn"
                    ? "kn"
                    : targetLang === "ml"
                      ? "ml"
                      : targetLang === "pa"
                        ? "pa"
                        : targetLang;

    const response = await fetch(LIBRE_TRANSLATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: mappedTarget,
        format: "text",
      }),
    });

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ error: "Upstream error" }));
      return NextResponse.json(
        {
          error:
            (errorBody as { error?: string }).error ??
            "Translation service returned an error.",
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as LibreTranslateResponse;

    return NextResponse.json(
      { translatedText: data.translatedText ?? text },
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in /api/translate:", error);
    return NextResponse.json(
      {
        error:
          "Failed to contact translation service. Please try again later.",
      },
      { status: 500 },
    );
  }
}

