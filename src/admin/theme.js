import styled, { createGlobalStyle } from 'styled-components';

/**
 * Shared primitives for the admin app. It reuses the site's terminal palette so the
 * two do not feel like different products, but it is deliberately plainer: this is a
 * tool, not a showcase.
 */

export const AdminGlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: #0b0812;
    color: #f1ecf7;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    -webkit-font-smoothing: antialiased;
  }
`;

export const Page = styled.main`
  width: min(940px, 100%);
  margin: 0 auto;
  padding: clamp(1.2rem, 4vw, 2.6rem) clamp(1rem, 4vw, 2rem) 4rem;
`;

export const Kicker = styled.p`
  margin: 0 0 1.6rem;
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  color: rgba(197, 174, 226, 0.84);
`;

export const Panel = styled.section`
  border: 1px solid rgba(126, 62, 190, 0.35);
  border-radius: 0.72rem;
  background: rgba(18, 14, 27, 0.92);
  padding: clamp(0.9rem, 3vw, 1.3rem);
  margin-bottom: 1.2rem;
`;

export const PanelTitle = styled.h2`
  margin: 0 0 0.9rem;
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: #f3efe9;
`;

export const Button = styled.button`
  font: inherit;
  font-size: 0.84rem;
  padding: 0.5rem 0.9rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(126, 62, 190, 0.5);
  background: ${props => (props.$primary ? 'rgba(126, 62, 190, 0.34)' : 'transparent')};
  color: ${props => (props.$danger ? '#ffb4b4' : '#f1ecf7')};
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, opacity 160ms ease;

  &:hover:not(:disabled) {
    background: rgba(126, 62, 190, 0.24);
    border-color: rgba(157, 110, 214, 0.75);
  }

  &:focus-visible {
    outline: 2px solid rgba(157, 110, 214, 0.9);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.85rem;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  color: rgba(197, 174, 226, 0.84);
`;

const inputStyles = `
  font: inherit;
  font-size: 0.88rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(126, 62, 190, 0.35);
  background: rgba(10, 8, 16, 0.9);
  color: #f1ecf7;
  width: 100%;

  &:focus-visible {
    outline: 2px solid rgba(157, 110, 214, 0.9);
    outline-offset: 1px;
  }
`;

export const Input = styled.input`${inputStyles}`;

export const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 5.2rem;
  resize: vertical;
  line-height: 1.45;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

export const Note = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.76rem;
  line-height: 1.45;
  color: ${props => (props.$error ? '#ffb4b4' : 'rgba(241, 236, 247, 0.62)')};
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Item = styled.li`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.75rem;
  border: 1px solid rgba(126, 62, 190, 0.28);
  border-radius: 0.5rem;
  opacity: ${props => (props.$dim ? 0.55 : 1)};
`;
