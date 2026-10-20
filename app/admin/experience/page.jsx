'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Editor } from '@/src/components/admin/Editor';
import { useContent } from '@/src/components/admin/useContent';
import { Panel, RowActions, StringList, TagInput, TextInput, Toggle, confirmDelete, move, removeAt, replaceAt } from '@/src/components/admin/fields';

function RoleForm({ item, update }) {
  const set = (key) => (value) => update({ ...item, [key]: value });
  return (
    <div className="space-y-5 border-t border-line/10 pt-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Company" value={item.company} onChange={set('company')} />
        <TextInput label="Company context" value={item.context} onChange={set('context')} placeholder="Mid-sized AI startup" />
        <TextInput label="Role" value={item.role} onChange={set('role')} />
        <TextInput label="Employment type" value={item.type} onChange={set('type')} placeholder="Full-time · Freelance · Werkstudent" />
        <TextInput label="Location" value={item.location} onChange={set('location')} placeholder="Munich (Remote)" />
        <TextInput label="Period" value={item.period} onChange={set('period')} placeholder="01/2025 – 09/2025" />
      </div>
      <Toggle label="Current role" hint="Shows the “Current” badge." checked={item.current} onChange={set('current')} />
      <StringList label="What you did" value={item.points} onChange={set('points')} addLabel="Add point" rows={3} />
      <TagInput label="Stack" value={item.stack ?? []} onChange={set('stack')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Link label" value={item.link?.label} onChange={(label) => set('link')({ ...item.link, label })} placeholder="example.com" />
        <TextInput label="Link URL" value={item.link?.href} onChange={(href) => set('link')({ ...item.link, href })} placeholder="https://…" />
      </div>
    </div>
  );
}

function RoleList({ title, description, items, onChange, addLabel }) {
  const [open, setOpen] = useState(null);
  const moveRow = (a, b) => {
    onChange(move(items, a, b));
    setOpen((o) => (o === a ? b : o === b ? a : o));
  };
  const remove = (i) => {
    if (!confirmDelete(`“${items[i].role || 'this role'}” at ${items[i].company || 'this company'}`)) return;
    onChange(removeAt(items, i));
    setOpen(null);
  };
  const add = () => {
    onChange([{ company: '', role: '', period: '', points: [] }, ...items]);
    setOpen(0);
  };

  return (
    <Panel
      title={title}
      description={description}
      actions={
        <button type="button" className="btn-sm" onClick={add}>
          <Plus size={15} aria-hidden="true" /> {addLabel}
        </button>
      }
    >
      <ol className="divide-y divide-line/10">
        {items.map((item, i) => (
          <li key={i} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {item.role || 'New role'} {item.company ? <span className="text-muted">· {item.company}</span> : null}
                  </span>
                  <span className="block text-xs text-subtle">{item.period}</span>
                </span>
              </button>
              {item.current ? <span className="chip !text-fg">Current</span> : null}
              <RowActions index={i} count={items.length} label={item.role || 'role'} onMove={moveRow} onRemove={remove} />
            </div>
            {open === i ? (
              <div className="mt-4">
                <RoleForm item={item} update={(next) => onChange(replaceAt(items, i, next))} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export default function ExperienceAdmin() {
  const content = useContent('experience');
  const d = content.data;
  return (
    <Editor title="Experience" description="Roles and internships, newest first. The order here is the order on the site." content={content} saveMessage="update experience">
      {d ? (
        <>
          <RoleList title="Roles" items={d.experience} addLabel="Add role" onChange={(experience) => content.setData({ ...d, experience })} />
          <RoleList title="Internships" items={d.internships} addLabel="Add internship" onChange={(internships) => content.setData({ ...d, internships })} />
        </>
      ) : null}
    </Editor>
  );
}
