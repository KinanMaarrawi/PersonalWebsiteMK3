import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../useLanguage.js';
import { useSiteContent } from '../useSiteContent.js';
import { resolveAssetUrl } from '../lib/supabase.js';
import { useFx } from '../preferences.js';

function preloadImage(src) {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise(resolve => {
    const image = new Image();
    image.onload = async () => {
      try {
        if (image.decode) await image.decode();
      } catch {
        // The image is already loaded; failed decode should not block rendering.
      }
      resolve();
    };
    image.onerror = resolve;
    image.src = src;
  });
}

/** Turns about_sections rows into the terminal's commands for one language. */
function toCommands(rows, language) {
  return rows.map(row => ({
    id: row.slug,
    image: resolveAssetUrl(row.image_path),
    imageAlt: row[`image_alt_${language}`],
    lines: [`>${row.slug}`, ...row[`body_${language}`].split('\n').map(line => line.trim()).filter(Boolean)]
  }));
}

export default function About() {
  const { content, direction, language } = useLanguage();
  const { about } = useSiteContent();
  if (!about.length) return null;
  return <AboutTerminal key={about.map(row => row.slug).join()} rows={about} content={content.about} direction={direction} language={language} />;
}

function AboutTerminal({ rows, content: aboutContent, direction, language }) {
  const commands = useMemo(() => toCommands(rows, language), [rows, language]);
  const fxOn = useFx();
  const tabRefs = useRef([]);
  const [activeCommandId, setActiveCommandId] = useState(commands[0].id);
  const [typedOutput, setTypedOutput] = useState('');
  const [imageCurrentId, setImageCurrentId] = useState(commands[0].id);
  const [imagePrevId, setImagePrevId] = useState(null);

  const typingVersionRef = useRef(0);
  const imageTimerRef = useRef(0);
  const imageVersionRef = useRef(0);
  const typingTimerRef = useRef(0);

  const activeCommand = useMemo(() => commands.find(command => command.id === activeCommandId) || commands[0], [activeCommandId, commands]);
  const fullOutput = useMemo(() => activeCommand.lines.join('\n'), [activeCommand]);

  /**
   * Arrow-key navigation for the tablist (WAI-ARIA tabs pattern). Left/Right are
   * mirrored under RTL so the arrows follow what the reader actually sees.
   */
  const onTabKeyDown = event => {
    const lastIndex = commands.length - 1;
    const currentIndex = commands.findIndex(command => command.id === activeCommandId);
    const back = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    const forward = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

    let nextIndex = null;
    if (event.key === forward || event.key === 'ArrowDown') nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    else if (event.key === back || event.key === 'ArrowUp') nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = lastIndex;

    if (nextIndex === null) return;
    event.preventDefault();
    setActiveCommandId(commands[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };
  const imageCurrentCommand = useMemo(() => commands.find(command => command.id === imageCurrentId) || commands[0], [imageCurrentId, commands]);
  const imagePrevCommand = useMemo(() => commands.find(command => command.id === imagePrevId) || commands[0], [imagePrevId, commands]);

  useEffect(() => {
    commands.forEach(command => {
      if (command.image) preloadImage(command.image);
    });
  }, [commands]);

  useEffect(() => {
    const fullText = activeCommand.lines.join('\n');
    const totalChars = fullText.length;
    const targetDuration = 720;
    const stepDelay = Math.max(10, Math.floor(targetDuration / Math.max(1, totalChars)));

    typingVersionRef.current += 1;
    const version = typingVersionRef.current;
    if (!fxOn) {
      setTypedOutput(fullText);
      return undefined;
    }
    setTypedOutput('');

    let index = 0;
    const typeNextChar = () => {
      if (version !== typingVersionRef.current) return;
      index += 1;
      setTypedOutput(fullText.slice(0, index));
      if (index < totalChars) {
        typingTimerRef.current = window.setTimeout(typeNextChar, stepDelay);
      }
    };

    typingTimerRef.current = window.setTimeout(typeNextChar, stepDelay);

    return () => {
      window.clearTimeout(typingTimerRef.current);
    };
  }, [activeCommand, fxOn]);

  useEffect(() => {
    if (imageCurrentId === activeCommandId) return undefined;

    imageVersionRef.current += 1;
    const version = imageVersionRef.current;
    const nextCommand = commands.find(command => command.id === activeCommandId) || commands[0];

    preloadImage(nextCommand.image).then(() => {
      if (version !== imageVersionRef.current) return;

      window.clearTimeout(imageTimerRef.current);
      setImagePrevId(imageCurrentId);
      setImageCurrentId(activeCommandId);
      imageTimerRef.current = window.setTimeout(() => setImagePrevId(null), 260);
    });

    return () => window.clearTimeout(imageTimerRef.current);
  }, [activeCommandId, imageCurrentId, commands]);

  useEffect(() => {
    return () => {
      window.clearTimeout(typingTimerRef.current);
      window.clearTimeout(imageTimerRef.current);
    };
  }, []);

  return (
    <section className="about-terminal-shell">
      <div className="about-ambient-glow" aria-hidden="true" />
      <p className="system-kicker about-kicker">{aboutContent.kicker}</p>
      <div className="about-terminal-grid">
        <div className="about-terminal-window">
          <div
            className="about-terminal-commands"
            role="tablist"
            aria-label={aboutContent.tablistLabel}
            onKeyDown={onTabKeyDown}
          >
            {commands.map((command, index) => (
              <button
                key={command.id}
                type="button"
                id={`about-tab-${command.id}`}
                ref={node => { tabRefs.current[index] = node; }}
                className={`about-terminal-command ${activeCommandId === command.id ? 'is-active' : ''}`}
                onClick={() => setActiveCommandId(command.id)}
                role="tab"
                aria-selected={activeCommandId === command.id}
                aria-controls={`about-panel-${command.id}`}
                // Roving tabindex: Tab reaches the tablist once, then arrows move
                // between tabs, per the WAI-ARIA tabs pattern.
                tabIndex={activeCommandId === command.id ? 0 : -1}
              >
                {command.id}
              </button>
            ))}
          </div>

          <pre
            className="about-terminal-output"
            dir="auto"
            role="tabpanel"
            id={`about-panel-${activeCommandId}`}
            aria-labelledby={`about-tab-${activeCommandId}`}
            tabIndex={0}
          >
            {/*
             * The visible text types character by character. Announcing that to a
             * screen reader would repeat the whole string on every keystroke, so the
             * animation is hidden from assistive tech and the finished text is
             * exposed once instead.
             */}
            <span aria-hidden="true">{typedOutput}</span>
            <span className="visually-hidden">{fullOutput}</span>
          </pre>
        </div>

        <div className="about-image-panel">
          <div className="about-image-frame">
            {imagePrevId && imagePrevCommand.image ? (
              <img
                key={`prev-${imagePrevId}`}
                src={imagePrevCommand.image}
                alt=""
                width="960"
                height="1200"
                className="about-image-layer is-outgoing"
              />
            ) : null}

            {imageCurrentCommand.image ? (
              <img
                key={`current-${imageCurrentId}`}
                src={imageCurrentCommand.image}
                alt={imageCurrentCommand.imageAlt}
                width="960"
                height="1200"
                className="about-image-layer is-incoming"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
