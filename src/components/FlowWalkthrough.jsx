'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { prefersReducedMotion } from '@/src/lib/motion';

// Animated walkthrough over an HTML diagram. Children mark nodes with data-node="id";
// each scenario moves a packet node-to-node with anime.js, lighting up the active node and
// showing a caption. Starts when scrolled into view, pauses off-screen, has a pause button,
// and is a static numbered list under prefers-reduced-motion.
export function FlowWalkthrough({ scenarios, children, tone = 'accent', label }) {
  const stageRef = useRef(null);
  const packetRef = useRef(null);
  const timelineRef = useRef(null);
  const [current, setCurrent] = useState({ scenario: 0, step: -1 });
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const playingRef = useRef(true);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true);
      return;
    }
    const stage = stageRef.current;
    const packet = packetRef.current;
    let disposed = false;
    let anime;

    const nodeEl = (id) => stage.querySelector(`[data-node="${id}"]`);
    const center = (id) => {
      const el = nodeEl(id);
      if (!el) return { x: 0, y: 0 };
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
    };
    const highlight = (id) => {
      stage.querySelectorAll('[data-node]').forEach((el) => el.removeAttribute('data-active'));
      if (id) nodeEl(id)?.setAttribute('data-active', 'true');
    };

    const build = () => {
      timelineRef.current?.revert();
      const { createTimeline } = anime;
      const tl = createTimeline({ loop: true, autoplay: false, defaults: { ease: 'inOut(3)' } });
      scenarios.forEach((sc, si) => {
        const first = center(sc.steps[0].node);
        tl.add(packet, {
          translateX: { to: first.x, duration: 0 },
          translateY: { to: first.y, duration: 0 },
          opacity: { from: 0, to: 1, duration: 300 },
          scale: { from: 0.4, to: 1, duration: 300 },
          onBegin: () => {
            highlight(sc.steps[0].node);
            setCurrent({ scenario: si, step: 0 });
          },
        });
        sc.steps.slice(1).forEach((st, k) => {
          const c = center(st.node);
          tl.add(
            packet,
            {
              translateX: c.x,
              translateY: c.y,
              duration: 850,
              onBegin: () => setCurrent({ scenario: si, step: k + 1 }),
              onComplete: () => highlight(st.node),
            },
            '+=900',
          );
        });
        tl.add(packet, { opacity: 0, scale: 0.4, duration: 350, onComplete: () => highlight(null) }, '+=1200');
      });
      timelineRef.current = tl;
      if (playingRef.current && visibleRef.current) tl.play();
    };

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => anime && build(), 200);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        const tl = timelineRef.current;
        if (!tl) return;
        if (entry.isIntersecting && playingRef.current) tl.play();
        else tl.pause();
      },
      { threshold: 0.25 },
    );

    import('animejs').then((mod) => {
      if (disposed) return;
      anime = mod;
      build();
      io.observe(stage);
      window.addEventListener('resize', onResize);
    });

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      timelineRef.current?.revert();
      timelineRef.current = null;
    };
  }, [scenarios]);

  const toggle = () => {
    const next = !playing;
    playingRef.current = next;
    setPlaying(next);
    const tl = timelineRef.current;
    if (!tl) return;
    if (next && visibleRef.current) tl.play();
    else tl.pause();
  };

  const scenario = scenarios[current.scenario];
  const step = current.step >= 0 ? scenario.steps[current.step] : null;
  const packetColor = tone === 'flow' ? 'bg-flow shadow-[0_0_18px_4px_rgb(var(--flow)/0.7)]' : 'bg-accent shadow-[0_0_18px_4px_rgb(var(--accent)/0.7)]';

  return (
    <figure className="flow-walkthrough" data-tone={tone}>
      <div ref={stageRef} className="relative">
        {children}
        <span
          ref={packetRef}
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 -ml-[7px] -mt-[7px] h-[14px] w-[14px] rounded-full opacity-0 ${packetColor}`}
        />
      </div>

      {reduced ? (
        <figcaption className="mt-8 grid gap-6 md:grid-cols-2">
          {scenarios.map((sc) => (
            <div key={sc.label}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">{sc.label}</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
                {sc.steps.map((st) => (
                  <li key={st.caption}>{st.caption}</li>
                ))}
              </ol>
            </div>
          ))}
        </figcaption>
      ) : (
        <figcaption className="mt-6 flex flex-col gap-4 rounded-2xl border border-line/[0.08] bg-panel/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-h-[3.5rem]" aria-hidden="true">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
              {scenario.label}
              {step ? (
                <span className="ml-2 text-fg/70">
                  · step {current.step + 1}/{scenario.steps.length}
                </span>
              ) : null}
            </p>
            <p className="mt-1.5 text-[15px] text-fg">{step ? step.caption : 'Scroll into view to start the walkthrough.'}</p>
          </div>
          <button type="button" onClick={toggle} className="btn-ghost shrink-0 !min-h-[40px] !px-4" aria-pressed={!playing}>
            {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
            {playing ? 'Pause' : 'Play'} animation
          </button>
          {/* Full text alternative for assistive tech, independent of the animation state. */}
          <div className="sr-only">
            {label ? <p>{label}</p> : null}
            {scenarios.map((sc) => (
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
        </figcaption>
      )}
    </figure>
  );
}
