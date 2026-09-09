import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { AdminGlobalStyle, Button, Kicker, Note, Page, Panel, PanelTitle, Row } from './theme.js';
import { ProjectsPanel } from './ProjectsPanel.jsx';
import { SettingsPanel } from './SettingsPanel.jsx';

/**
 * Three states, resolved in order: no session, session without admin rights, and
 * authorised. The middle state exists because RLS would silently reject every write
 * otherwise, which is confusing to look at.
 */
export function AdminApp() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Ask the database whether this account is allowed to write, rather than guessing
  // from the email address on the client. RLS limits this read to the caller's own
  // row, so a non-admin simply gets nothing back.
  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }

    supabase
      .from('admins')
      .select('user_id')
      .maybeSingle()
      .then(({ data, error }) => setIsAdmin(!error && Boolean(data)));
  }, [session]);

  const signIn = useCallback(async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.href }
    });
    if (error) setAuthError(error.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <>
        <AdminGlobalStyle />
        <Page>
          <Panel>
            <PanelTitle>Not configured</PanelTitle>
            <Note $error>
              VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing. Copy .env.example to .env and restart the
              dev server.
            </Note>
          </Panel>
        </Page>
      </>
    );
  }

  return (
    <>
      <AdminGlobalStyle />
      <Page>
        <Kicker>&gt; content_admin</Kicker>

        {!ready ? <Note>Checking session…</Note> : null}

        {ready && !session ? (
          <Panel>
            <PanelTitle>Sign in</PanelTitle>
            <Button $primary type="button" onClick={signIn}>
              Sign in with GitHub
            </Button>
            {authError ? <Note $error>{authError}</Note> : null}
          </Panel>
        ) : null}

        {ready && session && isAdmin === false ? (
          <Panel>
            <PanelTitle>Access denied</PanelTitle>
            {/* Deliberately says nothing about which account signed in. */}
            <Note $error>This account does not have access.</Note>
            <Row style={{ marginTop: '0.8rem' }}>
              <Button type="button" onClick={signOut}>
                Sign out
              </Button>
            </Row>
          </Panel>
        ) : null}

        {ready && session && isAdmin ? (
          <>
            <Row style={{ justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <Note>Signed in as {session.user.email || session.user.id}</Note>
              <Button type="button" onClick={signOut}>
                Sign out
              </Button>
            </Row>
            <ProjectsPanel />
            <SettingsPanel />
          </>
        ) : null}
      </Page>
    </>
  );
}
