import { profile } from '@/src/data/profile';

export function SiteFooter() {
  const { contact } = profile;
  const links = [
    { href: `mailto:${contact.email}`, label: 'Email' },
    { href: contact.linkedin, label: 'LinkedIn' },
    { href: contact.github, label: 'GitHub' },
    { href: contact.medium, label: 'Medium' },
  ];
  return (
    <footer className="border-t border-line/[0.08]">
      <div className="page flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.role} · {profile.location}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="link-underline hover:text-fg"
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
