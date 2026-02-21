export function generateAnalyzePrompt(text, mode = "normal") {
  const isQuickMode = mode === "quick";
  const modeInstruction = isQuickMode
    ? "Mode: quick. Keep output compact and focused on the highest-value learning points."
    : "Mode: normal. Return the full study output.";

  const modeRules = isQuickMode
    ? [
        "- summary must contain at most 5 points.",
        "- include only the most important concepts (high priority ideas only).",
        "- reduce quiz size: at most 1 mcq and 1 short question.",
        "- if quiz is skipped due to low content quality, return empty arrays for quiz.mcq and quiz.short.",
      ]
    : [
        "- summary must contain at most 8 points.",
        "- include the key concepts needed for full understanding.",
        "- include a complete quiz set for practice (mcq and short).",
      ];

  return [
    "You are a study assistant.",
    "Analyze the content and produce summary, concepts, and quiz.",
    modeInstruction,
    "Return STRICT JSON only.",
    "Do not include markdown, explanation, code fences, or extra keys.",
    "Do not output any text before or after the JSON object.",
    "Use this exact JSON schema:",
    "{",
    '  "summary": ["", ""],',
    '  "concepts": [',
    '    { "term": "", "definition": "" }',
    "  ],",
    '  "quiz": {',
    '    "mcq": [',
    "      {",
    '        "question": "",',
    '        "options": ["", "", "", ""],',
    '        "answer": ""',
    "      }",
    "    ],",
    '    "short": [',
    "      {",
    '        "question": "",',
    '        "answer": ""',
    "      }",
    "    ]",
    "  }",
    "}",
    "Rules:",
    "- summary points must be clear, short, and crisp.",
    "- summary points must be plain text only (no bullets, no '*', no '-', no numbering symbols).",
    "- concepts must contain key terms with very simple beginner-friendly definitions.",
    "- each definition must be 1-2 short lines maximum and avoid complex wording.",
    "- use plain, easy language for all fields.",
    "- quiz questions should feel exam-level and test understanding, not trivia.",
    "- mcq options must contain exactly 4 choices.",
    "- mcq options must be meaningful and plausible; avoid obvious wrong choices.",
    "- Each mcq answer must exactly match one option string.",
    "- short answers should be concise and correct.",
    ...modeRules,
    "- Output valid JSON only.",
    "",
    "Content:",
    text,
  ].join("\n");
}
