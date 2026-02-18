import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const projects = [
  {
    title: "Dorz 'Book a Ride'",
    image: '/8.png',
    github: 'https://github.com/KinanMaarrawi/DorzMVP',
    description: 'Ride-booking MVP built for my Internship @ DORZ.',
    tech: 'Kotlin'
  },
  {
    title: 'PM_CLI',
    image: '/7.png',
    github: 'https://github.com/KinanMaarrawi/PM_CLI',
    description: 'Terminal password manager built to learn C and encryption.',
    tech: 'C'
  },
  {
    title: 'GWTIT',
    image: '/10.png',
    github: 'https://github.com/KinanMaarrawi/GWTIT',
    description: 'Flask-based API project that aggregates geographic data for a country in a simple web interface.',
    tech: 'Flask'
  },
  {
    title: 'terra-tui',
    image: '/11.png',
    github: 'https://github.com/KinanMaarrawi/terra-tui',
    description: 'A procedural terrain explorer and TUI sandbox, built in Haskell.',
    tech: 'Haskell'
  }
];

const stackItems = ['Java', 'Python', 'JavaScript', 'Haskell', 'C', 'SQL', 'Git', 'React', 'Next.js', 'Linux', 'TailwindCSS'];

export default function Projects() {
  const stackRef = useRef(null);
  const [stackVisible, setStackVisible] = useState(false);

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
  }, []);

  return (
    <Section>
      <Content>
        <p className="system-kicker projects-kicker">&gt; top_projects</p>

        <StackOutput ref={stackRef} className={stackVisible ? 'is-visible' : ''}>
          <StackCommand>stack:</StackCommand>
          <StackInline>{stackItems.join(' · ')}</StackInline>
        </StackOutput>

        <CardsGrid>
          {projects.map(project => (
            <Card key={project.title} onClick={() => window.open(project.github, '_blank', 'noopener,noreferrer')}>
              <CardImage src={project.image} alt={project.title} />
              <CardBody>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
                <CardTech>{project.tech}</CardTech>
              </CardBody>
            </Card>
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

const Card = styled.article`
  position: relative;
  background: rgba(18, 14, 27, 0.92);
  border: 1px solid rgba(126, 62, 190, 0.35);
  border-radius: 0.72rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  flex: 1 1 320px;
  max-width: 352px;
  transition: transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(157, 110, 214, 0.65);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    min-height: 110px;
    height: auto;
    flex-direction: row;
    align-items: stretch;
    overflow: hidden;
    box-sizing: border-box;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 196px;
  object-fit: cover;
  border-bottom: 1px solid rgba(126, 62, 190, 0.25);

  @media (max-width: 768px) {
    width: 70px;
    min-width: 70px;
    height: 100%;
    border-bottom: none;
    border-right: 1px solid rgba(126, 62, 190, 0.25);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.95rem 1rem 1.05rem;
  min-width: 0;
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0.66rem 0.72rem;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #f3efe9;
  font-size: 1.28rem;
  letter-spacing: 0.01em;
  font-weight: 650;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CardDescription = styled.p`
  display: none;
  margin: 0;

  @media (max-width: 768px) {
    display: block;
    font-size: 0.82rem;
    line-height: 1.35;
    color: rgba(241, 236, 247, 0.82);
    overflow: visible;
    white-space: normal;
    word-break: break-word;
  }
`;

const CardTech = styled.p`
  display: none;
  margin: 0;

  @media (max-width: 768px) {
    display: block;
    font-size: 0.74rem;
    line-height: 1.25;
    color: rgba(197, 174, 226, 0.72);
    overflow: hidden;
    word-break: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;
