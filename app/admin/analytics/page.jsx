'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Panel } from '@/src/components/admin/fields';
import { ViewsChart } from '@/src/components/admin/ViewsChart';

const RANGES = [
  ['24h', '24 hours'],
  ['7d', '7 days'],
  ['30d', '30 days'],
  ['90d', '90 days'],
];

const countryName = (() => {
  let names = null;
  try {
    names = new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {}
  return (code) => (/^[A-Z]{2}$/.test(code) ? (names?.of(code) ?? code) : code);
})();

// Umami reports browser IDs ("chrome", "edge-chromium", "ios"); show their usual names.
const BROWSERS = { chrome: 'Chrome', crios: 'Chrome (iOS)', firefox: 'Firefox', fxios: 'Firefox (iOS)', safari: 'Safari', ios: 'Safari (iOS)', 'ios-webview': 'iOS app webview', 'edge-chromium': 'Edge', edge: 'Edge (legacy)', opera: 'Opera', samsung: 'Samsung Internet', 'chromium-webview': 'Android webview', facebook: 'Facebook app', instagram: 'Instagram app', yandexbrowser: 'Yandex', brave: 'Brave' };
const capitalize = (x) => x.charAt(0).toUpperCase() + x.slice(1);

const duration = (s) => {
  if (!Number.isFinite(s) || s <= 0) return '0s';
  const m = Math.floor(s / 60);
  return m ? `${m}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`;
};

function Change({ value, prev, invert = false }) {
  if (prev === null || prev === undefined || prev === 0) return null;
  const pct = Math.round(((value - prev) / prev) * 100);
  if (!pct) return <span className="text-xs text-subtle">no change</span>;
  const good = invert ? pct < 0 : pct > 0;
  const Icon = pct > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs ${good ? 'text-flow' : 'text-accent-soft'}`}>
      <Icon size={13} aria-hidden="true" />
      {Math.abs(pct)}%<span className="sr-only"> vs previous period</span>
    </span>
  );
}

function Stat({ label, value, change, className = '' }) {
  return (
    <div className={`bg-panel p-5 ${className}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-2xl font-semibold tabular-nums">{value}</span>
        {change}
      </p>
    </div>
  );
}

// Ranked list with an inline proportion bar.
function TopList({ title, rows, format = (x) => x, empty = 'No data yet.' }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Panel title={title}>
      {rows.length ? (
        <ol className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.label} className="relative overflow-hidden rounded-md px-3 py-1.5 text-sm">
              <span className="absolute inset-y-0 left-0 rounded-md bg-flow/[0.12]" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden="true" />
              <span className="relative flex items-center justify-between gap-3">
                <span className="truncate">{format(r.label)}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted">{r.value.toLocaleString('en')}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-subtle">{empty}</p>
      )}
    </Panel>
  );
}

// Fallback: Umami's own share dashboard, which Umami Cloud allows to be framed.
function ShareEmbed({ url }) {
  return (
    <Panel title="Umami share dashboard" description="Shown while the stats can't be loaded here.">
      <iframe src={url} title="Umami analytics" className="h-[80vh] w-full rounded-lg border border-line/[0.08] bg-ink" loading="lazy" referrerPolicy="no-referrer" />
    </Panel>
  );
}

function SetupGuide() {
  return (
    <Panel title="Connect Umami" description="Analytics are off until these environment variables are set (in Vercel → Settings → Environment Variables, or .env.local).">
      <pre className="overflow-x-auto rounded-lg bg-ink p-4 font-mono text-xs leading-relaxed text-muted">{`# Tracking script (public)
NEXT_PUBLIC_UMAMI_URL=https://your-umami.example.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Stats on this page (server only). Any plan, incl. free Hobby:
# Umami → Websites → your site → Edit → Share URL → enable, copy
UMAMI_SHARE_URL=https://cloud.umami.is/share/…

# …or with an API key (paid Cloud plans):
# UMAMI_API_URL=https://api.umami.is/v1
# UMAMI_API_KEY=…
# …or self-hosted:
# UMAMI_API_URL=https://your-umami.example.com/api
# UMAMI_USERNAME=api-reader
# UMAMI_PASSWORD=…`}</pre>
      <p className="mt-3 text-sm text-muted">See “Analytics (Umami)” in the README for the full setup.</p>
    </Panel>
  );
}

