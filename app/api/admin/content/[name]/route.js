import { NextResponse } from 'next/server';
import { CONTENT_FILES, ConflictError, readContent, storageMode, writeContent } from '@/src/lib/admin/store';
import { ValidationError, validateContent } from '@/src/lib/admin/validate';

export const dynamic = 'force-dynamic';

const notFound = () => NextResponse.json({ error: 'Unknown content file.' }, { status: 404 });

export async function GET(_request, { params }) {
  if (!CONTENT_FILES.includes(params.name)) return notFound();
  try {
    return NextResponse.json({ ...(await readContent(params.name)), storage: storageMode() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}

export async function PUT(request, { params }) {
  if (!CONTENT_FILES.includes(params.name)) return notFound();
  const body = await request.json().catch(() => null);
  try {
    const data = validateContent(params.name, body?.data);
    const message = `content: ${body.message?.slice(0, 120) || `update ${params.name}`} (back office)`;
    const saved = await writeContent(params.name, data, body.version, message);
    return NextResponse.json({ ...saved, data, storage: storageMode() });
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof ConflictError) return NextResponse.json({ error: e.message }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
