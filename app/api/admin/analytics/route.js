import { NextResponse } from 'next/server';
import { getAnalytics } from '@/src/lib/admin/umami';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    return NextResponse.json(await getAnalytics(request.nextUrl.searchParams.get('range') ?? '7d'));
  } catch (e) {
    // With a share link, the page can still embed Umami's own share dashboard.
    return NextResponse.json({ error: e.message, shareUrl: process.env.UMAMI_SHARE_URL || null }, { status: 502 });
  }
}
