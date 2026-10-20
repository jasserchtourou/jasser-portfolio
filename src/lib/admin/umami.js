// Server-side client for the Umami API, used by the back office's analytics page.
// Self-hosted: UMAMI_API_URL + UMAMI_USERNAME / UMAMI_PASSWORD (a token is fetched and cached).
// Umami Cloud: UMAMI_API_URL=https://api.umami.is/v1 + UMAMI_API_KEY (paid plans).
// Any plan (incl. the free Hobby plan): UMAMI_SHARE_URL, the website's public share link. A
// read-only share token is fetched from it, the same way Umami's own share page loads its data.
// Handles both Umami v2 ({ value, prev } stats, `url` metric) and v3 (flat stats, `path` metric).

const TZ = 'Europe/Berlin';

export const RANGES = {
  '24h': { ms: 24 * 3600e3, unit: 'hour', label: 'Last 24 hours' },
  '7d': { ms: 7 * 86400e3, unit: 'day', label: 'Last 7 days' },
  '30d': { ms: 30 * 86400e3, unit: 'day', label: 'Last 30 days' },
  '90d': { ms: 90 * 86400e3, unit: 'day', label: 'Last 90 days' },
};

export function umamiConfig() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const shareUrl = process.env.UMAMI_SHARE_URL;
  if (shareUrl) {
    // https://cloud.umami.is/share/<slug>[/<domain>] -> API at https://cloud.umami.is/api
    let url;
    try {
      url = new URL(shareUrl);
    } catch {
      return null;
    }
    const slug = url.pathname.match(/\/share\/([^/]+)/)?.[1];
    if (!slug) return null;
    // Umami Cloud serves the API from a regional gateway, self-hosted from <origin>/api.
    const override = process.env.UMAMI_SHARE_API_URL?.replace(/\/$/, '');
    const apiUrls = override
      ? [override]
      : url.hostname === 'cloud.umami.is'
        ? ['https://gateway-eu.umami.is/api', 'https://gateway-us.umami.is/api']
        : [`${url.origin}/api`];
    return { apiUrl: cachedShareApiUrl ?? apiUrls[0], apiUrls, websiteId, shareSlug: slug };
  }
  const apiUrl = process.env.UMAMI_API_URL?.replace(/\/$/, '');
  const hasAuth = process.env.UMAMI_API_KEY || (process.env.UMAMI_USERNAME && process.env.UMAMI_PASSWORD);
  return apiUrl && websiteId && hasAuth ? { apiUrl, websiteId } : null;
}

let cachedToken = null;
let cachedShareWebsiteId = null;

let pendingShare = null;
let cachedShareApiUrl = null;

// One share-token request even when the dashboard's parallel calls all start without a token.
async function shareToken(cfg, refresh) {
  if (!cachedToken || refresh) {
    pendingShare ??= (async () => {
      let status = 0;
      for (const apiUrl of cfg.apiUrls) {
        const res = await fetch(`${apiUrl}/share/${encodeURIComponent(cfg.shareSlug)}`, { cache: 'no-store', headers: { Accept: 'application/json' } }).catch(() => null);
        status = res?.status ?? 0;
        if (!res?.ok || !res.headers.get('content-type')?.includes('json')) continue;
        const body = await res.json();
        if (!body.token) throw new Error('Umami share link returned no token.');
        cachedToken = body.token;
        cachedShareWebsiteId = body.websiteId || null;
        cachedShareApiUrl = apiUrl;
        return;
      }
      throw new Error(`Umami share link failed (${status || 'no response'}). Check UMAMI_SHARE_URL and that sharing is still on.`);
    })().finally(() => (pendingShare = null));
    await pendingShare;
  }
  if (cachedShareApiUrl) cfg.apiUrl = cachedShareApiUrl;
  if (cachedShareWebsiteId) cfg.websiteId = cachedShareWebsiteId;
  return { 'x-umami-share-token': cachedToken, 'x-umami-share-context': '1' };
}

async function authHeaders(cfg, refresh = false) {
  if (cfg.shareSlug) return shareToken(cfg, refresh);
  if (process.env.UMAMI_API_KEY) return { 'x-umami-api-key': process.env.UMAMI_API_KEY };
  if (!cachedToken || refresh) {
    const res = await fetch(`${cfg.apiUrl}/auth/login`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: process.env.UMAMI_USERNAME, password: process.env.UMAMI_PASSWORD }),
    });
    if (!res.ok) throw new Error(`Umami login failed (${res.status}). Check UMAMI_USERNAME / UMAMI_PASSWORD.`);
    const body = await res.json();
    if (!body.token) throw new Error('Umami login needs two-factor auth; use an account without 2FA for the API.');
    cachedToken = body.token;
  }
  return { Authorization: `Bearer ${cachedToken}` };
}

