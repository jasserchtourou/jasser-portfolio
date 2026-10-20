'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

// Loads one content file (content/<name>.json) through the admin API and saves it back.
// The editor works on a local copy; nothing is written until save() is called.
export function useContent(name) {
  const [state, setState] = useState({ loading: true, error: null, data: null, saved: null, version: null, storage: null });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { tone: 'ok' | 'error', text, link? }

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/admin/content/${name}`, { cache: 'no-store' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || `Loading failed (${res.status}).`);
      setState({ loading: false, error: null, data: body.data, saved: body.data, version: body.version, storage: body.storage });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, [name]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(() => state.data !== null && JSON.stringify(state.data) !== JSON.stringify(state.saved), [state.data, state.saved]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const setData = useCallback((update) => {
    setNotice(null);
    setState((s) => ({ ...s, data: typeof update === 'function' ? update(s.data) : update }));
  }, []);

  const save = useCallback(
    async (message) => {
      setSaving(true);
      setNotice(null);
      try {
        const res = await fetch(`/api/admin/content/${name}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: state.data, version: state.version, message }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || `Saving failed (${res.status}).`);
        setState((s) => ({ ...s, data: body.data, saved: body.data, version: body.version, storage: body.storage }));
        setNotice(
          body.storage?.mode === 'github'
            ? { tone: 'ok', text: 'Saved and committed. The live site updates once Vercel redeploys (about a minute).', link: body.commit }
            : { tone: 'ok', text: `Saved to content/${name}.json.` },
        );
        return true;
      } catch (e) {
        setNotice({ tone: 'error', text: e.message });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [name, state.data, state.version],
  );

  const discard = useCallback(() => {
    setNotice(null);
    setState((s) => ({ ...s, data: s.saved }));
  }, []);

  return { ...state, setData, save, discard, dirty, saving, notice, reload: load };
}
