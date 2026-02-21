export function generateAnalyzePrompt(text, mode = "normal") {
  const isQuickMode = mode === "quick";
  const modeLine = isQuickMode
    ? "Mode is quick: focus on only the most important points."
    : "Mode is normal: provide complete but concise study output.";
  const quizLimitLine = isQuickMode
    ? "Quiz limits for quick mode: mcq <= 1, short <= 1."
    : "Quiz limits for normal mode: mcq <= 3, short <= 2.";

  return [
    "You are a study assistant.",
    "Analyze the text and return study material as strict JSON.",
    modeLine,
    "Keep output minimal and concise.",
    "Do not exceed limits.",
    "Return STRICT JSON only. No markdown. No code fences. No extra text.",
    'Use exactly this top-level shape: {"summary":[],"concepts":[],"quiz":{"mcq":[],"short":[]}}',
    "Rules:",
    "- summary must contain at most 5 points.",
    "- summary points must be clear, short, and plain text (no bullet symbols).",
    "- concepts must contain at most 3 items.",
    "- concepts must contain only the most important terms.",
    "- concepts definitions must be simple and 1-2 short lines maximum.",
    "- use plain, easy language and avoid complex wording.",
    quizLimitLine,
    "- quiz questions should feel exam-level and test understanding, not trivia.",
    "- mcq options must contain exactly 4 meaningful and plausible choices.",
    "- Each mcq answer must exactly match one option string.",
    "- short answers should be concise and correct.",
    "- If content is insufficient, return empty arrays but still valid JSON.",
    "- Output valid JSON only.",
    "",
    "Text:",
    text,
  ].join("\n");
}
