'use client';

import { useId, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react';

// Immutable list helpers shared by the editors.
export const move = (list, from, to) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
};
export const replaceAt = (list, i, value) => list.map((v, j) => (j === i ? value : v));
export const removeAt = (list, i) => list.filter((_, j) => j !== i);

export function Panel({ title, description, actions, children }) {
  return (
    <section className="card p-5 sm:p-6">
      {title ? (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function TextInput({ label, value, onChange, hint, multiline = false, rows = 3, ...rest }) {
  const id = useId();
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <Tag
        id={id}
        className="input"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={multiline ? rows : undefined}
        {...rest}
      />
      {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

export function Toggle({ label, checked, onChange, hint }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent-strong' : 'bg-white/15'}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </button>
      <label htmlFor={id} className="cursor-pointer text-sm">
        {label}
        {hint ? <span className="block text-xs text-subtle">{hint}</span> : null}
      </label>
    </div>
  );
}

// Chips with an "add" box: Enter or comma adds, Backspace on an empty box removes the last one.
export function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const id = useId();
  const [draft, setDraft] = useState('');
  const add = () => {
    const parts = draft.split(',').map((s) => s.trim()).filter((s) => s && !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="input flex flex-wrap items-center gap-1.5 !py-1.5">
        {value.map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-white/[0.07] py-1 pl-2 pr-1 text-xs">
            {tag}
            <button type="button" className="rounded p-0.5 text-subtle hover:bg-white/10 hover:text-fg" onClick={() => onChange(removeAt(value, i))} aria-label={`Remove ${tag}`}>
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="min-w-[10rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-subtle"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={add}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            } else if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
        />
      </div>
    </div>
  );
}

export function RowActions({ index, count, onMove, onRemove, label }) {
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className="btn-icon" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`Move ${label} up`}>
        <ArrowUp size={16} aria-hidden="true" />
      </button>
      <button type="button" className="btn-icon" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label={`Move ${label} down`}>
        <ArrowDown size={16} aria-hidden="true" />
      </button>
      {onRemove ? (
        <button type="button" className="btn-icon hover:!text-accent-soft" onClick={() => onRemove(index)} aria-label={`Delete ${label}`}>
          <Trash2 size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

// An ordered list of free-text entries (bullet points, summary paragraphs, notes).
export function StringList({ label, value = [], onChange, addLabel = 'Add line', rows = 2 }) {
  return (
    <div>
      <p className="label">{label}</p>
      <ul className="space-y-2">
        {value.map((text, i) => (
          <li key={i} className="flex items-start gap-1">
            <textarea
              className="input"
              rows={rows}
              value={text}
              aria-label={`${label} ${i + 1}`}
              onChange={(e) => onChange(replaceAt(value, i, e.target.value))}
            />
            <RowActions index={i} count={value.length} label={`line ${i + 1}`} onMove={(a, b) => onChange(move(value, a, b))} onRemove={(j) => onChange(removeAt(value, j))} />
          </li>
        ))}
      </ul>
      <button type="button" className="btn-sm mt-2" onClick={() => onChange([...value, ''])}>
        <Plus size={15} aria-hidden="true" /> {addLabel}
      </button>
    </div>
  );
}

// Asks before deleting; returns true when confirmed.
export const confirmDelete = (what) => window.confirm(`Delete ${what}? You can still discard the change until you press Save.`);
