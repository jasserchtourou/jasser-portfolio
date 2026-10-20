'use client';

import { Plus } from 'lucide-react';
import { Editor } from '@/src/components/admin/Editor';
import { ImageUpload } from '@/src/components/admin/ImageUpload';
import { useContent } from '@/src/components/admin/useContent';
import { Panel, RowActions, StringList, TextInput, move, removeAt, replaceAt } from '@/src/components/admin/fields';

// A list of small records edited as one row of fields each.
function RecordList({ items = [], onChange, fields, blank, addLabel, label }) {
  return (
    <div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-end gap-2 rounded-xl border border-line/[0.08] p-3">
            <div className={`grid flex-1 gap-3 ${fields.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {fields.map(([key, fieldLabel, opts = {}]) => (
                <TextInput
                  key={key}
                  label={fieldLabel}
                  type={opts.number ? 'number' : 'text'}
                  value={item[key]}
                  placeholder={opts.placeholder}
                  onChange={(v) => onChange(replaceAt(items, i, { ...item, [key]: opts.number ? (v === '' ? '' : Number(v)) : v }))}
                />
              ))}
            </div>
            <RowActions index={i} count={items.length} label={`${label} ${i + 1}`} onMove={(a, b) => onChange(move(items, a, b))} onRemove={(j) => onChange(removeAt(items, j))} />
          </li>
        ))}
      </ul>
      <button type="button" className="btn-sm mt-3" onClick={() => onChange([...items, { ...blank }])}>
        <Plus size={15} aria-hidden="true" /> {addLabel}
      </button>
    </div>
  );
}

const certFields = [
  ['name', 'Name'],
  ['issuer', 'Issuer'],
  ['date', 'Date', { placeholder: 'Apr 2024' }],
];

export default function ProfileAdmin() {
  const content = useContent('profile');
  const d = content.data;
  if (!d) return <Editor title="Profile" content={content} />;

  const p = d.profile;
  const setProfile = (key) => (value) => content.setData({ ...d, profile: { ...p, [key]: value } });
  const setContact = (key) => (value) => content.setData({ ...d, profile: { ...p, contact: { ...p.contact, [key]: value } } });
  const setTop = (key) => (value) => content.setData({ ...d, [key]: value });
  const certs = d.certifications;
  const setCerts = (key) => (value) => content.setData({ ...d, certifications: { ...certs, [key]: value } });
  const certCount = certs.groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <Editor title="Profile" description="Your identity, pitch, contact links, hero numbers, education, languages and certifications." content={content} saveMessage="update profile">
      <Panel title="Identity">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Name" value={p.name} onChange={setProfile('name')} />
            <TextInput label="Role" value={p.role} onChange={setProfile('role')} />
            <TextInput label="Focus" value={p.focus} onChange={setProfile('focus')} />
            <TextInput label="Location" value={p.location} onChange={setProfile('location')} />
            <TextInput label="Work permit" value={p.workPermit} onChange={setProfile('workPermit')} />
            <TextInput label="Availability" value={p.availability} onChange={setProfile('availability')} />
          </div>
          <ImageUpload label="Photo" value={p.photo} name="jasser-photo" onChange={setProfile('photo')} />
          <TextInput label="Pitch" value={p.pitch} onChange={setProfile('pitch')} multiline rows={3} hint="The paragraph under your name in the hero." />
          <StringList label="About: summary paragraphs" value={p.summary} onChange={setProfile('summary')} addLabel="Add paragraph" rows={3} />
        </div>
      </Panel>

      <Panel title="Contact & links">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Email" type="email" value={p.contact.email} onChange={setContact('email')} />
          <TextInput label="LinkedIn" value={p.contact.linkedin} onChange={setContact('linkedin')} />
          <TextInput label="GitHub" value={p.contact.github} onChange={setContact('github')} />
          <TextInput label="Medium" value={p.contact.medium} onChange={setContact('medium')} />
          <div className="sm:col-span-2">
            <TextInput label="Featured article" value={p.contact.article} onChange={setContact('article')} />
          </div>
        </div>
      </Panel>

      <Panel title="Hero numbers" description="The animated counters in the hero. Value must be a number; the suffix is shown after it (+, %).">
        <RecordList
          label="stat"
          items={d.heroStats}
          onChange={setTop('heroStats')}
          blank={{ value: 0, suffix: '', label: '' }}
          addLabel="Add number"
          fields={[
            ['value', 'Value', { number: true }],
            ['suffix', 'Suffix', { placeholder: '+' }],
            ['label', 'Label'],
          ]}
        />
      </Panel>

      <Panel
        title="Education"
        actions={
          <button type="button" className="btn-sm" onClick={() => setTop('education')([...d.education, { degree: '', institution: '', location: '', period: '', notes: [] }])}>
            <Plus size={15} aria-hidden="true" /> Add degree
          </button>
        }
      >
        <ul className="space-y-4">
          {d.education.map((e, i) => {
            const set = (key) => (value) => setTop('education')(replaceAt(d.education, i, { ...e, [key]: value }));
            return (
              <li key={i} className="rounded-xl border border-line/[0.08] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">{e.degree || 'New degree'}</p>
                  <RowActions index={i} count={d.education.length} label={e.degree || 'degree'} onMove={(a, b) => setTop('education')(move(d.education, a, b))} onRemove={(j) => setTop('education')(removeAt(d.education, j))} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <TextInput label="Degree" value={e.degree} onChange={set('degree')} />
                  </div>
                  <TextInput label="Institution" value={e.institution} onChange={set('institution')} />
                  <TextInput label="Location" value={e.location} onChange={set('location')} />
                  <TextInput label="Period" value={e.period} onChange={set('period')} placeholder="2022 – 2025" />
                </div>
                <div className="mt-4">
                  <StringList label="Notes" value={e.notes} onChange={set('notes')} addLabel="Add note" rows={1} />
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Languages">
        <RecordList
          label="language"
          items={d.languages}
          onChange={setTop('languages')}
          blank={{ name: '', level: '' }}
          addLabel="Add language"
          fields={[
            ['name', 'Language'],
            ['level', 'Level', { placeholder: 'C1' }],
          ]}
        />
      </Panel>

      <Panel title="Featured certifications" description="Highlighted in the Education section.">
        <RecordList label="featured certification" items={certs.featured} onChange={setCerts('featured')} blank={{ name: '', issuer: '' }} addLabel="Add featured" fields={[...certFields, ['status', 'Status (optional)']]} />
      </Panel>

      <Panel
        title={`All certifications (${certCount})`}
        description="Grouped by theme. The total on the site is counted automatically."
        actions={
          <button type="button" className="btn-sm" onClick={() => setCerts('groups')([...certs.groups, { theme: '', items: [] }])}>
            <Plus size={15} aria-hidden="true" /> Add theme
          </button>
        }
      >
        <ul className="space-y-5">
          {certs.groups.map((g, i) => (
            <li key={i} className="rounded-xl border border-line/[0.08] p-4">
              <div className="mb-3 flex items-end gap-2">
                <div className="flex-1">
                  <TextInput label="Theme" value={g.theme} onChange={(theme) => setCerts('groups')(replaceAt(certs.groups, i, { ...g, theme }))} />
                </div>
                <RowActions index={i} count={certs.groups.length} label={g.theme || 'theme'} onMove={(a, b) => setCerts('groups')(move(certs.groups, a, b))} onRemove={(j) => setCerts('groups')(removeAt(certs.groups, j))} />
              </div>
              <RecordList label="certification" items={g.items} onChange={(items) => setCerts('groups')(replaceAt(certs.groups, i, { ...g, items }))} blank={{ name: '', issuer: '' }} addLabel="Add certification" fields={certFields} />
            </li>
          ))}
        </ul>
      </Panel>
    </Editor>
  );
}
