import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const EMAIL = 'kinan@maarrawi.com';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section>
      <Content>
        <Kicker className="system-kicker">
          &gt; <KickerAccent>contact</KickerAccent>
        </Kicker>

        <Lines>
          <ContactBlock>
            <Label>email</Label>
            <ValueRow>
              <Value href={`mailto:${EMAIL}`}>{EMAIL}</Value>
              <CopyButton type="button" onClick={copyEmail}>
                copy
              </CopyButton>
              <CopiedHint aria-live="polite">{copied ? 'copied.' : ''}</CopiedHint>
            </ValueRow>
          </ContactBlock>

          <ContactBlock>
            <Label>linkedin</Label>
            <Value href="https://www.linkedin.com/in/kinan-maarrawi/" target="_blank" rel="noreferrer">
              https://www.linkedin.com/in/kinan-maarrawi/
            </Value>
          </ContactBlock>

          <ContactBlock>
            <Label>github</Label>
            <Value href="https://github.com/KinanMaarrawi" target="_blank" rel="noreferrer">
              https://github.com/KinanMaarrawi
            </Value>
          </ContactBlock>

          <ContactBlock>
            <Label>cv</Label>
            <Value href="/CV.pdf" target="_blank" rel="noreferrer">
              Download CV (PDF)
            </Value>
          </ContactBlock>
        </Lines>
      </Content>
    </Section>
  );
}

const Section = styled.section`
  width: 100%;
  max-width: 100%;
  min-height: auto;
  padding: clamp(2.2rem, 4.5vw, 3.4rem) 0 clamp(2.4rem, 4.8vw, 3.8rem);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: min(1120px, 100%);
  max-width: 100%;
  padding: 0 clamp(1rem, 3vw, 2.4rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.56rem;
  box-sizing: border-box;
`;

const Kicker = styled.p`
  margin: 0 0 0.1rem;
`;

const KickerAccent = styled.span`
  color: rgba(157, 110, 214, 0.9);
`;

const Lines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.72rem;
  padding-left: 0.7rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.18rem;
  width: 100%;
  max-width: 100%;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.92rem;
  line-height: 1.45;
  box-sizing: border-box;
`;

const Label = styled.span`
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: rgba(223, 215, 236, 0.76);
`;

const Value = styled.a`
  font-size: 0.92rem;
  color: rgba(241, 236, 247, 0.9);
  text-decoration: none;
  overflow: hidden;
  word-break: break-word;

  &:hover {
    color: rgba(222, 196, 255, 0.97);
  }
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  width: 100%;
`;

const CopyButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(197, 174, 226, 0.9);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.82rem;
  line-height: 1;
`;

const CopiedHint = styled.span`
  min-width: 0;
  color: rgba(197, 174, 226, 0.88);
  font-size: 0.82rem;
`;
