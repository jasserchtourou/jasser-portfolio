import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_TTL_S, createSession, safeEqual } from '@/src/lib/admin/session';

// Best-effort brute-force brake: per-IP failure counter, kept per server instance.
const failures = new Map();
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60e3;

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const entry = failures.get(ip);
  if (entry && entry.count >= MAX_FAILURES && Date.now() - entry.at < LOCK_MS) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'The back office is not configured: set ADMIN_PASSWORD and ADMIN_SECRET.' }, { status: 503 });
  }

  const { password } = await request.json().catch(() => ({}));
  if (typeof password !== 'string' || !safeEqual(password, expected)) {
    failures.set(ip, { count: (entry && Date.now() - entry.at < LOCK_MS ? entry.count : 0) + 1, at: Date.now() });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }

  failures.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_S,
  });
  return res;
}
