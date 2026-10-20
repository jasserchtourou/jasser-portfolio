import Script from 'next/script';
import { SiteHeader } from '@/src/components/SiteHeader';
import { SiteFooter } from '@/src/components/SiteFooter';
import { RevealController } from '@/src/components/RevealController';
import { OutboundTracker } from '@/src/components/OutboundTracker';
import { SITE_URL } from '@/src/data/profile';

// Umami (self-hosted) page-view tracking. Off unless both variables are set, so local dev and
// preview builds don't pollute the stats. The back office (/admin) lives outside this group and
// is never tracked.
const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL?.replace(/\/$/, '');
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
// Only count visits on the production host(s); localhost and preview URLs are ignored.
const umamiDomains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS || new URL(SITE_URL).host;

export default function SiteLayout({ children }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <RevealController />
      {umamiUrl && umamiWebsiteId ? (
        <>
          <Script src={`${umamiUrl}/script.js`} data-website-id={umamiWebsiteId} data-domains={umamiDomains} strategy="afterInteractive" />
          <OutboundTracker />
        </>
      ) : null}
    </>
  );
}
