import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../useLanguage.js';

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

export default function About() {
  const { content } = useLanguage();
  const aboutContent = content.about;
  const commands = aboutContent.commands;
  const [activeCommandId, setActiveCommandId] = useState('whoami');
  const [typedOutput, setTypedOutput] = useState('');
  const [imageCurrentId, setImageCurrentId] = useState('whoami');
  const [imagePrevId, setImagePrevId] = useState(null);

  const typingVersionRef = useRef(0);
  const imageTimerRef = useRef(0);
  const imageVersionRef = useRef(0);
  const typingTimerRef = useRef(0);

  const activeCommand = useMemo(() => commands.find(command => command.id === activeCommandId) || commands[0], [activeCommandId, commands]);
  const imageCurrentCommand = useMemo(() => commands.find(command => command.id === imageCurrentId) || commands[0], [imageCurrentId, commands]);
  const imagePrevCommand = useMemo(() => commands.find(command => command.id === imagePrevId) || commands[0], [imagePrevId, commands]);

  useEffect(() => {
    commands.forEach(command => {
      preloadImage(command.image);
    });
  }, [commands]);

  useEffect(() => {
    const fullText = activeCommand.lines.join('\n');
    const totalChars = fullText.length;
    const targetDuration = 720;
    const stepDelay = Math.max(10, Math.floor(targetDuration / Math.max(1, totalChars)));

    typingVersionRef.current += 1;
    const version = typingVersionRef.current;
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
  }, [activeCommand]);

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
          <div className="about-terminal-commands" role="tablist" aria-label="Terminal commands">
            {commands.map(command => (
              <button
                key={command.id}
                type="button"
                className={`about-terminal-command ${activeCommandId === command.id ? 'is-active' : ''}`}
                onClick={() => setActiveCommandId(command.id)}
                role="tab"
                aria-selected={activeCommandId === command.id}
              >
                {command.id}
              </button>
            ))}
          </div>

          <pre className="about-terminal-output" aria-live="polite" dir="auto">
            {typedOutput}
          </pre>
        </div>

        <div className="about-image-panel">
          <div className="about-image-frame">
            {imagePrevId ? (
              <img
                key={`prev-${imagePrevId}`}
                src={imagePrevCommand.image}
                alt=""
                width="960"
                height="1200"
                className="about-image-layer is-outgoing"
              />
            ) : null}

            <img
              key={`current-${imageCurrentId}`}
              src={imageCurrentCommand.image}
              alt={imageCurrentCommand.imageAlt}
              width="960"
              height="1200"
              className="about-image-layer is-incoming"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
