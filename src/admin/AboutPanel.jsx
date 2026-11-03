import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { resolveAssetUrl, supabase } from '../lib/supabase.js';
import { MAX_IMAGE_BYTES, nextSortOrder, swapOrder, uploadImage } from './shared.js';
import { Button, Field, Input, Item, List, Note, Panel, PanelTitle, Row, Textarea } from './theme.js';

const EMPTY_SECTION = {
  slug: '',
  body_en: '',
  body_ar: '',
  image_path: null,
  image_alt_en: '',
  image_alt_ar: '',
  published: true
};

export function AboutPanel() {
  const [sections, setSections] = useState([]);
  const [editing, setEditing] = useState(null); // a section, 'new', or null
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('about_sections')
      .select('*')
      .order('sort_order', { ascending: true });

    if (loadError) setError(loadError.message);
    else setSections(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = async action => {
    setError('');
    const failure = await action();
    if (failure) setError(failure.message);
    await load();
  };

  const move = (index, direction) => {
    const target = sections[index + direction];
    if (target) run(() => swapOrder('about_sections', sections[index], target));
  };

  const togglePublished = section =>
    run(async () => (await supabase.from('about_sections').update({ published: !section.published }).eq('id', section.id)).error);

  const remove = section => {
    if (!window.confirm(`Delete the "${section.slug}" tab? This cannot be undone.`)) return;
    run(async () => (await supabase.from('about_sections').delete().eq('id', section.id)).error);
  };

  if (editing) {
    return (
      <AboutForm
        section={editing === 'new' ? null : editing}
        onSaved={async () => { setEditing(null); await load(); }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <Panel>
      <Row style={{ justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <PanelTitle style={{ margin: 0 }}>About tabs</PanelTitle>
        <Button $primary type="button" onClick={() => setEditing('new')}>
          New tab
        </Button>
      </Row>

      {loading ? <Note>Loading…</Note> : null}
      {error ? <Note $error>{error}</Note> : null}
      {!loading && !sections.length ? <Note>No tabs yet — the About section is hidden until one is published.</Note> : null}

      <List>
        {sections.map((section, index) => (
          <Item key={section.id} $dim={!section.published}>
            <div style={{ minWidth: 0 }}>
              <ItemTitle>&gt;{section.slug}</ItemTitle>
              <Note style={{ margin: 0 }}>
                {section.body_en.split('\n')[0].slice(0, 70)}
                {section.published ? '' : ' · unpublished'}
              </Note>
            </div>

            <Row>
              <Button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${section.slug} up`}>
                ↑
              </Button>
              <Button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                aria-label={`Move ${section.slug} down`}
              >
                ↓
              </Button>
              <Button type="button" onClick={() => togglePublished(section)}>
                {section.published ? 'Unpublish' : 'Publish'}
              </Button>
              <Button type="button" onClick={() => setEditing(section)}>
                Edit
              </Button>
              <Button $danger type="button" onClick={() => remove(section)}>
                Delete
              </Button>
            </Row>
          </Item>
        ))}
      </List>
    </Panel>
  );
}

function AboutForm({ section, onSaved, onCancel }) {
  const [draft, setDraft] = useState(section || EMPTY_SECTION);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const localImageUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (localImageUrl) URL.revokeObjectURL(localImageUrl); }, [localImageUrl]);
  const previewImage = localImageUrl || resolveAssetUrl(draft.image_path);

  const update = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const lineCount = text => text.split('\n').filter(line => line.trim()).length;

  const pickFile = event => {
    const chosen = event.target.files?.[0];
    if (!chosen) return;
    if (chosen.size > MAX_IMAGE_BYTES) {
      setError('Image must be under 5 MB.');
      return;
    }
    setError('');
    setFile(chosen);
  };

  const save = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const payload = {
        slug: draft.slug.trim().toLowerCase(),
        body_en: draft.body_en.trim(),
        body_ar: draft.body_ar.trim(),
        image_alt_en: draft.image_alt_en.trim(),
        image_alt_ar: draft.image_alt_ar.trim(),
        image_path: file ? await uploadImage('about', file) : draft.image_path,
        published: draft.published
      };

      const { error: saveError } = section?.id
        ? await supabase.from('about_sections').update(payload).eq('id', section.id)
        : await supabase.from('about_sections').insert({ ...payload, sort_order: await nextSortOrder('about_sections') });
      if (saveError) throw saveError;

      onSaved();
    } catch (saveError) {
      setError(saveError.message || 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const enLines = lineCount(draft.body_en);
  const arLines = lineCount(draft.body_ar);

  return (
    <Panel as="form" onSubmit={save}>
      <PanelTitle>{section?.id ? `Edit >${section.slug}` : 'New about tab'}</PanelTitle>

      <Field>
        Command name (shown as the tab and the first terminal line)
        <Input
          value={draft.slug}
          onChange={e => update('slug', e.target.value)}
          pattern="[a-z0-9_\-]{1,24}"
          placeholder="whoami"
          required
        />
      </Field>

      <Note>One terminal line per line of text. Keeping both languages side by side makes drift easy to spot.</Note>
      <TwoColumns>
        <Field>
          English · {enLines} lines
          <Textarea dir="ltr" rows={8} value={draft.body_en} onChange={e => update('body_en', e.target.value)} required />
        </Field>
        <Field>
          Arabic · {arLines} lines
          <Textarea dir="rtl" lang="ar" rows={8} value={draft.body_ar} onChange={e => update('body_ar', e.target.value)} required />
        </Field>
      </TwoColumns>
      {enLines !== arLines ? <Note $error>The two languages have a different number of lines.</Note> : null}

      <TwoColumns>
        <div>
          <Field>
            Photo
            <Input type="file" accept="image/*" onChange={pickFile} />
          </Field>
          <Field>
            Photo description (English)
            <Input dir="ltr" value={draft.image_alt_en} onChange={e => update('image_alt_en', e.target.value)} />
          </Field>
          <Field>
            Photo description (Arabic)
            <Input dir="rtl" lang="ar" value={draft.image_alt_ar} onChange={e => update('image_alt_ar', e.target.value)} />
          </Field>
          <Row as="label" style={{ cursor: 'pointer', fontSize: '0.82rem' }}>
            <input type="checkbox" checked={draft.published} onChange={e => update('published', e.target.checked)} />
            Published
          </Row>
        </div>
        {previewImage ? <PreviewImage src={previewImage} alt="" /> : <Note>No photo — the frame stays empty for this tab.</Note>}
      </TwoColumns>

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
  gap: 1rem;
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 240px;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid rgba(126, 62, 190, 0.35);
`;



const ItemTitle = styled.p`
  margin: 0;
  font-size: 0.92rem;
  color: #f3efe9;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
`;
