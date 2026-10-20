'use client';

import { useEffect } from 'react';

// Reports clicks on email and external links to Umami as events ("contact-email",
// "outbound-link"), so the back office shows which contact routes and project links get used.
// One delegated listener instead of attributes on every link; a no-op when Umami isn't loaded.
export function OutboundTracker() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a || !window.umami?.track) return;
      const href = a.getAttribute('href');
      if (href.startsWith('mailto:')) {
        window.umami.track('contact-email');
      } else if (/^https?:\/\//.test(href) && a.host !== window.location.host) {
        window.umami.track('outbound-link', { host: a.host.replace(/^www\./, ''), url: a.href.slice(0, 200) });
      }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
