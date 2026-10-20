import fs from 'node:fs/promises';
import path from 'node:path';

// Where back-office edits go:
// - GITHUB_TOKEN + GITHUB_REPO set (production): each save is a commit through the GitHub
//   Contents API; Vercel sees the push and redeploys the static site (~1 min).
// - otherwise (local `npm run dev`): files are written straight to disk and hot-reload.

const GITHUB_API = 'https://api.github.com';
const root = process.cwd();

export const CONTENT_FILES = ['profile', 'experience', 'skills', 'projects'];

export class ConflictError extends Error {}

const gh = () => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  return token && repo ? { token, repo, branch: process.env.GITHUB_BRANCH || 'main' } : null;
};

export const storageMode = () => {
  const g = gh();
  return g ? { mode: 'github', repo: g.repo, branch: g.branch } : { mode: 'local' };
};

async function ghRequest(method, repoPath, body) {
  const { token, repo, branch } = gh();
  const url = `${GITHUB_API}/repos/${repo}/contents/${repoPath.split('/').map(encodeURIComponent).join('/')}`;
  const res = await fetch(method === 'GET' ? `${url}?ref=${encodeURIComponent(branch)}` : url, {
    method,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify({ ...body, branch }) : undefined,
  });
  if (res.status === 409 || (method === 'PUT' && res.status === 422)) {
    throw new ConflictError('The file changed on GitHub since you loaded it. Reload the page and redo your edit.');
  }
  if (!res.ok) throw new Error(`GitHub ${method} ${repoPath} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Returns { data, version }. `version` is the blob SHA on GitHub (optimistic locking) or the
// file's mtime locally.
export async function readContent(name) {
  const rel = `content/${name}.json`;
  if (gh()) {
    const file = await ghRequest('GET', rel);
    return { data: JSON.parse(Buffer.from(file.content, 'base64').toString('utf8')), version: file.sha };
  }
  const abs = path.join(root, rel);
  const [raw, stat] = await Promise.all([fs.readFile(abs, 'utf8'), fs.stat(abs)]);
  return { data: JSON.parse(raw), version: String(stat.mtimeMs) };
}

export async function writeContent(name, data, version, message) {
  const rel = `content/${name}.json`;
  const text = `${JSON.stringify(data, null, 2)}\n`;
  if (gh()) {
    const res = await ghRequest('PUT', rel, {
      message,
      content: Buffer.from(text).toString('base64'),
      sha: version,
    });
    return { version: res.content.sha, commit: res.commit.html_url };
  }
  const abs = path.join(root, rel);
  const stat = await fs.stat(abs);
  if (version && String(stat.mtimeMs) !== String(version)) {
    throw new ConflictError('The file changed on disk since you loaded it. Reload the page and redo your edit.');
  }
  await fs.writeFile(abs, text);
  return { version: String((await fs.stat(abs)).mtimeMs), commit: null };
}

// Stores an uploaded image under public/images/uploads and returns its public URL.
export async function writeUpload(fileName, buffer) {
  const rel = `public/images/uploads/${fileName}`;
  if (gh()) {
    const res = await ghRequest('PUT', rel, {
      message: `content: upload ${fileName} (back office)`,
      content: buffer.toString('base64'),
    });
    return { url: `/images/uploads/${fileName}`, commit: res.commit.html_url };
  }
  const abs = path.join(root, rel);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, buffer);
  return { url: `/images/uploads/${fileName}`, commit: null };
}
