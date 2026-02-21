import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const MODEL_CANDIDATES = [
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

let activeModelName = null;

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function shouldTryNextModel(message) {
  const lower = message.toLowerCase();
  return (
    lower.includes("404") ||
    lower.includes("not found") ||
    lower.includes("429") ||
    lower.includes("quota")
  );
}

async function generateWithModel(modelName, prompt) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const response = result.response;
  return response.text();
}

export async function generateContent(prompt) {
  try {
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string.");
    }

    if (activeModelName) {
      try {
        return await generateWithModel(activeModelName, prompt);
      } catch (error) {
        const message = getErrorMessage(error);
        if (!shouldTryNextModel(message)) {
          throw error;
        }
        activeModelName = null;
      }
    }

    let lastError = null;
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const text = await generateWithModel(modelName, prompt);
        activeModelName = modelName;
        console.log(`Using Gemini model: ${modelName}`);
        return text;
      } catch (error) {
        lastError = error;
        const message = getErrorMessage(error);
        if (!shouldTryNextModel(message)) {
          throw error;
        }
      }
    }

    throw lastError || new Error("No supported Gemini model is currently available.");
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Gemini API Error:", message);
    throw new Error(`Failed to generate content: ${message}`);
  }
}
