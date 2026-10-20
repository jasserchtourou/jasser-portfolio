'use client';

import { useEffect, useRef, useState } from 'react';

// Single-series column chart of page views per bucket (day or hour).
// Spec: columns ≤ 24px with a 4px rounded data-end and square baseline, hairline solid grid,
// one hover/focus tooltip (pointer or ← → keys), no legend (the title names the series).
// The bar color is validated against the dark panel surface (OKLCH L inside the dark band).
const BAR = '#4f8fe6';
const BAR_HOVER = '#60a5fa';
const H = 220;
const PAD = { top: 12, right: 8, bottom: 28, left: 40 };

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

function niceMax(max) {
  if (max <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(max / 4));
  const nice = [1, 2, 2.5, 5, 10].map((m) => m * step).find((s) => s * 4 >= max);
  return nice * 4;
}

export function formatBucket(key, unit, long = false) {
  if (unit === 'hour') {
    const [, hour] = key.split(' ');
    if (!long) return `${hour}:00`;
    const d = new Date(`${key.slice(0, 10)}T12:00:00`);
    return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${hour}:00`;
  }
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString('en-GB', long ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' });
}

function barPath(x, y, w, h) {
  const r = Math.min(4, w / 2, h);
  if (h <= 0) return '';
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

export function ViewsChart({ series, unit }) {
  const wrap = useRef(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = series.length;
  const max = niceMax(Math.max(0, ...series.map((s) => s.pageviews)));
  const plotW = width - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / Math.max(n, 1);
  const barW = Math.max(1, Math.min(24, slot - 2));
  const y = (v) => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const labelEvery = Math.ceil(n / Math.max(2, Math.floor(plotW / 64)));

  const indexAt = (clientX) => {
    const rect = wrap.current.getBoundingClientRect();
    const i = Math.floor((clientX - rect.left - PAD.left) / slot);
    return i >= 0 && i < n ? i : null;
  };

  const point = active !== null ? series[active] : null;
  const tipLeft = active !== null ? Math.min(Math.max(PAD.left + slot * active + slot / 2, 70), width - 70) : 0;

  return (
    <div ref={wrap} className="relative">
      <svg
        width={width}
        height={H}
        role="img"
        aria-label={`Page views per ${unit}. Use the left and right arrow keys to read values.`}
        tabIndex={0}
        className="block touch-pan-y"
        onPointerMove={(e) => setActive(indexAt(e.clientX))}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? n) - 1));
          else if (e.key === 'ArrowRight') setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
          else return;
          e.preventDefault();
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="rgb(255 255 255 / 0.08)" strokeWidth="1" />
            <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-subtle font-mono text-[10px] tabular-nums">
              {compact.format(t)}
            </text>
          </g>
        ))}
        {series.map((s, i) => {
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const top = y(s.pageviews);
          return (
            <g key={s.key}>
              <path d={barPath(x, top, barW, PAD.top + plotH - top)} fill={active === i ? BAR_HOVER : BAR} />
              {i % labelEvery === 0 ? (
                <text x={PAD.left + slot * i + slot / 2} y={H - 8} textAnchor="middle" className="fill-subtle text-[10px]">
                  {formatBucket(s.key, unit)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      {point ? (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line/15 bg-raised px-3 py-2 text-xs shadow-xl"
          style={{ left: tipLeft }}
        >
          <p className="text-subtle">{formatBucket(point.key, unit, true)}</p>
          <p className="mt-1 flex items-center gap-2">
            <span className="h-0.5 w-3 rounded" style={{ background: BAR }} aria-hidden="true" />
            <strong className="text-sm text-fg">{point.pageviews.toLocaleString('en')}</strong>
            <span className="text-muted">page views</span>
          </p>
          <p className="mt-0.5 pl-5 text-muted">{point.visitors.toLocaleString('en')} visitors</p>
        </div>
      ) : null}
    </div>
  );
}