export default function AnalyticsAdmin() {
  const [range, setRange] = useState('7d');
  const [state, setState] = useState({ loading: true, error: null, data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`, { cache: 'no-store' });
      const body = await res.json();
      if (!res.ok) throw Object.assign(new Error(body.error || `Loading failed (${res.status}).`), { shareUrl: body.shareUrl });
      setState({ loading: false, error: null, data: body });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e.message, shareUrl: e.shareUrl }));
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const { loading, error, data, shareUrl } = state;
  const t = data?.totals;
  const bounce = (x) => (x?.visits ? Math.round((x.bounces / x.visits) * 100) : 0);
  const avgTime = (x) => (x?.visits ? x.totaltime / x.visits : 0);
  const prevOf = (k) => t?.[k]?.prev;
  const rangeLabel = RANGES.find(([k]) => k === data?.range)?.[1];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-2 max-w-2xl text-muted">Who visits the site, from where, and what they read. Cookieless and GDPR-friendly, powered by Umami.</p>
        </div>
        {data?.configured ? (
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Date range" className="flex rounded-lg border border-line/15 p-0.5">
              {RANGES.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={range === key}
                  onClick={() => setRange(key)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${range === key ? 'bg-white/[0.08] text-fg' : 'text-muted hover:text-fg'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button type="button" className="btn-icon" onClick={load} disabled={loading} aria-label="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </header>

      {loading && !data ? (
        <p className="flex items-center gap-2 text-muted">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Loading…
        </p>
      ) : error && !data ? (
        <div className="space-y-6">
          <div className="card flex flex-wrap items-center gap-3 !border-accent/40 p-5" role="alert">
            <AlertTriangle size={18} className="text-accent-soft" aria-hidden="true" />
            <p className="flex-1 text-sm">{error}</p>
            <button type="button" className="btn-sm" onClick={load}>
              Retry
            </button>
          </div>
          {shareUrl ? <ShareEmbed url={shareUrl} /> : null}
        </div>
      ) : !data.configured ? (
        <SetupGuide />
      ) : (
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {error ? (
            <p className="text-sm text-accent-soft" role="alert">
              {error}
            </p>
          ) : null}

          {data.active !== null ? (
            <p className="flex items-center gap-2 text-sm">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-flow ${data.active ? 'animate-ping opacity-60' : 'opacity-0'}`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${data.active ? 'bg-flow' : 'bg-white/25'}`} />
              </span>
              <strong className="tabular-nums">{data.active}</strong>
              <span className="text-muted">{data.active === 1 ? 'visitor' : 'visitors'} on the site right now</span>
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.08] sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Visitors" value={t.visitors.value.toLocaleString('en')} change={<Change value={t.visitors.value} prev={t.visitors.prev} />} />
            <Stat label="Visits" value={t.visits.value.toLocaleString('en')} change={<Change value={t.visits.value} prev={t.visits.prev} />} />
            <Stat label="Page views" value={t.pageviews.value.toLocaleString('en')} change={<Change value={t.pageviews.value} prev={t.pageviews.prev} />} />
            <Stat
              label="Bounce rate"
              value={`${bounce({ visits: t.visits.value, bounces: t.bounces.value })}%`}
              change={
                prevOf('visits') ? (
                  <Change invert value={bounce({ visits: t.visits.value, bounces: t.bounces.value })} prev={bounce({ visits: prevOf('visits'), bounces: prevOf('bounces') })} />
                ) : null
              }
            />
            <Stat
              className="col-span-2 sm:col-span-1"
              label="Avg. visit time"
              value={duration(avgTime({ visits: t.visits.value, totaltime: t.totaltime.value }))}
              change={
                prevOf('visits') ? (
                  <Change value={avgTime({ visits: t.visits.value, totaltime: t.totaltime.value })} prev={avgTime({ visits: prevOf('visits'), totaltime: prevOf('totaltime') })} />
                ) : null
              }
            />
          </div>

          <Panel title="Page views" description={`Per ${data.unit}, last ${rangeLabel}.`}>
            <ViewsChart series={data.series} unit={data.unit} />
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <TopList title="Top pages" rows={data.pages} />
            <TopList title="Referrers" rows={data.referrers} empty="No referrers yet: visits so far are direct." />
            <TopList title="Countries" rows={data.countries} format={countryName} />
            <TopList title="Devices" rows={data.devices} format={capitalize} />
            <TopList title="Browsers" rows={data.browsers} format={(x) => BROWSERS[x] ?? capitalize(x)} />
            <TopList title="Operating systems" rows={data.systems} />
            <TopList
              title="Clicks"
              rows={data.events ?? []}
              format={(x) => ({ 'contact-email': 'Email button', 'outbound-link': 'External links (LinkedIn, GitHub, demos…)' })[x] ?? x}
              empty="No tracked clicks yet."
            />
          </div>

          {data.dashboardUrl ? (
            <a href={data.dashboardUrl} target="_blank" rel="noopener noreferrer" className="btn-sm">
              Open the full Umami dashboard <ExternalLink size={14} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}
