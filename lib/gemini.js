import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. Gemini requests will fail until it is configured.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateContent(prompt) {
  try {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string.");
    }

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text?.trim() || "";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Gemini error";
    console.error("Gemini generateContent error:", message);
    throw new Error(`Failed to generate content: ${message}`);
  }
}
