import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase.js';
import { Button, Item, List, Note, Panel, PanelTitle, Row } from './theme.js';
import { ProjectForm } from './ProjectForm.jsx';
import { swapOrder } from './shared.js';

export function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null); // a project object, 'new', or null
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (loadError) setError(loadError.message);
    else setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const afterWrite = useCallback(async () => {
    setEditing(null);
    await load();
  }, [load]);

  const move = async (index, direction) => {
    const target = projects[index + direction];
    if (!target) return;

    setError('');
    const failure = await swapOrder('projects', projects[index], target);
    if (failure) setError(failure.message);
    await load();
  };

  const togglePublished = async project => {
    setError('');
    const { error: toggleError } = await supabase
      .from('projects')
      .update({ published: !project.published })
      .eq('id', project.id);

    if (toggleError) setError(toggleError.message);
    await load();
  };

  const remove = async project => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    setError('');
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', project.id);
    if (deleteError) setError(deleteError.message);
    await load();
  };

  if (editing) {
    return (
      <ProjectForm
        project={editing === 'new' ? null : editing}
        onSaved={afterWrite}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <Panel>
      <Row style={{ justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <PanelTitle style={{ margin: 0 }}>Projects</PanelTitle>
        <Button $primary type="button" onClick={() => setEditing('new')}>
          New project
        </Button>
      </Row>

      {loading ? <Note>Loading…</Note> : null}
      {error ? <Note $error>{error}</Note> : null}
      {!loading && !projects.length ? <Note>No projects yet.</Note> : null}

      <List>
        {projects.map((project, index) => (
          <Item key={project.id} $dim={!project.published}>
            <ItemMain>
              <ItemTitle>{project.title}</ItemTitle>
              <Note style={{ margin: 0 }}>
                {project.tech}
                {project.published ? '' : ' · unpublished'}
              </Note>
            </ItemMain>

            <Row>
              <Button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${project.title} up`}>
                ↑
              </Button>
              <Button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === projects.length - 1}
                aria-label={`Move ${project.title} down`}
              >
                ↓
              </Button>
              <Button type="button" onClick={() => togglePublished(project)}>
                {project.published ? 'Unpublish' : 'Publish'}
              </Button>
              <Button type="button" onClick={() => setEditing(project)}>
                Edit
              </Button>
              <Button $danger type="button" onClick={() => remove(project)}>
                Delete
              </Button>
            </Row>
          </Item>
        ))}
      </List>
    </Panel>
  );
}



const ItemMain = styled.div`
  min-width: 0;
`;

const ItemTitle = styled.p`
  margin: 0;
  font-size: 0.92rem;
  color: #f3efe9;
`;
