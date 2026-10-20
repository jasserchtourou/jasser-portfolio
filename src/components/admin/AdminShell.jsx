'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BarChart3, Briefcase, ExternalLink, FolderKanban, LayoutDashboard, LogOut, Menu, Sparkles, UserRound, X } from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Sparkles },
  { href: '/admin/profile', label: 'Profile', icon: UserRound },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === '/admin/login') return children;

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  const isActive = (href) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <nav aria-label="Back office" className="flex h-full flex-col gap-1 p-4">
      <Link href="/admin" className="mb-6 px-3 pt-2 font-display text-lg font-semibold" onClick={() => setOpen(false)}>
        Back office
        <span className="block font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-subtle">jasser.dev</span>
      </Link>
      {nav.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          aria-current={isActive(href) ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            isActive(href) ? 'bg-white/[0.07] text-fg' : 'text-muted hover:bg-white/[0.04] hover:text-fg'
          }`}
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </Link>
      ))}
      <div className="mt-auto space-y-1 border-t border-line/10 pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-white/[0.04] hover:text-fg">
          <ExternalLink size={17} aria-hidden="true" /> View site
        </a>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-white/[0.04] hover:text-fg">
          <LogOut size={17} aria-hidden="true" /> Log out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-line/10 bg-panel lg:block">{sidebar}</aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line/10 bg-ink/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-display font-semibold">Back office</span>
        <button type="button" className="btn-icon" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-64 bg-panel">
            <button type="button" className="btn-icon absolute right-2 top-2" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={18} aria-hidden="true" />
            </button>
            {sidebar}
          </div>
        </div>
      ) : null}

      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">{children}</div>
      </main>
    </div>
  );
}
