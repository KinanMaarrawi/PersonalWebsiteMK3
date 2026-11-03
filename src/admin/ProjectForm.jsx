import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase.js';
import { MAX_IMAGE_BYTES, nextSortOrder, uploadImage } from './shared.js';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { ProjectDetails } from '../components/ProjectDetails.jsx';
import { content } from '../i18n.js';
import { Button, Field, Input, Note, Panel, PanelTitle, Row, Textarea } from './theme.js';

const EMPTY_PROJECT = {
  slug: '',
  title: '',
  tech: '',
  period: '',
  github_url: '',
  live_url: '',
  description_en: '',
  description_ar: '',
  long_description_en: '',
  long_description_ar: '',
  highlights_en: [],
  highlights_ar: [],
  image_path: null,
  published: true
};

const POPUP_STRINGS = {
  en: content.en.projects.dialog,
  ar: content.ar.projects.dialog
};

const toLines = list => (list || []).join('\n');
const fromLines = text => text.split('\n').map(line => line.trim()).filter(Boolean);
const slugify = text =>
  text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

export function ProjectForm({ project, onSaved, onCancel }) {
  const [draft, setDraft] = useState(() => {
    const base = { ...EMPTY_PROJECT, ...(project || {}) };
    // Highlights are edited as one-per-line text.
    return { ...base, highlights_en: toLines(base.highlights_en), highlights_ar: toLines(base.highlights_ar), live_url: base.live_url || '' };
  });
  const [previewMode, setPreviewMode] = useState('card');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [previewLanguage, setPreviewLanguage] = useState('en');

  // A local object URL lets the preview show the chosen image before it is uploaded.
  const localImageUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (localImageUrl) URL.revokeObjectURL(localImageUrl); }, [localImageUrl]);

  const update = (key, value) => setDraft(current => ({ ...current, [key]: value }));

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
      let imagePath = draft.image_path;
      if (file) imagePath = await uploadImage('projects', file);

      const payload = {
        slug: (draft.slug.trim() || slugify(draft.title)) || undefined,
        title: draft.title.trim(),
        tech: draft.tech.trim(),
        period: draft.period.trim(),
        github_url: draft.github_url.trim(),
        live_url: draft.live_url.trim() || null,
        description_en: draft.description_en.trim(),
        description_ar: draft.description_ar.trim(),
        long_description_en: draft.long_description_en.trim(),
        long_description_ar: draft.long_description_ar.trim(),
        highlights_en: fromLines(draft.highlights_en),
        highlights_ar: fromLines(draft.highlights_ar),
        image_path: imagePath,
        published: draft.published
      };

      if (project?.id) {
        const { error: updateError } = await supabase.from('projects').update(payload).eq('id', project.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert({ ...payload, sort_order: await nextSortOrder('projects') });
        if (insertError) throw insertError;
      }

      onSaved();
    } catch (saveError) {
      setError(saveError.message || 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel as="form" onSubmit={save}>
      <PanelTitle>{project?.id ? `Edit ${project.title}` : 'New project'}</PanelTitle>

      <Layout>
        <div>
          <Field>
            Title
            <Input value={draft.title} onChange={e => update('title', e.target.value)} required />
          </Field>

          <Field>
            Tech
            <Input
              value={draft.tech}
              onChange={e => update('tech', e.target.value)}
              placeholder="Python + React"
              required
            />
          </Field>

          <Field>
            GitHub URL
            <Input
              type="url"
              pattern="https://.*"
              value={draft.github_url}
              onChange={e => update('github_url', e.target.value)}
              placeholder="https://github.com/KinanMaarrawi/..."
              required
            />
          </Field>

          <Field>
            Live URL (optional)
            <Input
              type="url"
              pattern="https://.*"
              value={draft.live_url}
              onChange={e => update('live_url', e.target.value)}
              placeholder="https://..."
            />
          </Field>

          <Field>
            Period (optional, shown in the popup)
            <Input value={draft.period} onChange={e => update('period', e.target.value)} placeholder="Summer 2025" />
          </Field>

          <Field>
            Link name, used in #project/… share links (leave empty to derive from the title)
            <Input
              value={draft.slug}
              onChange={e => update('slug', e.target.value)}
              pattern="[a-z0-9\-]{1,48}"
              placeholder={slugify(draft.title) || 'my-project'}
            />
          </Field>

          <Field>
            Description (English)
            <Textarea
              dir="ltr"
              value={draft.description_en}
              onChange={e => update('description_en', e.target.value)}
              required
            />
          </Field>

          <Field>
            Description (Arabic)
            <Textarea
              dir="rtl"
              lang="ar"
              value={draft.description_ar}
              onChange={e => update('description_ar', e.target.value)}
              required
            />
          </Field>

          <Field>
            Popup write-up (English, optional — blank lines separate paragraphs; falls back to the description)
            <Textarea
              dir="ltr"
              rows={6}
              value={draft.long_description_en}
              onChange={e => update('long_description_en', e.target.value)}
            />
          </Field>

          <Field>
            Popup write-up (Arabic, optional)
            <Textarea
              dir="rtl"
              lang="ar"
              rows={6}
              value={draft.long_description_ar}
              onChange={e => update('long_description_ar', e.target.value)}
            />
          </Field>

          <Field>
            Highlights (English, one per line — what was hard, what you learned)
            <Textarea dir="ltr" rows={4} value={draft.highlights_en} onChange={e => update('highlights_en', e.target.value)} />
          </Field>

          <Field>
            Highlights (Arabic, one per line)
            <Textarea
              dir="rtl"
              lang="ar"
              rows={4}
              value={draft.highlights_ar}
              onChange={e => update('highlights_ar', e.target.value)}
            />
          </Field>

          <Field>
            Card image
            <Input type="file" accept="image/*" onChange={pickFile} />
          </Field>

          <Row as="label" style={{ cursor: 'pointer', fontSize: '0.82rem' }}>
            <input
              type="checkbox"
              checked={draft.published}
              onChange={e => update('published', e.target.checked)}
            />
            Published
          </Row>
        </div>

        <PreviewColumn>
          <Row style={{ justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <Note>Preview</Note>
            <Button
              type="button"
              onClick={() => setPreviewLanguage(current => (current === 'en' ? 'ar' : 'en'))}
            >
              {previewLanguage === 'en' ? 'EN' : 'ع'}
            </Button>
          </Row>

          <Row style={{ marginBottom: '0.6rem' }}>
            <Button type="button" $primary={previewMode === 'card'} onClick={() => setPreviewMode('card')}>
              Card
            </Button>
            <Button type="button" $primary={previewMode === 'popup'} onClick={() => setPreviewMode('popup')}>
              Popup
            </Button>
          </Row>

          {previewMode === 'card' ? (
            <ProjectCard project={draft} language={previewLanguage} imageUrl={localImageUrl} preview />
          ) : (
            <PopupFrame dir={previewLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <ProjectDetails
                project={{ ...draft, highlights_en: fromLines(draft.highlights_en), highlights_ar: fromLines(draft.highlights_ar) }}
                language={previewLanguage}
                strings={POPUP_STRINGS[previewLanguage]}
                imageUrl={localImageUrl}
              />
            </PopupFrame>
          )}
        </PreviewColumn>
      </Layout>

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

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  gap: 1.4rem;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const PopupFrame = styled.div`
  border: 1px solid rgba(126, 62, 190, 0.45);
  border-radius: 0.72rem;
  overflow: hidden;
  background: rgb(18, 14, 27);
`;

const PreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
