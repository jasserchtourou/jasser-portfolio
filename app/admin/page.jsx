'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, Briefcase, FolderKanban, Sparkles, UserRound } from 'lucide-react';

const getJson = (url) =>
  fetch(url, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

export default function AdminHome() {
  const [content, setContent] = useState({});
  const [stats, setStats] = useState(undefined); // undefined = loading, null = failed

  useEffect(() => {
    ['projects', 'experience', 'skills', 'profile'].forEach((name) =>
      getJson(`/api/admin/content/${name}`).then((body) => setContent((c) => ({ ...c, [name]: body }))),
    );
    getJson('/api/admin/analytics?range=7d').then(setStats);
  }, []);

  const projects = content.projects?.data?.projects;
  const exp = content.experience?.data;
  const skills = content.skills?.data?.skills;
  const certs = content.profile?.data?.certifications;
  const storage = (content.projects ?? content.profile)?.storage;
  const n = (v) => (v === undefined ? '…' : v);

  const cards = [
    { href: '/admin/projects', icon: FolderKanban, title: 'Projects', value: n(projects?.length), detail: projects ? `${projects.filter((p) => p.home).length} on the home page` : 'Add, edit, reorder, delete' },
    { href: '/admin/experience', icon: Briefcase, title: 'Experience', value: n(exp && exp.experience.length + exp.internships.length), detail: exp ? `${exp.experience.length} roles · ${exp.internships.length} internships` : 'Roles and internships' },
    { href: '/admin/skills', icon: Sparkles, title: 'Skills', value: n(skills?.reduce((s, g) => s + g.items.length, 0)), detail: skills ? `in ${skills.length} groups` : 'Skill groups' },
    { href: '/admin/profile', icon: UserRound, title: 'Certifications', value: n(certs?.groups.reduce((s, g) => s + g.items.length, 0)), detail: 'Profile, education, languages' },
  ];

  const views = stats?.configured ? stats.totals : null;

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted">
          {storage?.mode === 'github'
            ? `Edits are committed to ${storage.repo} (${storage.branch}); Vercel redeploys the site in about a minute.`
            : storage
              ? 'Local mode: edits are written to content/*.json and hot-reload.'
              : 'Manage your portfolio content and see who visits.'}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, icon: Icon, title, value, detail }) => (
          <Link key={href} href={href} className="card group p-5 transition-colors hover:border-line/25">
            <span className="flex items-center justify-between text-muted">
              <Icon size={18} aria-hidden="true" />
              <ArrowRight size={16} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-3xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 text-sm font-medium">{title}</p>
            <p className="text-xs text-subtle">{detail}</p>
          </Link>
        ))}
      </div>

      <Link href="/admin/analytics" className="card group mt-6 block p-6 transition-colors hover:border-line/25">
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-display text-lg font-semibold">
            <BarChart3 size={18} aria-hidden="true" /> Visitors, last 7 days
          </span>
          <ArrowRight size={16} className="text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </span>
        {stats === undefined ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : views ? (
          <dl className="mt-5 grid grid-cols-3 gap-4">
            {[
              ['Visitors', views.visitors.value],
              ['Visits', views.visits.value],
              ['Page views', views.pageviews.value],
            ].map(([label, v]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{v.toLocaleString('en')}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-muted">{stats?.configured === false ? 'Umami is not connected yet. Open Analytics for the setup steps.' : 'Analytics could not be loaded.'}</p>
        )}
      </Link>
    </div>
  );
}
