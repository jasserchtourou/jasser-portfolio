'use client';

import { useState } from 'react';
import { ChevronDown, Home, Plus } from 'lucide-react';
import { Editor } from '@/src/components/admin/Editor';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { useContent } from '@/src/components/admin/useContent';
import { Panel, RowActions, TagInput, TextInput, Toggle, confirmDelete, move, removeAt, replaceAt } from '@/src/components/admin/fields';

// Projects the site's code links to directly; deleting them would break a page.
const PINNED = { routeflow: 'Shown as the flagship on the home page and has its own case-study page.' };

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const mediaKind = (p) => (p.video ? 'video' : p.youtube ? 'youtube' : p.image ? 'image' : 'none');

function MediaFields({ project, update }) {
  const kind = mediaKind(project);
  const setKind = (next) => {
    const { image, youtube, video, ...rest } = project;
    const keep = { image, youtube, video }[next];
    update({ ...rest, ...(next === 'none' ? {} : { [next]: keep ?? {} }) });
  };
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="label">Media</legend>
        <div className="flex flex-wrap gap-2">
          {[
            ['none', 'None'],
            ['image', 'Image'],
            ['youtube', 'YouTube video'],
            ['video', 'Video file'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
              className={`btn-sm ${kind === value ? '!border-flow/70 bg-flow/10' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {kind === 'image' ? (
        <div className="space-y-4">
          <ImageUpload value={project.image.src} name={project.slug} onChange={(src) => update({ ...project, image: { ...project.image, src } })} />
          <TextInput label="Image description (alt text)" value={project.image.alt} onChange={(alt) => update({ ...project, image: { ...project.image, alt } })} />
          <Toggle
            label="16:9 frame"
            hint="For wide diagrams; screenshots use 16:10."
            checked={project.image.aspect === 'video'}
            onChange={(on) => update({ ...project, image: { ...project.image, aspect: on ? 'video' : undefined } })}
          />
        </div>
      ) : null}

      {kind === 'youtube' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="YouTube link or video ID"
            value={project.youtube.id}
            onChange={(v) => {
              const id = v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? v;
              update({ ...project, youtube: { ...project.youtube, id } });
            }}
            hint="Paste the full link; the ID is extracted."
          />
          <TextInput label="Video title" value={project.youtube.title} onChange={(title) => update({ ...project, youtube: { ...project.youtube, title } })} />
          <div className="sm:col-span-2">
            <ImageUpload
              label="Thumbnail"
              value={project.youtube.thumb}
              name={`${project.slug}-thumb`}
              onChange={(thumb) => update({ ...project, youtube: { ...project.youtube, thumb } })}
            />
          </div>
        </div>
      ) : null}

      {kind === 'video' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Video file path" value={project.video.src} onChange={(src) => update({ ...project, video: { ...project.video, src } })} hint="An MP4 in public/videos, e.g. /videos/demo.mp4" />
          <TextInput label="Video title" value={project.video.title} onChange={(title) => update({ ...project, video: { ...project.video, title } })} />
          <TextInput label="Duration" value={project.video.duration} onChange={(duration) => update({ ...project, video: { ...project.video, duration } })} placeholder="7:50" />
          <div className="sm:col-span-2">
            <ImageUpload label="Poster image" value={project.video.poster} name={`${project.slug}-poster`} onChange={(poster) => update({ ...project, video: { ...project.video, poster } })} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProjectForm({ project, update }) {
  const isNew = !!project._new;
  const set = (key) => (value) => update({ ...project, [key]: value });
  const metrics = project.metrics ?? [];
  return (
    <div className="space-y-6 border-t border-line/10 pt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Title"
          value={project.title}
          onChange={(title) => update({ ...project, title, ...(isNew ? { slug: slugify(title) } : {}) })}
        />
        <TextInput label="Slug" value={project.slug} onChange={(v) => set('slug')(slugify(v))} hint="Unique ID, lowercase with dashes." disabled={!!PINNED[project.slug] && !isNew} />
        <TextInput label="Kind" value={project.kind} onChange={set('kind')} placeholder="Solo project · Client project · Team project" />
        <TextInput label="Year" value={project.year} onChange={set('year')} placeholder="2026" />
      </div>
      <TextInput label="Tagline" value={project.tagline} onChange={set('tagline')} />
      <TextInput label="Summary" value={project.summary} onChange={set('summary')} multiline rows={4} />
      <TagInput label="Tech stack" value={project.stack} onChange={set('stack')} />
      <Toggle label="Show on the home page" hint="Adds it to “Selected work”." checked={project.home} onChange={set('home')} />

      <MediaFields project={project} update={update} />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="GitHub repository" value={project.repo} onChange={set('repo')} placeholder="https://github.com/…" />
        <TextInput label="Live site" value={project.live} onChange={set('live')} placeholder="https://…" />
        <TextInput label="LinkedIn post" value={project.post} onChange={set('post')} placeholder="https://www.linkedin.com/posts/…" />
        <TextInput label="Slides (PDF)" value={project.deck} onChange={set('deck')} placeholder="/docs/….pdf" />
        <TextInput label="Case study page" value={project.caseStudy} onChange={set('caseStudy')} placeholder="/work/…" hint="Only for projects with a dedicated page." />
      </div>

      <div>
        <p className="label">Key metrics</p>
        <ul className="space-y-2">
          {metrics.map((m, i) => (
            <li key={i} className="flex items-end gap-2">
              <div className="w-32">
                <TextInput label="Value" value={m.value} onChange={(value) => set('metrics')(replaceAt(metrics, i, { ...m, value }))} placeholder="98.4%" />
              </div>
              <div className="flex-1">
                <TextInput label="Label" value={m.label} onChange={(label) => set('metrics')(replaceAt(metrics, i, { ...m, label }))} />
              </div>
              <RowActions index={i} count={metrics.length} label={`metric ${i + 1}`} onMove={(a, b) => set('metrics')(move(metrics, a, b))} onRemove={(j) => set('metrics')(removeAt(metrics, j))} />
            </li>
          ))}
        </ul>
        <button type="button" className="btn-sm mt-2" onClick={() => set('metrics')([...metrics, { value: '', label: '' }])}>
          <Plus size={15} aria-hidden="true" /> Add metric
        </button>
      </div>
    </div>
  );
}

export default function ProjectsAdmin() {
  const content = useContent('projects');
  const [open, setOpen] = useState(null); // index of the expanded project
  const projects = content.data?.projects ?? [];
  const setProjects = (next) => content.setData((d) => ({ ...d, projects: typeof next === 'function' ? next(d.projects) : next }));

  const add = () => {
    // _new (dropped on save) keeps the slug following the title until the project is saved.
    setProjects((list) => [{ _new: true, slug: '', title: '', tagline: '', summary: '', kind: 'Solo project', year: String(new Date().getFullYear()), stack: [] }, ...list]);
    setOpen(0);
  };
  const moveRow = (a, b) => {
    setProjects((list) => move(list, a, b));
    setOpen((o) => (o === a ? b : o === b ? a : o));
  };
  const remove = (i) => {
    if (!confirmDelete(`“${projects[i].title || 'this project'}”`)) return;
    setProjects((list) => removeAt(list, i));
    setOpen(null);
  };

  return (
    <Editor
      title="Projects"
      description="Add, edit, reorder or delete project cards. The order here is the order on /projects; toggled projects also appear on the home page."
      content={content}
      saveMessage="update projects"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {projects.length} projects · {projects.filter((p) => p.home).length} on the home page
        </p>
        <button type="button" className="btn-primary !min-h-[40px] !px-4" onClick={add}>
          <Plus size={16} aria-hidden="true" /> New project
        </button>
      </div>

      <ol className="space-y-3">
        {projects.map((p, i) => (
          <li key={i}>
            <Panel>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.title || 'Untitled project'}</span>
                    <span className="block truncate text-xs text-subtle">{[p.kind, p.year].filter(Boolean).join(' · ')}</span>
                  </span>
                </button>
                {p.home ? (
                  <span className="chip gap-1 !text-fg">
                    <Home size={11} aria-hidden="true" /> Home
                  </span>
                ) : null}
                {p.caseStudy ? <span className="chip">Case study</span> : null}
                <RowActions index={i} count={projects.length} label={p.title || 'project'} onMove={moveRow} onRemove={PINNED[p.slug] ? null : remove} />
              </div>
              {PINNED[p.slug] && open === i ? <p className="mt-3 text-xs text-subtle">Can’t be deleted: {PINNED[p.slug]}</p> : null}
              {open === i ? (
                <div className="mt-5">
                  <ProjectForm project={p} update={(next) => setProjects((list) => replaceAt(list, i, next))} />
                </div>
              ) : null}
            </Panel>
          </li>
        ))}
      </ol>
    </Editor>
  );
}
