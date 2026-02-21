import { NextResponse } from "next/server";

import { generateContent } from "../../../lib/gemini";
import { generateAnalyzePrompt } from "../../../lib/prompts";
import { trimText, safeJSONParse } from "../../../lib/utils";

export async function POST(request) {
  try {
    const url = new URL(request.url);
    const modeParam = url.searchParams.get("mode");
    const mode = modeParam === "quick" ? "quick" : "normal";

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const trimmedText = trimText(body?.text);
    console.log("Incoming text:", trimmedText);
    console.log("Analyze mode:", mode);

    if (!trimmedText) {
      return NextResponse.json({ error: "text is required." }, { status: 400 });
    }

    const analyzePrompt = generateAnalyzePrompt(trimmedText, mode);
    const analyzeRaw = await generateContent(analyzePrompt);
    console.log("Gemini analyze response:", analyzeRaw);

    const parsed = safeJSONParse(analyzeRaw, {
      summary: [],
      concepts: [],
      quiz: { mcq: [], short: [] },
    });

    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        error: "Failed to analyze text.",
        message,
      },
      { status: 500 }
    );
  }
}
