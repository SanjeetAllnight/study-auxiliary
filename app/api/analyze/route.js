import { NextResponse } from "next/server";

import { generateContent } from "../../../lib/gemini";
import { generateAnalyzePrompt } from "../../../lib/prompts";
import { trimText, safeJSONParse } from "../../../lib/utils";

const MAX_ITEMS = {
  summary: 5,
  concepts: 3,
  mcq: 3,
  short: 2,
};
const MAX_GENERATION_ATTEMPTS = 2;
const RESERVED_KEYS = new Set([
  "summary",
  "concepts",
  "quiz",
  "mcq",
  "short",
  "question",
  "options",
  "answer",
  "term",
  "definition",
]);

function toCleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanSummaryPoint(value) {
  return toCleanString(value).replace(/^[-*]+\s*/, "").replace(/^\d+[\).\-\s]+/, "");
}

function parseAnalyzeJSON(raw) {
  if (typeof raw !== "string") {
    return null;
  }

  const direct = safeJSONParse(raw, null);
  if (direct !== null) {
    return direct;
  }

  const withoutCodeFence = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  const fenceParsed = safeJSONParse(withoutCodeFence, null);
  if (fenceParsed !== null) {
    return fenceParsed;
  }

  const start = withoutCodeFence.indexOf("{");
  const end = withoutCodeFence.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  const extracted = withoutCodeFence.slice(start, end + 1);
  return safeJSONParse(extracted, null);
}

function salvageAnalyzeFromText(raw) {
  if (typeof raw !== "string") {
    return null;
  }

  const quotedValues = Array.from(raw.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g))
    .map((match) => match[1].trim())
    .filter(Boolean)
    .filter((value) => !RESERVED_KEYS.has(value.toLowerCase()));

  if (quotedValues.length === 0) {
    return null;
  }

  return {
    summary: quotedValues.slice(0, MAX_ITEMS.summary),
    concepts: [],
    quiz: { mcq: [], short: [] },
  };
}

function clampAnalyzeResult(data, mode) {
  const fallback = {
    summary: [],
    concepts: [],
    quiz: { mcq: [], short: [] },
  };

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return fallback;
  }

  const rawSummary = Array.isArray(data.summary) ? data.summary : [];
  const rawConcepts = Array.isArray(data.concepts) ? data.concepts : [];
  const rawQuiz =
    data.quiz && typeof data.quiz === "object" && !Array.isArray(data.quiz)
      ? data.quiz
      : {};
  const rawMcq = Array.isArray(rawQuiz.mcq) ? rawQuiz.mcq : [];
  const rawShort = Array.isArray(rawQuiz.short) ? rawQuiz.short : [];

  const quizLimits =
    mode === "quick"
      ? { mcq: 1, short: 1 }
      : { mcq: MAX_ITEMS.mcq, short: MAX_ITEMS.short };

  const summary = rawSummary
    .map(cleanSummaryPoint)
    .filter(Boolean)
    .slice(0, MAX_ITEMS.summary);

  const concepts = rawConcepts
    .map((item) => {
      const concept =
        item && typeof item === "object" && !Array.isArray(item) ? item : {};

      return {
        term: toCleanString(concept.term),
        definition: toCleanString(concept.definition),
      };
    })
    .filter((item) => item.term && item.definition)
    .slice(0, MAX_ITEMS.concepts);

  const mcq = rawMcq
    .map((item) => {
      const question = toCleanString(item?.question);
      const options = Array.isArray(item?.options)
        ? item.options.map(toCleanString).filter(Boolean).slice(0, 4)
        : [];
      const answer = toCleanString(item?.answer);

      return { question, options, answer };
    })
    .filter(
      (item) =>
        item.question &&
        item.options.length === 4 &&
        item.answer &&
        item.options.includes(item.answer)
    )
    .slice(0, quizLimits.mcq);

  const short = rawShort
    .map((item) => ({
      question: toCleanString(item?.question),
      answer: toCleanString(item?.answer),
    }))
    .filter((item) => item.question && item.answer)
    .slice(0, quizLimits.short);

  return {
    summary,
    concepts,
    quiz: {
      mcq,
      short,
    },
  };
}

function hasAnyContent(result) {
  if (!result || typeof result !== "object") {
    return false;
  }

  const summaryCount = Array.isArray(result.summary) ? result.summary.length : 0;
  const conceptCount = Array.isArray(result.concepts) ? result.concepts.length : 0;
  const mcqCount = Array.isArray(result.quiz?.mcq) ? result.quiz.mcq.length : 0;
  const shortCount = Array.isArray(result.quiz?.short) ? result.quiz.short.length : 0;

  return summaryCount > 0 || conceptCount > 0 || mcqCount > 0 || shortCount > 0;
}

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
    console.log("Incoming text length:", trimmedText.length);
    console.log("Analyze mode:", mode);

    if (!trimmedText) {
      return NextResponse.json({ error: "text is required." }, { status: 400 });
    }

    const analyzePrompt = generateAnalyzePrompt(trimmedText, mode);
    let clamped = { summary: [], concepts: [], quiz: { mcq: [], short: [] } };

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const analyzeRaw = await generateContent(analyzePrompt);
      console.log(
        `Gemini analyze response length (attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}):`,
        typeof analyzeRaw === "string" ? analyzeRaw.length : 0
      );

      const parsed = parseAnalyzeJSON(analyzeRaw);
      if (parsed === null) {
        const salvaged = salvageAnalyzeFromText(analyzeRaw);
        if (salvaged) {
          console.warn(
            `Gemini JSON was incomplete on attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}. Using salvaged summary fallback.`
          );
          clamped = clampAnalyzeResult(salvaged, mode);
          break;
        }

        console.warn(
          `Failed to parse Gemini JSON on attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}. Snippet:`,
          typeof analyzeRaw === "string" ? analyzeRaw.slice(0, 200) : ""
        );
        continue;
      }

      clamped = clampAnalyzeResult(parsed, mode);
      if (hasAnyContent(clamped)) {
        break;
      }

      console.warn(
        `Gemini returned valid JSON but no usable content on attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}.`
      );
    }

    return NextResponse.json(clamped);
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
