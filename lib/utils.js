const MAX_TEXT_LENGTH = 5000;

export function trimText(text) {
  if (typeof text !== "string") {
    return "";
  }

  const normalized = text.trim();
  if (normalized.length <= MAX_TEXT_LENGTH) {
    return normalized;
  }

  return normalized.slice(0, MAX_TEXT_LENGTH);
}

export function safeJSONParse(text, fallback = null) {
  if (typeof text !== "string") {
    return fallback;
  }

  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}
