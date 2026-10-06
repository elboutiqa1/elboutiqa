/**
 * Simple in-memory rate limiter for Edge/Middleware (Vercel compatible)
 * Uses a sliding window approach with auto-cleanup
 */

const rateLimitMap = new Map();

// Auto-cleanup every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitMap) {
    if (now - entry.lastRequest > entry.windowMs) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * @param {string} identifier - IP or unique key
 * @param {object} options
 * @param {number} options.maxRequests - max requests per window
 * @param {number} options.windowMs - time window in milliseconds
 * @returns {{ success: boolean, remaining: number, resetIn: number }}
 */
export function rateLimit(identifier, { maxRequests = 5, windowMs = 60000 } = {}) {
  cleanup();

  const now = Date.now();
  const key = identifier;

  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    rateLimitMap.set(key, {
      count: 1,
      windowStart: now,
      lastRequest: now,
    });
    return { success: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  entry.lastRequest = now;
  entry.count++;

  if (entry.count > maxRequests) {
    const resetIn = windowMs - (now - entry.windowStart);
    return { success: false, remaining: 0, resetIn };
  }

  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetIn: windowMs - (now - entry.windowStart),
  };
}
