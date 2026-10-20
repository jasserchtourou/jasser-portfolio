'use client';

import { Plus } from 'lucide-react';
import { Editor } from '@/src/components/admin/Editor';
import { useContent } from '@/src/components/admin/useContent';
import { Panel, RowActions, TagInput, TextInput, confirmDelete, move, removeAt, replaceAt } from '@/src/components/admin/fields';

export default function SkillsAdmin() {
  const content = useContent('skills');
  const groups = content.data?.skills ?? [];
  const setGroups = (skills) => content.setData((d) => ({ ...d, skills }));

  return (
    <Editor
      title="Skills"
      description="Skill groups as shown in the Skills section. Type a skill and press Enter to add it, or click × to remove it."
      content={content}
      saveMessage="update skills"
    >
      <div className="flex justify-end">
        <button type="button" className="btn-primary !min-h-[40px] !px-4" onClick={() => setGroups([...groups, { group: '', items: [] }])}>
          <Plus size={16} aria-hidden="true" /> New group
        </button>
      </div>
      {groups.map((g, i) => (
        <Panel key={i}>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <TextInput label="Group name" value={g.group} onChange={(group) => setGroups(replaceAt(groups, i, { ...g, group }))} />
            </div>
            <RowActions
              index={i}
              count={groups.length}
              label={g.group || 'group'}
              onMove={(a, b) => setGroups(move(groups, a, b))}
              onRemove={(j) => confirmDelete(`the “${g.group || 'untitled'}” group and its ${g.items.length} skills`) && setGroups(removeAt(groups, j))}
            />
          </div>
          <div className="mt-4">
            <TagInput label="Skills" value={g.items} onChange={(items) => setGroups(replaceAt(groups, i, { ...g, items }))} placeholder="Add a skill and press Enter" />
          </div>
        </Panel>
      ))}
    </Editor>
  );
}
