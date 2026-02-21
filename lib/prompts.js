export function generateSummaryPrompt(text) {
  return [
    "You are a study assistant.",
    "Summarize the content into clear bullet points.",
    "Rules:",
    "- Maximum 8 bullet points.",
    "- Use simple, beginner-friendly language.",
    "- Keep each bullet concise and meaningful.",
    "- Output ONLY bullet points.",
    "- No title, no intro, no outro, no extra text.",
    "",
    "Content:",
    text,
  ].join("\n");
}

export function generateConceptPrompt(text) {
  return [
    "Extract key concepts from the content.",
    "Return STRICT JSON only.",
    "Do not include markdown, explanation, or extra keys.",
    "Use this exact schema:",
    "[",
    '  { "term": "", "definition": "" }',
    "]",
    "Rules:",
    "- term: short concept name.",
    "- definition: simple one-sentence explanation.",
    "- Return a valid JSON array.",
    "",
    "Content:",
    text,
  ].join("\n");
}

export function generateQuizPrompt(text) {
  return [
    "Create quiz questions from the content.",
    "Return STRICT JSON only.",
    "Do not include markdown, explanation, or extra keys.",
    "Use this exact schema:",
    "{",
    '  "mcq": [',
    "    {",
    '      "question": "",',
    '      "options": ["", "", "", ""],',
    '      "answer": ""',
    "    }",
    "  ],",
    '  "short": [',
    "    {",
    '      "question": "",',
    '      "answer": ""',
    "    }",
    "  ]",
    "}",
    "Rules:",
    "- mcq options must always contain exactly 4 choices.",
    "- mcq answer must exactly match one option string.",
    "- short answers should be concise and correct.",
    "- Return valid JSON object only.",
    "",
    "Content:",
    text,
  ].join("\n");
}
