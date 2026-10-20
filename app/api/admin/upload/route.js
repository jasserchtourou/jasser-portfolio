import { NextResponse } from 'next/server';
import { writeUpload } from '@/src/lib/admin/store';

// Vercel caps request bodies at 4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/avif': 'avif' };

export async function POST(request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: 'Use a WebP, PNG, JPEG or AVIF image.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Images must be 4 MB or smaller.' }, { status: 400 });

  const base = String(form.get('name') || file.name.replace(/\.[^.]+$/, ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'image';
  const fileName = `${base}-${Date.now().toString(36)}.${ext}`;
  try {
    return NextResponse.json(await writeUpload(fileName, Buffer.from(await file.arrayBuffer())));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
