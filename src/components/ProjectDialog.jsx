import { useLayoutEffect, useRef } from 'react';
import { ProjectDetails } from './ProjectDetails.jsx';
import { raiseCursor } from '../lib/cursorLayer.js';

/**
 * Modal popup for one project, built on a native <dialog>: showModal() gives focus
 * containment, Escape, an inert page behind it and focus return for free. Opening
 * and closing go through `onClose` so the URL hash and the card-to-popup morph stay
 * in charge (see Projects.jsx).
 */
export function ProjectDialog({ project, language, direction, strings, onClose }) {
  const dialogRef = useRef(null);

  // Layout effect, not a passive one: the morph snapshots the DOM straight after the
  // state change, so the dialog must already be open (or closed) by then.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      // The dialog just entered the top layer above the cursor; put the cursor back on top.
      raiseCursor();
    }
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const onCancel = event => {
    // Escape: route through onClose so history and the animation stay in step.
    event.preventDefault();
    onClose();
  };

  const onBackdropClick = event => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      // The projects section pins itself to ltr for the grid; the popup reads in the
      // page's language.
      dir={direction}
      aria-labelledby="project-dialog-title"
      onCancel={onCancel}
      onClick={onBackdropClick}
    >
      {project ? (
        <div className="project-dialog-panel">
          <button type="button" className="project-dialog-close" onClick={onClose} aria-label={strings.closeLabel}>
            [{strings.close}]
          </button>
          <ProjectDetails project={project} language={language} strings={strings} titleId="project-dialog-title" />
        </div>
      ) : null}
    </dialog>
  );
}
