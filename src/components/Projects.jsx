import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styled from 'styled-components';
import { useLanguage } from '../useLanguage.js';
import { useSiteContent } from '../useSiteContent.js';
import { isFxOn } from '../preferences.js';
import { ProjectCard } from './ProjectCard.jsx';
import { ProjectDialog } from './ProjectDialog.jsx';

const HASH_PREFIX = '#project/';
const MORPH_NAME = 'project-morph';

const slugFromHash = () =>
  typeof window !== 'undefined' && window.location.hash.startsWith(HASH_PREFIX)
    ? decodeURIComponent(window.location.hash.slice(HASH_PREFIX.length))
    : null;

const cardFor = slug => document.querySelector(`[data-project-card="${CSS.escape(slug)}"]`);
const panel = () => document.querySelector('.project-dialog-panel');

/**
 * Applies a popup open/close under a View Transition in which the card and the
 * popup panel share one name, so the browser morphs one into the other. Falls back
 * to the dialog's own CSS entrance when unsupported or with fx off.
 */
function morph(slug, opening, update) {
  const card = slug ? cardFor(slug) : null;
  // Morph only from a card that is on screen; flying in from off-screen (e.g. when
  // opened from the experience log) reads as a glitch, so use the plain entrance.
  const rect = card?.getBoundingClientRect();
  const visible = rect && rect.bottom > 0 && rect.top < window.innerHeight;
  if (!visible || !isFxOn() || typeof document.startViewTransition !== 'function') {
    update();
    return;
  }

  const root = document.documentElement;
  root.dataset.projectMorph = opening ? 'open' : 'close';
  const before = opening ? card : panel();
  if (before) before.style.viewTransitionName = MORPH_NAME;

  const transition = document.startViewTransition(() => {
    if (before) before.style.viewTransitionName = '';
    flushSync(update);
    const after = opening ? panel() : cardFor(slug);
    if (after) after.style.viewTransitionName = MORPH_NAME;
  });

  transition.finished.finally(() => {
    delete root.dataset.projectMorph;
    for (const node of [cardFor(slug), panel()]) if (node) node.style.viewTransitionName = '';
  });
}

export default function Projects() {
  const { content, language, direction } = useLanguage();
  const { projects, settings } = useSiteContent();
  const projectsContent = content.projects;
  const [openSlug, setOpenSlug] = useState(slugFromHash);
  // True when this page pushed the #project/ entry, so closing can step back
  // through history instead of leaving a dead entry behind.
  const pushedRef = useRef(false);
  const openProject = projects.find(project => project.slug === openSlug) || null;

  const openSlugRef = useRef(openSlug);
  useEffect(() => {
    openSlugRef.current = openSlug;
  }, [openSlug]);

  useEffect(() => {
    const onHashChange = () => {
      const next = slugFromHash();
      const current = openSlugRef.current;
      if (next === current) return;
      // Any in-page navigation to a #project/ link (a card, or the experience log)
      // pushed a history entry, so closing can step back through it.
      pushedRef.current = Boolean(next);
      // Covers clicks, Escape (via history.back) and the browser's back/forward
      // buttons alike; the morph runs from whichever card is involved.
      morph(next || current, Boolean(next), () => setOpenSlug(next));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const open = useCallback(project => {
    // Setting the hash adds a history entry and fires hashchange, which opens it.
    window.location.hash = `${HASH_PREFIX.slice(1)}${encodeURIComponent(project.slug)}`;
  }, []);

  const close = useCallback(() => {
    if (pushedRef.current) {
      window.history.back();
      return;
    }
    // Arrived on a deep link: drop the hash without adding a history entry.
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    morph(openSlug, false, () => setOpenSlug(null));
  }, [openSlug]);
  const stackRef = useRef(null);
  const [stackVisible, setStackVisible] = useState(false);
  const hasStack = settings.stack_items.length > 0;

  useEffect(() => {
    const node = stackRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return;
        setStackVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStack]);

  return (
    <Section dir="ltr">
      <Content>
        <p className="system-kicker projects-kicker">{projectsContent.kicker}</p>

        {hasStack ? (
          <StackOutput ref={stackRef} className={stackVisible ? 'is-visible' : ''}>
            <StackCommand>{projectsContent.stackCommand}</StackCommand>
            <StackInline>{settings.stack_items.join(' · ')}</StackInline>
          </StackOutput>
        ) : null}

        <CardsGrid>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              language={language}
              onOpen={open}
              openLabel={projectsContent.open}
            />
          ))}
        </CardsGrid>

        <ProjectDialog project={openProject} language={language} direction={direction} strings={projectsContent.dialog} onClose={close} />
      </Content>
    </Section>
  );
}

const Section = styled.section`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(4rem, 8vw, 6rem) 0;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-height: auto;
    padding: clamp(2.4rem, 5.4vw, 3.4rem) 0;
  }
`;

const Content = styled.div`
  position: relative;
  width: min(1120px, 100%);
  max-width: 100%;
  padding: 0 clamp(1rem, 3vw, 2.4rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 0.35rem;
  }
`;

const StackOutput = styled.div`
  margin: 0.05rem 0 0.65rem;
  padding-left: 0.08rem;
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 220ms ease, transform 220ms ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    margin: 0.02rem 0 0.45rem;
  }
`;

const StackCommand = styled.span`
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.83rem;
  letter-spacing: 0.04em;
  color: rgba(197, 174, 226, 0.84);
`;

const StackInline = styled.span`
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.86rem;
  letter-spacing: 0.01em;
  color: rgba(241, 236, 247, 0.76);
`;

const CardsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 1.1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;
