import { useCallback, useEffect, useState } from 'react';
import { STORAGE_BUCKET, supabase } from '../lib/supabase.js';
import { Button, Field, Input, Note, Panel, PanelTitle, Row } from './theme.js';

/**
 * Fixed path, uploaded with upsert, so the CV's public URL is stable forever and can
 * be linked to from outside the site. Freshness is handled by the ?v= cache-buster
 * built from cv_updated_at rather than by changing the filename.
 */
const CV_OBJECT_PATH = 'cv/CV.pdf';
const MAX_CV_BYTES = 10 * 1024 * 1024;

export function SettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (loadError) setError(loadError.message);
    else setSettings(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (key, value) => setSettings(current => ({ ...current, [key]: value }));

  const saveLinks = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const { error: saveError } = await supabase
      .from('site_settings')
      .update({
        email: settings.email.trim(),
        linkedin_url: settings.linkedin_url.trim(),
        github_url: settings.github_url.trim()
      })
      .eq('id', 1);

    if (saveError) setError(saveError.message);
    else setMessage('Contact links saved.');
    setBusy(false);
  };

  const uploadCv = async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_CV_BYTES) {
      setError('CV must be under 10 MB.');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(CV_OBJECT_PATH, file, { contentType: 'application/pdf', cacheControl: '3600', upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    // Stamping the row is what makes the new file visible past the CDN cache.
    const { error: stampError } = await supabase
      .from('site_settings')
      .update({ cv_updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (stampError) setError(stampError.message);
    else setMessage('CV replaced.');

    await load();
    setBusy(false);
  };

  if (!settings) {
    return (
      <Panel>
        <PanelTitle>Site settings</PanelTitle>
        <Note>{error || 'Loading…'}</Note>
      </Panel>
    );
  }

  return (
    <Panel as="form" onSubmit={saveLinks}>
      <PanelTitle>Site settings</PanelTitle>

      <Field>
        Email
        <Input type="email" value={settings.email} onChange={e => update('email', e.target.value)} required />
      </Field>

      <Field>
        LinkedIn URL
        <Input type="url" value={settings.linkedin_url} onChange={e => update('linkedin_url', e.target.value)} required />
      </Field>

      <Field>
        GitHub URL
        <Input type="url" value={settings.github_url} onChange={e => update('github_url', e.target.value)} required />
      </Field>

      <Row>
        <Button $primary type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save links'}
        </Button>
      </Row>

      <Field style={{ marginTop: '1.4rem' }}>
        Replace CV (PDF)
        <Input type="file" accept="application/pdf" onChange={uploadCv} disabled={busy} />
      </Field>

      <Note>
        {settings.cv_updated_at
          ? `Current CV uploaded ${new Date(settings.cv_updated_at).toLocaleString()}.`
          : 'No CV uploaded yet — the site is serving the committed public/CV.pdf.'}
      </Note>

      {message ? <Note>{message}</Note> : null}
      {error ? <Note $error>{error}</Note> : null}
    </Panel>
  );
}