async function get(cfg, endpoint, params) {
  for (const refresh of [false, true]) {
    const headers = { Accept: 'application/json', ...(await authHeaders(cfg, refresh)) }; // may set cfg.apiUrl / websiteId
    const url = `${cfg.apiUrl}/websites/${cfg.websiteId}/${endpoint}?${new URLSearchParams(params)}`;
    const res = await fetch(url, { cache: 'no-store', headers });
    if (res.status === 401 && !refresh && !process.env.UMAMI_API_KEY) continue; // token expired
    if (!res.ok) {
      const err = new Error(`Umami ${endpoint} failed (${res.status}).`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }
}

const num = (v) => Number((v && typeof v === 'object' ? v.value : v) ?? 0);
const prevNum = (data, k) => {
  const v = data[k];
  if (v && typeof v === 'object' && 'prev' in v) return Number(v.prev); // v2
  const cmp = data.comparison ?? data.compare; // v3
  return cmp && k in cmp ? num(cmp[k]) : null;
};

// Bucket keys ("YYYY-MM-DD" or "YYYY-MM-DD HH") in the stats timezone, so empty days still show.
function bucketKey(date, unit) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  const day = `${p.year}-${p.month}-${p.day}`;
  return unit === 'hour' ? `${day} ${p.hour}` : day;
}

async function metric(cfg, type, params) {
  try {
    return await get(cfg, 'metrics', { ...params, type, limit: '10' });
  } catch (e) {
    // Umami v2 calls the page metric `url`.
    if (type === 'path' && e.status === 400) return get(cfg, 'metrics', { ...params, type: 'url', limit: '10' });
    throw e;
  }
}

export async function getAnalytics(rangeKey) {
  const cfg = umamiConfig();
  if (!cfg) return { configured: false };
  const range = RANGES[rangeKey] ?? RANGES['7d'];
  const endAt = Date.now();
  const startAt = endAt - range.ms;
  const params = { startAt: String(startAt), endAt: String(endAt), timezone: TZ };

  const [stats, series, pages, referrers, countries, devices, browsers, systems, events, active] = await Promise.all([
    get(cfg, 'stats', { ...params, compare: 'prev' }),
    get(cfg, 'pageviews', { ...params, unit: range.unit }),
    metric(cfg, 'path', params),
    metric(cfg, 'referrer', params),
    metric(cfg, 'country', params),
    metric(cfg, 'device', params),
    metric(cfg, 'browser', params),
    metric(cfg, 'os', params),
    metric(cfg, 'event', params).catch(() => []),
    get(cfg, 'active', {}).catch(() => null), // visitors in the last 5 minutes
  ]);

  const totals = {};
  for (const k of ['pageviews', 'visitors', 'visits', 'bounces', 'totaltime']) totals[k] = { value: num(stats[k]), prev: prevNum(stats, k) };

  // Fill every bucket in the range, then add Umami's counts.
  const step = range.unit === 'hour' ? 3600e3 : 86400e3;
  const buckets = new Map();
  for (let t = startAt + step; t <= endAt + step / 2; t += step) buckets.set(bucketKey(new Date(t), range.unit), { pageviews: 0, visitors: 0 });
  const keyOf = (x) => String(x).replace('T', ' ').slice(0, range.unit === 'hour' ? 13 : 10);
  for (const { x, y } of series.pageviews ?? []) buckets.has(keyOf(x)) && (buckets.get(keyOf(x)).pageviews = y);
  for (const { x, y } of series.sessions ?? []) buckets.has(keyOf(x)) && (buckets.get(keyOf(x)).visitors = y);

  const top = (rows) => (rows ?? []).map(({ x, y }) => ({ label: x || '(none)', value: y }));
  return {
    configured: true,
    range: rangeKey in RANGES ? rangeKey : '7d',
    unit: range.unit,
    dashboardUrl: process.env.UMAMI_DASHBOARD_URL || process.env.UMAMI_SHARE_URL || process.env.NEXT_PUBLIC_UMAMI_URL || null,
    totals,
    series: [...buckets].map(([key, v]) => ({ key, ...v })),
    pages: top(pages),
    referrers: top(referrers),
    countries: top(countries),
    devices: top(devices),
    browsers: top(browsers),
    systems: top(systems),
    events: top(events),
    // v2.10+ / v3: { visitors }; older v2: [{ x }]
    active: active ? Number(active.visitors ?? active.x ?? active[0]?.x ?? 0) : null,
  };
}
