import { useCallback, useEffect, useState } from 'react';
import { STORAGE_BUCKET, supabase } from '../lib/supabase.js';
import { CV_OBJECT_PATH } from '../content/queries.js';
import { Button, Field, Input, Note, Panel, PanelTitle, Row, Textarea } from './theme.js';

/*
 * The CV goes to a fixed path (CV_OBJECT_PATH), uploaded with upsert, so its public
 * URL is stable forever and can be linked to from outside the site. Freshness is
 * handled by the ?v= cache-buster built from cv_updated_at.
 */
const MAX_CV_BYTES = 10 * 1024 * 1024;

export function SettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [stackText, setStackText] = useState('');
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
    else {
      setSettings(data);
      setStackText(data.stack_items.join('\n'));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (key, value) => setSettings(current => ({ ...current, [key]: value }));

  const publish = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    const { data, error: publishError } = await supabase.functions.invoke('trigger-rebuild', { method: 'POST' });
    if (publishError) {
      // FunctionsHttpError carries the function's own JSON message in its context.
      const detail = await publishError.context?.json?.().catch(() => null);
      setError(detail?.message || publishError.message);
    } else {
      setMessage(data.message);
    }
    setBusy(false);
  };

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
        github_url: settings.github_url.trim(),
        hero_role_en: settings.hero_role_en.trim(),
        hero_role_ar: settings.hero_role_ar.trim(),
        hero_tagline_en: settings.hero_tagline_en.trim(),
        hero_tagline_ar: settings.hero_tagline_ar.trim(),
        stack_items: stackText.split('\n').map(item => item.trim()).filter(Boolean)
      })
      .eq('id', 1);

    if (saveError) setError(saveError.message);
    else setMessage('Settings saved.');
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

      <Field>
        Hero role (English)
        <Input dir="ltr" value={settings.hero_role_en} onChange={e => update('hero_role_en', e.target.value)} />
      </Field>
      <Field>
        Hero role (Arabic)
        <Input dir="rtl" lang="ar" value={settings.hero_role_ar} onChange={e => update('hero_role_ar', e.target.value)} />
      </Field>
      <Field>
        Hero tagline, the &quot;what I do&quot; line (English, leave empty to hide)
        <Textarea dir="ltr" rows={2} value={settings.hero_tagline_en} onChange={e => update('hero_tagline_en', e.target.value)} />
      </Field>
      <Field>
        Hero tagline (Arabic)
        <Textarea dir="rtl" lang="ar" rows={2} value={settings.hero_tagline_ar} onChange={e => update('hero_tagline_ar', e.target.value)} />
      </Field>
      <Field>
        Tech stack, one per line, in display order
        <Textarea dir="ltr" rows={6} value={stackText} onChange={e => setStackText(e.target.value)} />
      </Field>

      <Row>
        <Button $primary type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save settings'}
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

      <Field style={{ marginTop: '1.4rem' }}>
        Publish
        <Note style={{ margin: 0 }}>
          Edits show on the live site straight away. Publishing rebuilds the site so its built-in backup copy (served
          if Supabase is ever paused) matches them too.
        </Note>
      </Field>
      <Row>
        <Button type="button" onClick={publish} disabled={busy}>
          Publish site
        </Button>
      </Row>

      {message ? <Note>{message}</Note> : null}
      {error ? <Note $error>{error}</Note> : null}
    </Panel>
  );
}
