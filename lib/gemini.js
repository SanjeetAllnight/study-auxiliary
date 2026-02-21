import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// Keep models that are known to work in this project setup.
const MODEL_CANDIDATES = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash"];
const RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 10000;

const GENERATION_CONFIG = {
  temperature: 0.5,
  maxOutputTokens: 800,
};

let activeModelName = null;

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function isRetryableError(message) {
  const lower = message.toLowerCase();
  return (
    lower.includes("503") ||
    lower.includes("overloaded") ||
    lower.includes("timeout") ||
    lower.includes("429") ||
    lower.includes("quota")
  );
}

function isSwitchableModelError(message) {
  const lower = message.toLowerCase();
  return lower.includes("404") || lower.includes("not found") || isRetryableError(lower);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout(promise, timeoutMs) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Request timeout after ${timeoutMs}ms`)),
      timeoutMs
    );
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function generateWithModel(modelName, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: GENERATION_CONFIG,
  });
  const result = await model.generateContent(prompt);
  const finishReason = result.response?.candidates?.[0]?.finishReason;
  console.log(`Gemini finish reason (${modelName}):`, finishReason || "unknown");

  return result.response.text();
}

function getModelOrder() {
  if (!activeModelName || !MODEL_CANDIDATES.includes(activeModelName)) {
    return MODEL_CANDIDATES;
  }

  return [activeModelName, ...MODEL_CANDIDATES.filter((name) => name !== activeModelName)];
}

async function generateWithRetry(modelName, prompt) {
  let lastError = null;

  for (let attempt = 1; attempt <= RETRY_LIMIT; attempt += 1) {
    console.log(`Using Gemini model: ${modelName} (attempt ${attempt}/${RETRY_LIMIT})`);

    try {
      return await withTimeout(generateWithModel(modelName, prompt), REQUEST_TIMEOUT_MS);
    } catch (error) {
      lastError = error;
      const message = getErrorMessage(error);
      const canRetry = isRetryableError(message) && attempt < RETRY_LIMIT;

      if (!canRetry) {
        throw error;
      }

      console.warn(
        `Retrying ${modelName} in ${RETRY_DELAY_MS}ms (attempt ${attempt}/${RETRY_LIMIT}, reason: ${message})`
      );
      await sleep(RETRY_DELAY_MS);
    }
  }

  throw lastError || new Error(`Failed to generate with model ${modelName}.`);
}

export async function generateContent(prompt) {
  try {
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.");
    }

    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string.");
    }

    const modelOrder = getModelOrder();
    let lastError = null;

    for (let index = 0; index < modelOrder.length; index += 1) {
      const modelName = modelOrder[index];

      try {
        const text = await generateWithRetry(modelName, prompt);
        activeModelName = modelName;
        return text;
      } catch (error) {
        lastError = error;
        const message = getErrorMessage(error);
        const hasNext = index < modelOrder.length - 1;

        if (!hasNext || !isSwitchableModelError(message)) {
          throw error;
        }

        console.warn(
          `Fallback triggered: switching from ${modelName} to ${modelOrder[index + 1]} (reason: ${message})`
        );
      }
    }

    throw lastError || new Error("No supported Gemini model is currently available.");
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("Gemini API Error:", message);
    throw new Error(`Failed to generate content: ${message}`);
  }
}
