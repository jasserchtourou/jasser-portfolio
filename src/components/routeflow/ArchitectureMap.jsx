'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { prefersReducedMotion } from '@/src/lib/motion';

// RouteFlow's real layering (ARCHITECTURE.md): router → service → repository → PostgreSQL,
// the Pydantic AI agent whose tools wrap the same services, and the pgvector knowledge base.
const NODES = [
  { id: 'client', col: 0, row: 0, label: 'Next.js 15 UI', sub: 'TanStack Query' },
  { id: 'question', col: 0, row: 1, label: 'Operator question', sub: 'POST /assistant/ask' },
  { id: 'router', col: 1, row: 0, label: 'API router', sub: '/api/v1 · thin' },
  { id: 'agent', col: 1, row: 1, label: 'Pydantic AI agent', sub: 'Qwen3 4B · Ollama' },
  { id: 'service', col: 2, row: 0, label: 'Services', sub: 'business rules · tx' },
  { id: 'tools', col: 2, row: 1, label: '5 typed tools', sub: 'read-only' },
  { id: 'repo', col: 3, row: 0, label: 'Repositories', sub: 'queries only' },
  { id: 'embed', col: 3, row: 2, label: 'Embeddings', sub: 'all-minilm · 384-d' },
  { id: 'pg', col: 4, row: 0, label: 'PostgreSQL 16', sub: 'SQLAlchemy async' },
  { id: 'vec', col: 4, row: 2, label: 'pgvector', sub: 'HNSW · cosine' },
];

const EDGES = [
  ['client', 'router'],
  ['router', 'service'],
  ['service', 'repo'],
  ['repo', 'pg'],
  ['question', 'agent'],
  ['agent', 'tools'],
  ['tools', 'service'],
  ['tools', 'embed'],
  ['embed', 'vec'],
];

export const SCENARIOS = [
  {
    label: 'Operations request',
    steps: [
      { via: ['client', 'router'], caption: 'The UI asks GET /api/v1/routes/at-risk through TanStack Query.' },
      { via: ['router', 'service'], caption: 'A thin router validates query params with Pydantic and hands off to the service.' },
      { via: ['service', 'repo'], caption: 'The service applies pure business rules (here, the explainable risk score) and owns the transaction.' },
      { via: ['repo', 'pg'], caption: 'Repositories only query. lazy="raise" relationships mean no hidden N+1 queries.' },
      { via: ['pg', 'repo', 'service', 'router', 'client'], caption: 'Typed JSON returns with its factors. The frontend renders; the backend decides.' },
    ],
  },
  {
    label: 'Agentic question',
    steps: [
      { via: ['question', 'agent'], caption: 'Example: “Which shipments are delayed at Garbsen?” reaches POST /assistant/ask.' },
      { via: ['agent', 'tools'], caption: 'The model picks a tool itself. There is no hard-coded question→tool mapping.' },
      { via: ['tools', 'service'], caption: 'Tools are thin, typed wrappers over the same services the API uses.' },
      { via: ['service', 'repo', 'pg'], caption: 'Everything runs inside SET TRANSACTION READ ONLY: PostgreSQL rejects any write.' },
      { via: ['pg', 'repo', 'service', 'tools', 'agent'], caption: 'Compact facts go back to the model, sized for a 4,096-token context.' },
      { via: ['agent', 'question'], caption: 'Answer plus a tool-call audit trail. Step limits stop runaway loops.' },
    ],
  },
  {
    label: 'Knowledge lookup',
    steps: [
      { via: ['agent', 'tools'], caption: 'Procedures and SLAs come from the knowledge base, never from prompts.' },
      { via: ['tools', 'embed'], caption: 'search_knowledge_base embeds the query locally via Ollama (all-minilm, 384 dimensions).' },
      { via: ['embed', 'vec'], caption: 'Cosine search over an HNSW index in pgvector, in the same PostgreSQL.' },
      { via: ['vec', 'embed', 'tools', 'agent'], caption: 'The top passages return with their heading paths, as evidence the agent can cite.' },
    ],
  },
];

