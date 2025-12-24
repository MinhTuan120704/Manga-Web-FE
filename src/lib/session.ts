/**
 * Session management for analytics tracking
 * Session ID persists within the same browser tab (sessionStorage)
 */

const SESSION_KEY = "manga_session_id";

/**
 * Generate a cryptographically secure session ID
 */
function generateSessionId(): string {
  // Use crypto.randomUUID() for cryptographically secure random ID
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${Date.now()}-${crypto.randomUUID()}`;
  }
  // Fallback for older browsers using crypto.getRandomValues()
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return `${Date.now()}-${Array.from(array, (n) => n.toString(16)).join("")}`;
}

/**
 * Get or create a unique session ID
 * - Persists across page refreshes in the same tab
 * - New ID generated for new tabs/windows
 */
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Reset session ID - creates a new session
 * Called after a successful click to separate different search flows
 */
export function resetSessionId(): string {
  const newSessionId = generateSessionId();
  sessionStorage.setItem(SESSION_KEY, newSessionId);
  return newSessionId;
}
