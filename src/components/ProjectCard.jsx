import styled from 'styled-components';
import { resolveAssetUrl } from '../lib/supabase.js';

/**
 * A single project card, shared between the public grid and the admin form's live
 * preview so that what is previewed is literally what ships.
 *
 * `imageUrl` overrides the resolved storage path; the admin uses it to preview a
 * locally selected file (a blob: URL) before it has been uploaded anywhere.
 *
 * Note: description and tech are hidden above 768px by design — on desktop the card
 * is image + title only.
 */
export function ProjectCard({ project, language = 'en', imageUrl, preview = false }) {
  const src = imageUrl || resolveAssetUrl(project.image_path);
  const linkProps = preview
    ? { as: 'div' }
    : { href: project.github_url, target: '_blank', rel: 'noopener noreferrer' };

  return (
    <Card {...linkProps}>
      {src ? <CardImage src={src} alt={project.title} loading="lazy" decoding="async" /> : <CardImagePlaceholder />}
      <CardBody>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project[`description_${language}`]}</CardDescription>
        <CardTech>{project.tech}</CardTech>
      </CardBody>
    </Card>
  );
}

/*
 * An anchor rather than a click-handled div: cards are navigation, so they need to
 * be reachable by keyboard, announced as links, and openable in a new tab.
 */
const Card = styled.a`
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
  text-decoration: none;
  color: inherit;
  transition: transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 280ms cubic-bezier(0.22, 0.61, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(157, 110, 214, 0.65);
  }

  &:focus-visible {
    outline: 2px solid rgba(157, 110, 214, 0.9);
    outline-offset: 3px;
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

const CardImagePlaceholder = styled.div`
  width: 100%;
  height: 196px;
  background: repeating-linear-gradient(
    45deg,
    rgba(126, 62, 190, 0.12),
    rgba(126, 62, 190, 0.12) 8px,
    transparent 8px,
    transparent 16px
  );
  border-bottom: 1px solid rgba(126, 62, 190, 0.25);

  @media (max-width: 768px) {
    width: 70px;
    min-width: 70px;
    height: auto;
    border-bottom: none;
    border-right: 1px solid rgba(126, 62, 190, 0.25);
  }
`;
