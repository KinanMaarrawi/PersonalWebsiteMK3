import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../useLanguage.js';
import { useSiteContent } from '../useSiteContent.js';
import { ProjectCard } from './ProjectCard.jsx';

export default function Projects() {
  const { content, language } = useLanguage();
  const { projects, settings } = useSiteContent();
  const projectsContent = content.projects;
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
            <ProjectCard key={project.id} project={project} language={language} />
          ))}
        </CardsGrid>
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
