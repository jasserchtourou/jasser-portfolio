'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { prefersReducedMotion } from '@/src/lib/motion';

// One observer for the whole site. Server components opt in with attributes:
//   data-reveal          fade + rise when scrolled into view (siblings entering together stagger)
//   data-reveal-words    word-by-word reveal of <SplitWords> children
//   data-count="80"      count up to the value (data-suffix / data-prefix / data-decimals)
// anime.js is imported lazily so it never sits in the initial bundle.
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    window.__revealReady = true;
    const reduced = prefersReducedMotion();
    if (reduced) {
      document.documentElement.classList.remove('js');
      return;
    }
    document.documentElement.classList.add('js');

    let observer;
    let cancelled = false;

    import('animejs').then(({ animate, stagger }) => {
      if (cancelled) return;

      const play = (batch) => {
        const blocks = batch.filter((el) => el.hasAttribute('data-reveal'));
        if (blocks.length) {
          animate(blocks, {
            opacity: { from: 0, to: 1 },
            translateY: { from: 28, to: 0 },
            duration: 900,
            delay: stagger(80),
            ease: 'out(4)',
          });
        }
        batch
          .filter((el) => el.hasAttribute('data-reveal-words'))
          .forEach((el) => {
            animate(el.querySelectorAll('.word > span'), {
              translateY: { from: '110%', to: '0%' },
              duration: 1000,
              delay: stagger(45),
              ease: 'out(4)',
            });
          });
        batch
          .filter((el) => el.hasAttribute('data-count'))
          .forEach((el) => {
            const target = Number(el.dataset.count);
            const decimals = Number(el.dataset.decimals ?? 0);
            const state = { n: 0 };
            const render = () => {
              const formatted = state.n.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              });
              el.textContent = `${el.dataset.prefix ?? ''}${formatted}${el.dataset.suffix ?? ''}`;
            };
            animate(state, { n: target, duration: 1600, ease: 'out(3)', onUpdate: render, onComplete: render });
          });
      };

      observer = new IntersectionObserver(
        (entries) => {
          const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target);
          batch.forEach((el) => observer.unobserve(el));
          if (batch.length) play(batch);
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      );

      document
        .querySelectorAll('[data-reveal], [data-reveal-words], [data-count]')
        .forEach((el) => observer.observe(el));
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
