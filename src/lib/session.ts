/**
 * Session management for analytics tracking
 * Session ID persists within the same browser tab (sessionStorage)
 */

const SESSION_KEY = "manga_session_id";

/**
 * Get or create a unique session ID
 * - Persists across page refreshes in the same tab
 * - New ID generated for new tabs/windows
 */
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Reset session ID - creates a new session
 * Called after a successful click to separate different search flows
 */
export function resetSessionId(): string {
  const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  sessionStorage.setItem(SESSION_KEY, newSessionId);
  return newSessionId;
}
