import { useEffect, useMemo, useRef, useState } from 'react';

const COMMANDS = [
  {
    id: 'whoami',
    image: '/4.JPEG',
    lines: ['>whoami', 'I’m Kinan Maarrawi - a software engineer focused on building systems that feel intentional, not accidental.', 'I build because I like understanding how things are put together. And once I understand them, I want to make them better.', 'Computer Science with Software Engineering (Year 2) @ University of Birmingham Dubai']
  },
  {
    id: 'origin',
    image: '/5.JPEG',
    lines: ['>origin', 'From Damascus, Syria', 'Raised in Dubai', 'Building with both worlds in mind', 'Dubai gave me exposure to ambition and scale. Syria gave me perspective. That combination made me value stability, long-term thinking, and building things that last.']
  },
  {
    id: 'interests',
    image: '/2.JPEG',
    lines: ['>interests', 'Linux + systems', 'PC hardware + tuning', 'Outside of tech, I\'m into cars, fitness, music and history.']
  },
  {
    id: 'currently',
    image: '/1.JPEG',
    lines: ['>currently', 'Focusing on my uni assignments', 'Exploring new languages and frameworks', 'Open to any and all opportunities to learn and grow as a software engineer.']
  }
];

function getCommandById(id) {
  return COMMANDS.find(command => command.id === id) || COMMANDS[0];
}

export default function About() {
  const [activeCommandId, setActiveCommandId] = useState(COMMANDS[0].id);
  const [typedOutput, setTypedOutput] = useState('');
  const [imageCurrentId, setImageCurrentId] = useState(COMMANDS[0].id);
  const [imagePrevId, setImagePrevId] = useState(null);

  const typingVersionRef = useRef(0);
  const imageTimerRef = useRef(0);
  const typingTimerRef = useRef(0);

  const activeCommand = useMemo(() => getCommandById(activeCommandId), [activeCommandId]);

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

    window.clearTimeout(imageTimerRef.current);
    setImagePrevId(imageCurrentId);
    setImageCurrentId(activeCommandId);
    imageTimerRef.current = window.setTimeout(() => setImagePrevId(null), 260);

    return () => window.clearTimeout(imageTimerRef.current);
  }, [activeCommandId, imageCurrentId]);

  useEffect(() => {
    return () => {
      window.clearTimeout(typingTimerRef.current);
      window.clearTimeout(imageTimerRef.current);
    };
  }, []);

  return (
    <section className="about-terminal-shell">
      <div className="about-ambient-glow" aria-hidden="true" />
      <p className="system-kicker about-kicker">&gt; profile_terminal</p>
      <div className="about-terminal-grid">
        <div className="about-terminal-window">
          <div className="about-terminal-commands" role="tablist" aria-label="Terminal commands">
            {COMMANDS.map(command => (
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

          <pre className="about-terminal-output" aria-live="polite">
            {typedOutput}
          </pre>
        </div>

        <div className="about-image-panel">
          <div className="about-image-frame">
            {imagePrevId ? (
              <img
                key={`prev-${imagePrevId}`}
                src={getCommandById(imagePrevId).image}
                alt=""
                className="about-image-layer is-outgoing"
              />
            ) : null}

            <img
              key={`current-${imageCurrentId}`}
              src={getCommandById(imageCurrentId).image}
              alt={activeCommand.id}
              className="about-image-layer is-incoming"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
