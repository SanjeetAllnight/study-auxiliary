import { NextResponse } from "next/server";

import { generateContent } from "../../../lib/gemini";
import {
  generateSummaryPrompt,
  generateConceptPrompt,
  generateQuizPrompt,
} from "../../../lib/prompts";
import { trimText, safeJSONParse } from "../../../lib/utils.js";

function formatSummaryLines(text) {
  if (typeof text !== "string") {
    return [];
  }

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s*/, ""));
}

export async function POST(request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const trimmedText = trimText(body?.text);
    console.log("Incoming text:", trimmedText);

    if (!trimmedText) {
      return NextResponse.json({ error: "text is required." }, { status: 400 });
    }

    const summaryPrompt = generateSummaryPrompt(trimmedText);
    const conceptPrompt = generateConceptPrompt(trimmedText);
    const quizPrompt = generateQuizPrompt(trimmedText);

    const summaryRaw = await generateContent(summaryPrompt);
    console.log("Gemini summary response:", summaryRaw);

    const conceptsRaw = await generateContent(conceptPrompt);
    console.log("Gemini concepts response:", conceptsRaw);

    const quizRaw = await generateContent(quizPrompt);
    console.log("Gemini quiz response:", quizRaw);

    const summary = formatSummaryLines(summaryRaw);

    const conceptsParsed = safeJSONParse(conceptsRaw, []);
    const concepts = Array.isArray(conceptsParsed) ? conceptsParsed : [];

    const quizParsed = safeJSONParse(quizRaw, {});
    const quiz =
      quizParsed && typeof quizParsed === "object" && !Array.isArray(quizParsed)
        ? quizParsed
        : {};

    return NextResponse.json({
      summary,
      concepts,
      quiz,
    });
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