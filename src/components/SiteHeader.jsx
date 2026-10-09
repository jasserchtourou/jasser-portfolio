'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { profile } from '@/src/data/profile';

const links = [
  { href: '/work/routeflow', label: 'RouteFlow' },
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#contact', label: 'Contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line/[0.08] bg-ink/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="page flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${profile.name}, home`}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-strong font-display text-sm font-bold text-white">
            JC
          </span>
          <span className="hidden font-display text-[15px] font-medium tracking-tight sm:inline">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={pathname === l.href ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm transition-colors hover:text-fg ${
                    l.href === '/work/routeflow' ? 'text-flow' : 'text-muted'
                  } aria-[current=page]:text-fg`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a href={`mailto:${profile.contact.email}`} className="btn-primary hidden md:inline-flex">
          Get in touch
        </a>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-line/15 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-line/[0.08] md:hidden">
        <ul className="page flex flex-col py-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block py-3 font-display text-lg" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <a href={`mailto:${profile.contact.email}`} className="btn-primary">
              Get in touch
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
