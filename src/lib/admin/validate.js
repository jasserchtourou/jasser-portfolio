// Server-side checks for back-office saves. They normalise the payload (trim strings, drop empty
// optional fields) and reject anything the site's components can't render.

class ValidationError extends Error {}
export { ValidationError };

const fail = (msg) => {
  throw new ValidationError(msg);
};

// Recursively trims strings and drops empty strings, nulls, false flags and objects whose fields are
// all empty. Keys starting with "_" are editor-only state and are dropped too.
// Arrays are kept (components call .map / .length on them).
export function clean(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(clean).filter((v) => v !== undefined && v !== '');
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_')) continue;
      const c = clean(v);
      if (c === undefined || c === '' || c === null || c === false) continue;
      if (c && typeof c === 'object' && !Array.isArray(c) && !Object.keys(c).length) continue;
      out[k] = c;
    }
    return out;
  }
  return value ?? undefined;
}

const str = (v, label) => (typeof v === 'string' && v.length ? v : fail(`${label} is required.`));
const strList = (v, label) => (Array.isArray(v) && v.every((s) => typeof s === 'string') ? v : fail(`${label} must be a list of text.`));
const list = (v, label) => (Array.isArray(v) ? v : fail(`${label} must be a list.`));
const url = (v, label) => {
  if (v === undefined) return;
  if (typeof v !== 'string' || !/^(https?:\/\/|\/)/.test(v)) fail(`${label} must start with https:// or /.`);
};

function projects(d) {
  const seen = new Set();
  list(d.projects, 'Projects').forEach((p, i) => {
    const at = `Project ${i + 1}${p.title ? ` (${p.title})` : ''}`;
    str(p.title, `${at}: title`);
    str(p.slug, `${at}: slug`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) fail(`${at}: slug may only use lowercase letters, digits and dashes.`);
    if (seen.has(p.slug)) fail(`${at}: slug "${p.slug}" is used twice.`);
    seen.add(p.slug);
    str(p.tagline, `${at}: tagline`);
    str(p.summary, `${at}: summary`);
    str(p.kind, `${at}: kind`);
    p.stack = strList(p.stack ?? [], `${at}: stack`);
    ['caseStudy', 'repo', 'live', 'post', 'deck'].forEach((k) => url(p[k], `${at}: ${k}`));
    if (p.image) {
      url(str(p.image.src, `${at}: image`), `${at}: image`);
      str(p.image.alt, `${at}: image description (alt text)`);
    }
    if (p.youtube) {
      if (!/^[\w-]{11}$/.test(p.youtube.id ?? '')) fail(`${at}: YouTube video ID must be the 11-character ID.`);
      str(p.youtube.title, `${at}: YouTube title`);
      str(p.youtube.thumb, `${at}: YouTube thumbnail`);
    }
    if (p.video) {
      str(p.video.src, `${at}: video file`);
      str(p.video.title, `${at}: video title`);
    }
    if (p.metrics) list(p.metrics, `${at}: metrics`).forEach((m) => (str(m.value, `${at}: metric value`), str(m.label, `${at}: metric label`)));
  });
  return d;
}

function role(r, at) {
  str(r.company, `${at}: company`);
  str(r.role, `${at}: role`);
  str(r.period, `${at}: period`);
  r.points = strList(r.points ?? [], `${at}: points`);
  if (r.stack) strList(r.stack, `${at}: stack`);
  if (r.link) {
    str(r.link.label, `${at}: link label`);
    url(str(r.link.href, `${at}: link URL`), `${at}: link URL`);
  }
}

function experience(d) {
  list(d.experience, 'Experience').forEach((r, i) => role(r, `Role ${i + 1}`));
  list(d.internships, 'Internships').forEach((r, i) => role(r, `Internship ${i + 1}`));
  return d;
}

function skills(d) {
  list(d.skills, 'Skills').forEach((g, i) => {
    str(g.group, `Skill group ${i + 1}: name`);
    g.items = strList(g.items ?? [], `Skill group ${i + 1}: items`);
  });
  return d;
}

function profile(d) {
  const p = d.profile ?? fail('Profile is missing.');
  ['name', 'role', 'focus', 'location', 'pitch'].forEach((k) => str(p[k], `Profile: ${k}`));
  p.summary = strList(p.summary ?? [], 'Profile: summary');
  str(p.contact?.email, 'Profile: email');
  ['linkedin', 'github', 'medium', 'article'].forEach((k) => url(p.contact[k], `Profile: ${k}`));
  list(d.heroStats ?? [], 'Hero stats').forEach((s, i) => {
    if (typeof s.value !== 'number' || !Number.isFinite(s.value)) fail(`Hero stat ${i + 1}: value must be a number.`);
    str(s.label, `Hero stat ${i + 1}: label`);
  });
  list(d.education ?? [], 'Education').forEach((e, i) => {
    ['degree', 'institution', 'period'].forEach((k) => str(e[k], `Education ${i + 1}: ${k}`));
    e.location = e.location ?? '';
    e.notes = strList(e.notes ?? [], `Education ${i + 1}: notes`);
  });
  list(d.languages ?? [], 'Languages').forEach((l, i) => (str(l.name, `Language ${i + 1}: name`), str(l.level, `Language ${i + 1}: level`)));
  const c = d.certifications ?? fail('Certifications are missing.');
  delete c.total; // derived in src/data/profile.js
  list(c.featured ?? [], 'Featured certifications').forEach((x, i) => (str(x.name, `Featured certification ${i + 1}: name`), str(x.issuer, `Featured certification ${i + 1}: issuer`)));
  list(c.groups ?? [], 'Certification groups').forEach((g, i) => {
    str(g.theme, `Certification group ${i + 1}: theme`);
    list(g.items ?? [], `Certification group ${i + 1}: items`).forEach((x, j) => (str(x.name, `Certification ${i + 1}.${j + 1}: name`), str(x.issuer, `Certification ${i + 1}.${j + 1}: issuer`)));
  });
  return d;
}

const validators = { projects, experience, skills, profile };

export function validateContent(name, data) {
  if (!data || typeof data !== 'object') fail('Invalid payload.');
  return validators[name](clean(data));
}
