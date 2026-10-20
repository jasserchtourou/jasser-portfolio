// Stateless admin session: the cookie holds "<expiresAt>.<HMAC-SHA256(expiresAt)>", signed with
// ADMIN_SECRET. Web Crypto only, so the same code runs in middleware (Edge) and route handlers.

export const SESSION_COOKIE = 'admin_session';
export const SESSION_TTL_S = 60 * 60 * 12; // 12 h

const enc = new TextEncoder();

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 32) throw new Error('ADMIN_SECRET must be set (at least 32 characters).');
  return s;
}

async function hmac(message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

// Constant-time comparison of two strings.
export function safeEqual(a, b) {
  const x = enc.encode(String(a));
  const y = enc.encode(String(b));
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function createSession() {
  const expiresAt = Date.now() + SESSION_TTL_S * 1000;
  return `${expiresAt}.${await hmac(String(expiresAt))}`;
}

export async function verifySession(token) {
  if (!token) return false;
  const [expiresAt, sig] = token.split('.');
  if (!expiresAt || !sig || Number(expiresAt) < Date.now()) return false;
  try {
    return safeEqual(sig, await hmac(expiresAt));
  } catch {
    return false;
  }
}
