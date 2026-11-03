import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase.js';
import { MAX_IMAGE_BYTES, nextSortOrder, uploadImage } from './shared.js';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { Button, Field, Input, Note, Panel, PanelTitle, Row, Textarea } from './theme.js';

const EMPTY_PROJECT = {
  title: '',
  tech: '',
  github_url: '',
  description_en: '',
  description_ar: '',
  image_path: null,
  published: true
};

export function ProjectForm({ project, onSaved, onCancel }) {
  const [draft, setDraft] = useState(project || EMPTY_PROJECT);
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
        title: draft.title.trim(),
        tech: draft.tech.trim(),
        github_url: draft.github_url.trim(),
        description_en: draft.description_en.trim(),
        description_ar: draft.description_ar.trim(),
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

          <ProjectCard project={draft} language={previewLanguage} imageUrl={localImageUrl} preview />

          <Note>Description and tech only appear at mobile widths — that is how the live card is designed.</Note>
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

const PreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