const LAYOUTS = {
  wide: {
    w: 1200,
    h: 470,
    box: { w: 184, h: 70 },
    pos: (n) => ({ x: 104 + n.col * 248, y: 70 + n.row * 165 }),
    elbow: (a, b) => {
      if (a.x === b.x || a.y === b.y) return `L ${b.x} ${b.y}`;
      const mx = (a.x + b.x) / 2;
      return `L ${mx} ${a.y} L ${mx} ${b.y} L ${b.x} ${b.y}`;
    },
    font: 15,
    sub: 11.5,
  },
  tall: {
    w: 400,
    h: 900,
    box: { w: 116, h: 66 },
    pos: (n) => ({ x: 68 + n.row * 132, y: 60 + n.col * 195 }),
    elbow: (a, b) => {
      if (a.x === b.x || a.y === b.y) return `L ${b.x} ${b.y}`;
      const my = (a.y + b.y) / 2;
      return `L ${a.x} ${my} L ${b.x} ${my} L ${b.x} ${b.y}`;
    },
    font: 13,
    sub: 8.5,
  },
};

function routeD(layout, via) {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, layout.pos(n)]));
  const pts = via.map((id) => byId[id]);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) d += ` ${layout.elbow(pts[i - 1], pts[i])}`;
  return d;
}

