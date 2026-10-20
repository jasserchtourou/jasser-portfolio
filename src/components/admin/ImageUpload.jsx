'use client';

import { useId, useState } from 'react';
import { ImageUp, Loader2 } from 'lucide-react';

// Uploads an image to public/images/uploads (a commit in production) and reports its URL.
// Until Vercel redeploys, a just-uploaded image only exists in the repo, so the preview shows the
// local file instead of the URL.
export function ImageUpload({ label = 'Image', value, onChange, name }) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      if (name) form.append('name', name);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || `Upload failed (${res.status}).`);
      setPreview(URL.createObjectURL(file));
      onChange(body.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const shown = preview || value;
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex aspect-[16/10] w-48 items-center justify-center overflow-hidden rounded-lg border border-line/10 bg-raised">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="h-full w-full object-cover object-top" />
          ) : (
            <span className="text-xs text-subtle">No image</span>
          )}
        </div>
        <div className="min-w-[12rem] flex-1 space-y-2">
          <label htmlFor={id} className="btn-sm cursor-pointer">
            {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <ImageUp size={15} aria-hidden="true" />}
            {busy ? 'Uploading…' : 'Upload image'}
          </label>
          <input id={id} type="file" accept="image/webp,image/png,image/jpeg,image/avif" className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
          <input className="input font-mono !text-xs" value={value ?? ''} onChange={(e) => (setPreview(null), onChange(e.target.value))} placeholder="/images/… or upload" aria-label={`${label} path`} />
          {error ? (
            <p className="text-xs text-accent-soft">{error}</p>
          ) : (
            <p className="text-xs text-subtle">WebP, PNG, JPEG or AVIF, up to 4 MB. WebP at 1600 px wide works best.</p>
          )}
        </div>
      </div>
    </div>
  );
}
