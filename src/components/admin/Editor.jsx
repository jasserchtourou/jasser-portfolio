'use client';

import { AlertTriangle, ExternalLink, Loader2, RotateCcw, Save } from 'lucide-react';

// Page frame for every content editor: title, load/error states and a sticky save bar.
export function Editor({ title, description, content, saveMessage, children }) {
  const { loading, error, data, dirty, saving, notice, save, discard, reload, storage } = content;

  return (
    <div className="pb-32">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
      </header>

      {loading && !data ? (
        <p className="flex items-center gap-2 text-muted">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Loading…
        </p>
      ) : error && !data ? (
        <div className="card flex flex-wrap items-center gap-3 !border-accent/40 p-5" role="alert">
          <AlertTriangle size={18} className="text-accent-soft" aria-hidden="true" />
          <p className="flex-1 text-sm">{error}</p>
          <button type="button" className="btn-sm" onClick={reload}>
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">{children}</div>
      )}

      {data ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/10 bg-ink/90 backdrop-blur lg:left-60">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
            <p className="min-w-0 flex-1 text-sm" role="status" aria-live="polite">
              {notice ? (
                <span className={notice.tone === 'error' ? 'text-accent-soft' : 'text-fg'}>
                  {notice.text}{' '}
                  {notice.link ? (
                    <a href={notice.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-flow underline-offset-2 hover:underline">
                      View commit <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  ) : null}
                </span>
              ) : dirty ? (
                <span className="text-amber">Unsaved changes</span>
              ) : (
                <span className="text-subtle">
                  {storage?.mode === 'github' ? `Saving commits to ${storage.repo} (${storage.branch})` : 'Local mode: saving writes files on disk'}
                </span>
              )}
            </p>
            <button type="button" className="btn-sm" onClick={discard} disabled={!dirty || saving}>
              <RotateCcw size={15} aria-hidden="true" /> Discard
            </button>
            <button
              type="button"
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-accent-strong px-4 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => save(typeof saveMessage === 'function' ? saveMessage() : saveMessage)}
              disabled={!dirty || saving}
            >
              {saving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
