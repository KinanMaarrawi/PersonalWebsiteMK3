import styled from 'styled-components';
import { resolveAssetUrl } from '../lib/supabase.js';

const MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/** "Python + React" / "Kotlin, Room" → ["Python", "React"] for the tech chips. */
const splitTech = tech =>
  tech
    .split(/\s*(?:\+|,|·|\/)\s*/)
    .map(item => item.trim())
    .filter(Boolean);

/**
 * The inside of a project popup. Shared by the public dialog and the admin form's
 * preview, so what is previewed is what ships. Every detail field is optional; with
 * none filled in this still reads as a complete (short) entry.
 */
export function ProjectDetails({ project, language, strings, imageUrl, titleId }) {
  const src = imageUrl || resolveAssetUrl(project.image_path);
  const description = project[`long_description_${language}`] || project[`description_${language}`];
  const highlights = project[`highlights_${language}`] || [];
  const paragraphs = description.split(/\n\s*\n/).filter(Boolean);

  return (
    <Wrapper>
      {src ? <Image src={src} alt="" /> : null}

      <Body>
        <Meta dir="ltr">
          {project.period ? <span>{project.period}</span> : null}
          {splitTech(project.tech).map(item => (
            <Chip key={item}>{item}</Chip>
          ))}
        </Meta>

        <Title id={titleId}>{project.title}</Title>

        {paragraphs.map(paragraph => (
          <Paragraph key={paragraph.slice(0, 32)}>{paragraph}</Paragraph>
        ))}

        {highlights.length ? (
          <>
            <SubKicker>&gt; {strings.highlights}</SubKicker>
            <Highlights>
              {highlights.map(item => (
                <li key={item}>{item}</li>
              ))}
            </Highlights>
          </>
        ) : null}

        <Links>
          <LinkOut href={project.github_url} target="_blank" rel="noopener noreferrer">
            &gt; {strings.source}
          </LinkOut>
          {project.live_url ? (
            <LinkOut href={project.live_url} target="_blank" rel="noopener noreferrer">
              &gt; {strings.live}
            </LinkOut>
          ) : null}
        </Links>
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  color: #f1ecf7;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 7;
  object-fit: cover;
  border-bottom: 1px solid rgba(126, 62, 190, 0.25);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: clamp(1.1rem, 3vw, 1.7rem);
`;

const Meta = styled.p`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.5rem;
  font-family: ${MONO};
  font-size: 0.76rem;
  color: rgba(197, 174, 226, 0.84);

  [dir='rtl'] & {
    justify-content: flex-end;
  }
`;

const Chip = styled.span`
  padding: 0.16rem 0.5rem;
  border: 1px solid rgba(126, 62, 190, 0.4);
  border-radius: 999px;
  color: rgba(241, 236, 247, 0.86);
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.5rem, 3.4vw, 2rem);
  font-weight: 650;
  line-height: 1.15;
  color: #f3efe9;
`;

const Paragraph = styled.p`
  margin: 0;
  max-width: 62ch;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(241, 236, 247, 0.84);
`;

const SubKicker = styled.p`
  margin: 0.4rem 0 0;
  font-family: ${MONO};
  font-size: 0.78rem;
  color: rgba(157, 110, 214, 0.9);
`;

const Highlights = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(241, 236, 247, 0.82);

  li::before {
    content: '+ ';
    font-family: ${MONO};
    color: rgba(157, 110, 214, 0.9);
  }
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
`;

const LinkOut = styled.a`
  padding: 0.5rem 0.9rem;
  border: 1px solid rgba(126, 62, 190, 0.5);
  border-radius: 0.45rem;
  font-family: ${MONO};
  font-size: 0.84rem;
  color: #f1ecf7;
  text-decoration: none;
  transition: background-color 160ms ease, border-color 160ms ease;

  &:hover {
    background: rgba(126, 62, 190, 0.24);
    border-color: rgba(157, 110, 214, 0.75);
  }
`;