export function ArchitectureMap() {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const tlRef = useRef(null);
  const visible = useRef(false);
  const playingRef = useRef(true);
  const [layoutKey, setLayoutKey] = useState('wide');
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [now, setNow] = useState({ s: 0, k: -1 });
  const layout = LAYOUTS[layoutKey];

  // Pick the diagram orientation from the container width.
  useEffect(() => {
    setReduced(prefersReducedMotion());
    const ro = new ResizeObserver(([e]) => setLayoutKey(e.contentRect.width < 720 ? 'tall' : 'wide'));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const steps = useMemo(
    () => SCENARIOS.flatMap((sc, s) => sc.steps.map((st, k) => ({ s, k, d: routeD(layout, st.via), to: st.via.at(-1), from: st.via[0] }))),
    [layout],
  );

  useEffect(() => {
    if (reduced) return;
    const svg = svgRef.current;
    let disposed = false;

    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        const tl = tlRef.current;
        if (!tl) return;
        if (e.isIntersecting && playingRef.current) tl.play();
        else tl.pause();
      },
      { threshold: 0.3 },
    );

    import('animejs').then(({ createTimeline, svg: animeSvg }) => {
      if (disposed) return;
      const packet = svg.querySelector('[data-packet]');
      const mark = (id, on) => svg.querySelector(`[data-node="${id}"]`)?.toggleAttribute('data-active', on);
      const clearMarks = () => svg.querySelectorAll('[data-node][data-active]').forEach((n) => n.removeAttribute('data-active'));

      const tl = createTimeline({ loop: true, autoplay: false, defaults: { ease: 'inOut(2)' } });
      const trails = Array.from(svg.querySelectorAll('[data-trail]'));
      tl.set(animeSvg.createDrawable(trails), { draw: '0 0' });
      // Trails are hidden in the server render so they never flash fully drawn.
      svg.querySelector('[data-trails]')?.removeAttribute('opacity');

      steps.forEach((st, i) => {
        const path = svg.querySelector(`[data-route="${i}"]`);
        const trail = svg.querySelector(`[data-trail="${i}"]`);
        const len = path.getTotalLength();
        const duration = Math.max(700, Math.min(2200, len * 3.2));
        const isFirst = st.k === 0;
        const isLast = st.k === SCENARIOS[st.s].steps.length - 1;
        const { translateX, translateY } = animeSvg.createMotionPath(path);

        tl.add(
          packet,
          {
            translateX,
            translateY,
            opacity: isFirst ? { from: 0, to: 1, duration: 250 } : 1,
            duration,
            onBegin: () => {
              if (isFirst) clearMarks();
              mark(st.from, true);
              setNow({ s: st.s, k: st.k });
            },
            onComplete: () => mark(st.to, true),
          },
          isFirst ? '+=300' : '+=650',
        );
        tl.add(animeSvg.createDrawable(trail), { draw: ['0 0', '0 1'], duration }, '<<');

        if (isLast) {
          tl.add(packet, { opacity: 0, duration: 300 }, '+=1400');
          tl.add(
            animeSvg.createDrawable(trails.filter((t) => steps[Number(t.dataset.trail)].s === st.s)),
            { draw: '1 1', duration: 500, onComplete: clearMarks },
            '<<',
          );
        }
      });

      tlRef.current = tl;
      io.observe(svg);
      if (visible.current && playingRef.current) tl.play();
    });

    return () => {
      disposed = true;
      io.disconnect();
      tlRef.current?.revert();
      tlRef.current = null;
    };
  }, [steps, reduced]);

  const toggle = () => {
    const next = !playing;
    playingRef.current = next;
    setPlaying(next);
    if (!tlRef.current) return;
    if (next && visible.current) tlRef.current.play();
    else tlRef.current.pause();
  };

  const pos = Object.fromEntries(NODES.map((n) => [n.id, layout.pos(n)]));
  const { box } = layout;
  const scenario = SCENARIOS[now.s];
  const step = now.k >= 0 ? scenario.steps[now.k] : null;

  return (
    <figure ref={wrapRef} className="arch-map">
      <div className="overflow-hidden rounded-2xl border border-line/[0.08] bg-panel/50 p-2 sm:p-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby="arch-title arch-desc"
        >
          <title id="arch-title">RouteFlow architecture</title>
          <desc id="arch-desc">
            The Next.js UI calls a thin FastAPI router, which calls services holding the business rules, then repositories
            and PostgreSQL. Operator questions go to a Pydantic AI agent that chooses among five typed read-only tools; the
            tools wrap the same services, or search the pgvector knowledge base through local embeddings.
          </desc>

          <defs>
            <pattern id="arch-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgb(255 255 255 / 0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={layout.w} height={layout.h} fill="url(#arch-grid)" />

          {/* Postgres and pgvector are the same database: a dashed bracket ties them together. */}
          <path
            d={`M ${pos.pg.x + box.w / 2 + 14} ${pos.pg.y} L ${pos.pg.x + box.w / 2 + 14} ${pos.vec.y}`}
            stroke="rgb(var(--flow) / 0.35)"
            strokeDasharray="4 6"
            fill="none"
            className={layoutKey === 'tall' ? 'hidden' : ''}
          />

          {EDGES.map(([a, b]) => (
            <path key={`${a}-${b}`} d={routeD(layout, [a, b])} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.5" />
          ))}

          <g data-trails="" opacity="0">
          {steps.map((st, i) => (
            <g key={i}>
              <path data-route={i} d={st.d} fill="none" stroke="none" />
              <path
                data-trail={i}
                d={st.d}
                fill="none"
                stroke="rgb(var(--flow))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
            </g>
          ))}
          </g>

          {NODES.map((n) => {
            const p = pos[n.id];
            return (
              <g key={n.id} data-node={n.id} transform={`translate(${p.x - box.w / 2} ${p.y - box.h / 2})`}>
                <rect width={box.w} height={box.h} rx="12" className="arch-node" />
                <text x={box.w / 2} y={box.h / 2 - 4} textAnchor="middle" fontSize={layout.font} className="fill-fg font-display" fontWeight="600">
                  {n.label}
                </text>
                <text x={box.w / 2} y={box.h / 2 + layout.sub + 6} textAnchor="middle" fontSize={layout.sub} className="fill-muted font-mono">
                  {n.sub}
                </text>
              </g>
            );
          })}

          <g data-packet opacity="0">
            <circle r="18" fill="rgb(var(--flow))" opacity="0.14" />
            <circle r="11" fill="rgb(var(--flow))" opacity="0.25" />
            <circle r="6" fill="rgb(191 219 254)" />
          </g>
        </svg>
      </div>

      <figcaption className="mt-5 flex flex-col gap-4 rounded-2xl border border-line/[0.08] bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        {reduced ? (
          <div className="grid gap-6 md:grid-cols-3">
            {SCENARIOS.map((sc) => (
              <div key={sc.label}>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-flow">{sc.label}</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
                  {sc.steps.map((st) => (
                    <li key={st.caption}>{st.caption}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="min-h-[4.5rem] sm:min-h-[3.5rem]" aria-hidden="true">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-flow">
                {scenario.label}
                {step ? <span className="ml-2 text-fg/60">· {now.k + 1}/{scenario.steps.length}</span> : null}
              </p>
              <p className="mt-1.5 text-[15px] text-fg">{step ? step.caption : 'The walkthrough starts when the diagram is on screen.'}</p>
            </div>
            <button type="button" onClick={toggle} className="btn-ghost shrink-0 !min-h-[40px] !px-4" aria-pressed={!playing}>
              {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
              {playing ? 'Pause' : 'Play'} walkthrough
            </button>
            <div className="sr-only">
              {SCENARIOS.map((sc) => (
                <div key={sc.label}>
                  <p>{sc.label}</p>
                  <ol>
                    {sc.steps.map((st) => (
                      <li key={st.caption}>{st.caption}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </>
        )}
      </figcaption>
    </figure>
  );
}
