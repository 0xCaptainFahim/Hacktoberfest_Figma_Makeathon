const ALLOWED_ROLES = new Set(["user", "assistant"]);
const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2_000;

/**
 * Produce the only chat history shape that may be forwarded to the model.
 * The browser must never be able to supply a system/developer message.
 */
export function sanitizeChatHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (message) =>
        message &&
        ALLOWED_ROLES.has(message.role) &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map(({ role, content }) => ({
      role,
      content: content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}
