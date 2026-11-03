import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase.js';
import { Button, Field, Input, Item, List, Note, Panel, PanelTitle, Row, Textarea } from './theme.js';

const KINDS = {
  degree: 'Degree — the main line (one only)',
  milestone: 'Milestone — a commit on main',
  role: 'Role — its own branch, forks at start, merges at end'
};

const EMPTY_ENTRY = {
  kind: 'role',
  branch: '',
  published: false,
  title_en: '',
  title_ar: '',
  org_en: '',
  org_ar: '',
  start_date: '',
  end_date: '',
  summary_en: '',
  summary_ar: '',
  did_en: [],
  did_ar: [],
  learned_en: [],
  learned_ar: [],
  tech: [],
  project_id: ''
};

const LIST_FIELDS = ['did_en', 'did_ar', 'learned_en', 'learned_ar'];
const toMonth = date => (date ? date.slice(0, 7) : '');
const fromMonth = month => (month ? `${month}-01` : null);
const fromLines = text => text.split('\n').map(line => line.trim()).filter(Boolean);

export function ExperiencePanel() {
  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [entriesResult, projectsResult] = await Promise.all([
      supabase.from('experience').select('*').order('start_date', { ascending: false }),
      supabase.from('projects').select('id, title').order('sort_order', { ascending: true })
    ]);
    if (entriesResult.error) setError(entriesResult.error.message);
    else setEntries(entriesResult.data);
    if (!projectsResult.error) setProjects(projectsResult.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = async action => {
    setError('');
    const failure = await action();
    if (failure) setError(failure.message);
    await load();
  };

  const togglePublished = entry =>
    run(async () => (await supabase.from('experience').update({ published: !entry.published }).eq('id', entry.id)).error);

  const remove = entry => {
    if (!window.confirm(`Delete "${entry.title_en}"? This cannot be undone.`)) return;
    run(async () => (await supabase.from('experience').delete().eq('id', entry.id)).error);
  };

  if (editing) {
    return (
      <ExperienceForm
        entry={editing === 'new' ? null : editing}
        projects={projects}
        onSaved={async () => { setEditing(null); await load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <Panel>
      <Row style={{ justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <PanelTitle style={{ margin: 0 }}>Experience (git log)</PanelTitle>
        <Button $primary type="button" onClick={() => setEditing('new')}>
          New entry
        </Button>
      </Row>

      <Note>Ordered by date, newest first, exactly as the log draws it. Unpublished entries are hidden from the site.</Note>
      {loading ? <Note>Loading…</Note> : null}
      {error ? <Note $error>{error}</Note> : null}

      <List>
        {entries.map(entry => (
          <Item key={entry.id} $dim={!entry.published}>
            <div style={{ minWidth: 0 }}>
              <Mono>
                {entry.kind === 'role' ? `(${entry.branch || 'no branch'})` : entry.kind} · {toMonth(entry.start_date)}
                {entry.end_date ? ` → ${toMonth(entry.end_date)}` : entry.kind === 'role' ? ' → present' : ''}
              </Mono>
              <Note style={{ margin: 0 }}>
                {entry.title_en}
                {entry.org_en ? ` · ${entry.org_en}` : ''}
                {entry.published ? '' : ' · unpublished'}
              </Note>
            </div>
            <Row>
              <Button type="button" onClick={() => togglePublished(entry)}>
                {entry.published ? 'Unpublish' : 'Publish'}
              </Button>
              <Button type="button" onClick={() => setEditing(entry)}>
                Edit
              </Button>
              <Button $danger type="button" onClick={() => remove(entry)}>
                Delete
              </Button>
            </Row>
          </Item>
        ))}
      </List>
    </Panel>
  );
}

function ExperienceForm({ entry, projects, onSaved, onCancel }) {
  const [draft, setDraft] = useState(() => {
    const base = { ...EMPTY_ENTRY, ...(entry || {}) };
    const lists = Object.fromEntries(LIST_FIELDS.map(key => [key, (base[key] || []).join('\n')]));
    return {
      ...base,
      ...lists,
      tech: (base.tech || []).join(', '),
      start_date: toMonth(base.start_date),
      end_date: toMonth(base.end_date),
      project_id: base.project_id || ''
    };
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const update = (key, value) => setDraft(current => ({ ...current, [key]: value }));

  const save = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');

    const payload = {
      kind: draft.kind,
      branch: draft.kind === 'role' ? draft.branch.trim().toLowerCase() : 'main',
      published: draft.published,
      title_en: draft.title_en.trim(),
      title_ar: draft.title_ar.trim(),
      org_en: draft.org_en.trim(),
      org_ar: draft.org_ar.trim(),
      start_date: fromMonth(draft.start_date),
      end_date: fromMonth(draft.end_date),
      summary_en: draft.summary_en.trim(),
      summary_ar: draft.summary_ar.trim(),
      ...Object.fromEntries(LIST_FIELDS.map(key => [key, fromLines(draft[key])])),
      tech: draft.tech.split(',').map(item => item.trim()).filter(Boolean),
      project_id: draft.project_id || null
    };

    const { error: saveError } = entry?.id
      ? await supabase.from('experience').update(payload).eq('id', entry.id)
      : await supabase.from('experience').insert(payload);

    if (saveError) {
      setError(saveError.message);
      setBusy(false);
      return;
    }
    onSaved();
  };

  return (
    <Panel as="form" onSubmit={save}>
      <PanelTitle>{entry?.id ? `Edit ${entry.title_en}` : 'New experience entry'}</PanelTitle>

      <TwoColumns>
        <Field>
          Kind
          <Select value={draft.kind} onChange={e => update('kind', e.target.value)}>
            {Object.entries(KINDS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        {draft.kind === 'role' ? (
          <Field>
            Branch name (shown in the log)
            <Input
              value={draft.branch}
              onChange={e => update('branch', e.target.value)}
              pattern="[a-z0-9/_.\-]{1,40}"
              placeholder="club/sea or internship/dorz"
              required
            />
          </Field>
        ) : (
          <Note>Degrees and milestones sit on main.</Note>
        )}
      </TwoColumns>

      <TwoColumns>
        <Field>
          Title (English)
          <Input dir="ltr" value={draft.title_en} onChange={e => update('title_en', e.target.value)} required />
        </Field>
        <Field>
          Title (Arabic)
          <Input dir="rtl" lang="ar" value={draft.title_ar} onChange={e => update('title_ar', e.target.value)} required />
        </Field>
        <Field>
          Organisation (English)
          <Input dir="ltr" value={draft.org_en} onChange={e => update('org_en', e.target.value)} />
        </Field>
        <Field>
          Organisation (Arabic)
          <Input dir="rtl" lang="ar" value={draft.org_ar} onChange={e => update('org_ar', e.target.value)} />
        </Field>
        <Field>
          Start month
          <Input type="month" value={draft.start_date} onChange={e => update('start_date', e.target.value)} required />
        </Field>
        <Field>
          End month (empty = ongoing; a degree&apos;s end is its graduation)
          <Input type="month" value={draft.end_date} onChange={e => update('end_date', e.target.value)} />
        </Field>
        <Field>
          Summary (English)
          <Textarea dir="ltr" rows={3} value={draft.summary_en} onChange={e => update('summary_en', e.target.value)} />
        </Field>
        <Field>
          Summary (Arabic)
          <Textarea dir="rtl" lang="ar" rows={3} value={draft.summary_ar} onChange={e => update('summary_ar', e.target.value)} />
        </Field>
        <Field>
          + What I did (English, one per line)
          <Textarea dir="ltr" rows={4} value={draft.did_en} onChange={e => update('did_en', e.target.value)} />
        </Field>
        <Field>
          + What I did (Arabic)
          <Textarea dir="rtl" lang="ar" rows={4} value={draft.did_ar} onChange={e => update('did_ar', e.target.value)} />
        </Field>
        <Field>
          ~ What I learned (English, one per line)
          <Textarea dir="ltr" rows={3} value={draft.learned_en} onChange={e => update('learned_en', e.target.value)} />
        </Field>
        <Field>
          ~ What I learned (Arabic)
          <Textarea dir="rtl" lang="ar" rows={3} value={draft.learned_ar} onChange={e => update('learned_ar', e.target.value)} />
        </Field>
        <Field>
          Tech (comma separated)
          <Input dir="ltr" value={draft.tech} onChange={e => update('tech', e.target.value)} placeholder="Kotlin, Android" />
        </Field>
        <Field>
          Linked project (opens its popup)
          <Select value={draft.project_id} onChange={e => update('project_id', e.target.value)}>
            <option value="">None</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </Select>
        </Field>
      </TwoColumns>

      <Row as="label" style={{ cursor: 'pointer', fontSize: '0.82rem' }}>
        <input type="checkbox" checked={draft.published} onChange={e => update('published', e.target.checked)} />
        Published
      </Row>

      {error ? <Note $error>{error}</Note> : null}

      <Row style={{ marginTop: '1rem' }}>
        <Button $primary type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </Row>
    </Panel>
  );
}

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 1rem;
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Select = styled.select`
  font: inherit;
  font-size: 0.88rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(126, 62, 190, 0.35);
  background: rgba(10, 8, 16, 0.9);
  color: #f1ecf7;
`;

const Mono = styled.p`
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  color: #c5aee2;
`;
