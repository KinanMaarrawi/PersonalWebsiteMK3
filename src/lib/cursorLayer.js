/**
 * The custom cursor lives in the browser's top layer (as a manual popover) so it can
 * sit above modal dialogs, which no z-index can beat. The top layer stacks in the
 * order things entered it, so after a dialog opens the cursor has to re-enter to be
 * on top again — that is all raiseCursor() does.
 */
const cursorNode = () => document.querySelector('.app-cursor');

export function enterTopLayer(node) {
  if (!node || typeof node.showPopover !== 'function') return;
  try {
    if (!node.matches(':popover-open')) node.showPopover();
  } catch {
    // Not connected yet, or popovers unsupported: fall back to z-index.
  }
}

export function raiseCursor() {
  const node = cursorNode();
  if (!node || typeof node.showPopover !== 'function') return;
  try {
    if (node.matches(':popover-open')) node.hidePopover();
    node.showPopover();
  } catch {
    // Ignore; the cursor just stays where it was.
  }
}
