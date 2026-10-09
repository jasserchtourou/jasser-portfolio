'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { canRunHeavy3D } from '@/src/lib/motion';

// three.js + R3F live in their own chunk and are only requested on devices that can run them.
const PanoramaScene = dynamic(() => import('./PanoramaScene'), { ssr: false, loading: () => null });

const TRACK_QUERY = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function Panorama({ shots, children }) {
  const trackRef = useRef(null);
  const stripRef = useRef(null);
  const introRef = useRef(null);
  const control = useRef({ scroll: 0, drag: 0, pointer: { x: 0, y: 0 } });
  const [mode, setMode] = useState('2d'); // '2d' until we know WebGL is affordable
  const [tracked, setTracked] = useState(false); // tall sticky scroll track (desktop)
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [active, setActive] = useState(0);
  const count = shots.length;
  const slot = (Math.PI * 2) / count;

  useEffect(() => {
    const isTracked = window.matchMedia(TRACK_QUERY).matches;
    setTracked(isTracked);
    if (isTracked && canRunHeavy3D()) setMode('3d');
  }, []);

  // Scroll progress through the track drives the ring (3D) or slides the strip (2D, desktop).
  useEffect(() => {
    if (!tracked) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      control.current.scroll = p;
      // The intro only fades over the 3D ring; in the 2D strip it stays readable.
      if (introRef.current && mode === '3d') {
        const o = Math.max(0, 1 - p * 7);
        introRef.current.style.opacity = String(o);
        introRef.current.style.transform = `translateY(${-p * 120}px)`;
        introRef.current.style.visibility = o === 0 ? 'hidden' : 'visible';
      }
      if (mode === '2d' && stripRef.current) {
        const strip = stripRef.current;
        const max = strip.scrollWidth - strip.clientWidth;
        strip.style.transform = `translateX(${-p * max}px)`;
        setActive(Math.min(count - 1, Math.round(p * (count - 1))));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [tracked, mode, count]);

  // Render the canvas only while the hero is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '100px' });
    if (trackRef.current) io.observe(trackRef.current);
    return () => io.disconnect();
  }, []);

  // Drag with inertia + pointer parallax (3D only).
  useEffect(() => {
    if (mode !== '3d') return;
    const el = trackRef.current;
    let dragging = false;
    let lastX = 0;
    let velocity = 0;
    let raf = 0;
    const glide = () => {
      velocity *= 0.92;
      control.current.drag += velocity;
      raf = Math.abs(velocity) > 0.0005 ? requestAnimationFrame(glide) : 0;
    };
    const down = (e) => {
      if (e.target.closest('a, button')) return;
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      cancelAnimationFrame(raf);
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      control.current.pointer = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.004;
      control.current.drag += velocity;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      raf = requestAnimationFrame(glide);
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [mode]);

  const step = useCallback(
    (dir) => {
      if (mode === '3d') {
        control.current.drag += dir * slot;
        return;
      }
      const strip = stripRef.current;
      if (!strip) return;
      if (tracked) {
        // Desktop 2D: move the page so the strip lands on the next shot.
        const el = trackRef.current;
        const total = el.offsetHeight - window.innerHeight;
        const next = Math.min(count - 1, Math.max(0, active + dir));
        window.scrollTo({ top: el.offsetTop + (next / (count - 1)) * total, behavior: 'smooth' });
      } else {
        const card = strip.children[0];
        strip.scrollBy({ left: dir * (card?.clientWidth ?? 300), behavior: 'smooth' });
      }
    },
    [mode, slot, tracked, active, count],
  );

  // Native scroll-snap strip (mobile, reduced motion): keep "active" in sync for the label.
  const onStripScroll = (e) => {
    if (tracked) return;
    const strip = e.currentTarget;
    const card = strip.children[0];
    if (!card) return;
    setActive(Math.min(count - 1, Math.round(strip.scrollLeft / (card.clientWidth + 16))));
  };

  const show3d = mode === '3d';
  const current = shots[active];

  return (
    <div ref={trackRef} className="pano-track" style={show3d ? { touchAction: 'pan-y' } : undefined}>
      <div className={`pano-stage ${show3d ? 'cursor-grab active:cursor-grabbing select-none' : ''}`}>
        {show3d ? (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <PanoramaScene
              shots={shots.map((s) => ({ url: `/images/routeflow/${s.id}-1600.webp` }))}
              control={control}
              active={inView}
              onActive={setActive}
              onReady={() => setReady(true)}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(var(--ink))_100%)]" />
          </div>
        ) : null}

        <div className={`relative flex h-full flex-col ${show3d ? 'pointer-events-none' : ''}`}>
          <div ref={introRef} className="relative z-10">
            {show3d ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 left-0 top-0 w-[72%] bg-gradient-to-r from-ink via-ink/85 to-transparent"
                style={{ maskImage: 'linear-gradient(to bottom, black 65%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent)' }}
              />
            ) : null}
            <div className="page pointer-events-auto relative pt-28 sm:pt-32">{children}</div>
          </div>

          {/* 2D strip: the whole hero on mobile / reduced motion / no WebGL, and the
              poster shown while the 3D scene loads. */}
          <div
            className={`relative mt-10 flex-1 overflow-hidden transition-opacity duration-700 ${
              show3d && ready ? 'pointer-events-none opacity-0' : 'opacity-100'
            } ${tracked ? 'flex items-end pb-24' : ''}`}
          >
            <ul
              ref={stripRef}
              onScroll={onStripScroll}
              aria-label="RouteFlow screenshots"
              className={`no-scrollbar flex gap-4 px-4 sm:px-6 lg:px-10 ${
                tracked ? 'will-change-transform' : 'snap-x snap-mandatory overflow-x-auto pb-4'
              }`}
            >
              {shots.map((s, i) => (
                <li
                  key={s.id}
                  className={`relative aspect-[4/3] shrink-0 snap-center overflow-hidden rounded-xl border border-line/10 bg-raised shadow-2xl shadow-black/60 ${
                    tracked ? 'h-[30vh] w-auto' : 'w-[84vw] sm:w-[60vw]'
                  }`}
                >
                  <Image
                    src={`/images/routeflow/${s.id}-1600.webp`}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 46vw, 84vw"
                    priority={i < 2}
                    className="object-cover object-left-top"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="page pointer-events-auto absolute inset-x-0 bottom-6 z-10 flex items-center justify-between gap-4 sm:bottom-8">
            <p className="font-mono text-xs text-muted" aria-live="polite">
              <span className="text-flow">{String(active + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
              <span className="ml-3 text-fg">{current.title}</span>
            </p>
            <div className="flex items-center gap-3">
              {show3d ? <span className="hidden font-mono text-[11px] text-subtle xl:inline">Scroll or drag to rotate</span> : null}
              <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line/15 bg-ink/60 backdrop-blur hover:border-flow/60" aria-label="Previous screenshot">
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line/15 bg-ink/60 backdrop-blur hover:border-flow/60" aria-label="Next screenshot">
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
