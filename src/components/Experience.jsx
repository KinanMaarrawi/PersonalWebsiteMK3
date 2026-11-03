import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../useLanguage.js';
import { useSiteContent } from '../useSiteContent.js';
import { buildGitGraph } from '../lib/gitGraph.js';

/* Graph geometry, in px. The curve between lanes always fits in CURVE_END, so rows
 * can grow when expanded and only the straight lines stretch. */
const LANE_W = 16;
const PAD_X = 9;
const NODE_Y = 13;
const CURVE_END = 34;

const laneX = lane => PAD_X + lane * LANE_W;

function formatMonth(date, language) {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`));
}

const hasDetails = (entry, language) =>
  Boolean(
    entry[`summary_${language}`] ||
      entry[`did_${language}`]?.length ||
      entry[`learned_${language}`]?.length ||
      entry.tech?.length ||
      entry.project_id
  );

function GraphCell({ row, laneCount }) {
  const width = laneX(laneCount - 1) + PAD_X;
  const nodeX = laneX(row.lane);

  return (
    <div className="gitlog-graph" style={{ width }} aria-hidden="true">
      {row.lanes.map((cell, lane) => (
        <span key={lane}>
          {cell.top ? (
            <span
              className={`gitlog-line lane-${lane} ${cell.dashedTop ? 'is-dashed' : ''}`}
              style={{ left: laneX(lane), top: 0, height: NODE_Y }}
            />
          ) : null}
          {cell.bottom || cell.bottomFromCurve ? (
            <span
              className={`gitlog-line lane-${lane} ${cell.dashedBottom ? 'is-dashed' : ''}`}
              style={{ left: laneX(lane), top: cell.bottomFromCurve ? CURVE_END : NODE_Y, bottom: 0 }}
            />
          ) : null}
        </span>
      ))}

      <svg className="gitlog-svg" width={width} height={CURVE_END + 1}>
        {row.curve ? (
          <path
            className={`gitlog-curve lane-${Math.max(row.curve.from, row.curve.to)}`}
            d={`M ${laneX(row.curve.from)} ${NODE_Y} C ${laneX(row.curve.from)} ${CURVE_END - 6}, ${laneX(row.curve.to)} ${
              NODE_Y + 8
            }, ${laneX(row.curve.to)} ${CURVE_END}`}
          />
        ) : null}
      </svg>
      {/* The node is an element like the lines (not SVG), so both snap to the same
          pixel grid and stay centred on each other at any zoom level. */}
      <span
        className={`gitlog-node lane-${row.lane} is-${row.type} ${row.future ? 'is-future' : ''}`}
        style={{ left: nodeX, top: NODE_Y }}
      />
    </div>
  );
}

function RowText({ row, strings, language, projectsById, expanded, onToggle }) {
  const { entry, type } = row;
  const title = entry[`title_${language}`];
  const org = entry[`org_${language}`];
  // Orgs and module names are often English inside Arabic text; <bdi> keeps each one
  // in its own order (otherwise "180 Degrees Consulting" renders as "Degrees Consulting 180").
  const titleLine = org ? (
    <>
      {title} · <bdi>{org}</bdi>
    </>
  ) : (
    title
  );

  let refs = null;
  let message = titleLine;
  let dateLabel = formatMonth(row.date, language);
  let muted = false;

  if (type === 'head') {
    refs = 'HEAD -> main';
    dateLabel = strings.now;
  } else if (type === 'tag') {
    refs = 'tag: graduation';
    message = (
      <>
        {strings.graduation} · <bdi>{title}</bdi>
      </>
    );
  } else if (type === 'root') {
    message = strings.initialCommit(org || title);
    muted = true;
  } else if (type === 'merge') {
    // A literal git message: isolate it so Arabic layout cannot reorder the quotes.
    message = <bdi dir="ltr">{`Merge branch '${entry.branch}'`}</bdi>;
    muted = true;
  } else if (type === 'milestone') {
    refs = entry.ref || null;
  } else if (type === 'branch' || type === 'commit') {
    refs = row.isTip ? entry.branch : null;
    const ends = entry.end_date ? formatMonth(entry.end_date, language) : strings.present;
    dateLabel = `${dateLabel} – ${ends}`;
  }

  const expandable = ['head', 'branch', 'commit', 'milestone'].includes(type) && hasDetails(entry, language);
  const detailsId = `gitlog-details-${row.key}`;
  const project = entry.project_id ? projectsById.get(entry.project_id) : null;

  const header = (
    <>
      <span className="gitlog-meta" dir="ltr">
        <span className="gitlog-hash">{row.hash}</span>
        {refs ? <span className="gitlog-refs">({refs})</span> : null}
        <span className="gitlog-date">{dateLabel}</span>
      </span>
      <span className={`gitlog-message ${muted ? 'is-muted' : ''}`}>
        {message}
        {expandable ? <span className="gitlog-toggle" aria-hidden="true">{expanded ? ' [−]' : ' [+]'}</span> : null}
      </span>
    </>
  );

  return (
    <div className={`gitlog-text ${row.future ? 'is-future' : ''}`}>
      {expandable ? (
        <button type="button" className="gitlog-head" aria-expanded={expanded} aria-controls={detailsId} onClick={onToggle}>
          {header}
        </button>
      ) : (
        <div className="gitlog-head">{header}</div>
      )}

      {expandable && expanded ? (
        <div className="gitlog-diff" id={detailsId}>
          {entry[`summary_${language}`] ? <p className="gitlog-summary">{entry[`summary_${language}`]}</p> : null}
          {entry[`did_${language}`]?.length || entry[`learned_${language}`]?.length ? (
            <ul className="gitlog-changes">
              {entry[`did_${language}`].map(item => (
                <li key={`+${item}`} className="is-added">
                  <span className="visually-hidden">{strings.did}: </span>
                  <bdi>{item}</bdi>
                </li>
              ))}
              {entry[`learned_${language}`].map(item => (
                <li key={`~${item}`} className="is-learned">
                  <span className="visually-hidden">{strings.learned}: </span>
                  <bdi>{item}</bdi>
                </li>
              ))}
            </ul>
          ) : null}
          {entry.tech?.length ? (
            <p className="gitlog-tech" dir="ltr">
              {entry.tech.map(item => (
                <span key={item}>{item}</span>
              ))}
            </p>
          ) : null}
          {project ? (
            <a className="gitlog-project" href={`#project/${encodeURIComponent(project.slug)}`}>
              &gt; {strings.seeProject}: <bdi>{project.title}</bdi>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function Experience() {
  const { content, language } = useLanguage();
  const { experience, projects } = useSiteContent();
  const strings = content.experience;
  const listRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());

  const { rows, laneCount } = useMemo(() => buildGitGraph(experience), [experience]);
  const projectsById = useMemo(() => new Map(projects.map(project => [project.id, project])), [projects]);

  // Draw the graph in once, the first time it scrolls into view.
  useEffect(() => {
    const node = listRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rows.length]);

  if (!rows.length) return null;

  const toggle = key =>
    setExpanded(current => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="gitlog-shell">
      <p className="system-kicker gitlog-kicker" dir="ltr">
        {strings.kicker}
      </p>
      <ol ref={listRef} className={`gitlog ${drawn ? 'is-drawn' : ''}`}>
        {rows.map((row, index) => (
          <li key={row.key} className={`gitlog-row is-${row.type}`} style={{ '--row': index }}>
            <GraphCell row={row} laneCount={laneCount} />
            <RowText
              row={row}
              strings={strings}
              language={language}
              projectsById={projectsById}
              expanded={expanded.has(row.key)}
              onToggle={() => toggle(row.key)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
