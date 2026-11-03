/**
 * Lays experience entries out as `git log --graph` rows, newest first.
 *
 * - The degree is `main` (lane 0): an initial commit at its start, a HEAD row at
 *   today, and a graduation tag at its end. Anything after today is "future" and is
 *   drawn dashed.
 * - Milestones are extra commits on main.
 * - Each role forks from main at its start date onto its own lane and merges back at
 *   its end date. Roles with no end (or an end still ahead) stay open to the top.
 *   Roles sharing a branch name are commits on one branch (a promotion, say).
 *   Lanes are reused once a branch has merged, so concurrent roles sit side by side.
 *
 * Every row says, per lane, whether a line runs above its node (`top`) and/or below
 * it (`bottom`), plus at most one curve between the node and a neighbouring lane.
 * The component turns that into fixed-height curves and stretchable straight lines,
 * so rows can expand without redrawing the graph.
 */

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Short, stable pseudo-hash (FNV-1a) so each row keeps the same "commit id". */
export function shortHash(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

const TYPE_ORDER = { tag: 0, milestone: 1, merge: 2, head: 3, commit: 4, branch: 5, root: 6 };

export function buildGitGraph(entries, today = todayIso()) {
  const degrees = entries.filter(entry => entry.kind === 'degree').sort((a, b) => a.start_date.localeCompare(b.start_date));
  const degree = degrees[0] || null;
  // Extra degree rows (unlikely) read as milestones on the same main line.
  const milestones = [...entries.filter(entry => entry.kind === 'milestone'), ...degrees.slice(1)];
  const roles = entries.filter(entry => entry.kind === 'role').sort((a, b) => a.start_date.localeCompare(b.start_date));

  // Roles that share a branch name are one branch with several commits (e.g. a
  // promotion within the same club): it forks at the first role's start, gets a
  // commit per later role, and merges at the last role's end.
  const branches = [];
  const branchByName = new Map();
  for (const role of roles) {
    const name = role.branch || role.id;
    if (!branchByName.has(name)) {
      const branch = { name, roles: [] };
      branchByName.set(name, branch);
      branches.push(branch);
    }
    branchByName.get(name).roles.push(role);
  }
  for (const branch of branches) {
    const last = branch.roles[branch.roles.length - 1];
    branch.id = branch.roles[0].id;
    branch.start = branch.roles[0].start_date;
    branch.end = last.end_date;
    branch.merged = Boolean(last.end_date && last.end_date <= today);
  }

  // Greedy lane assignment: the lowest lane whose previous branch merged before this
  // one starts. Open-ended branches hold their lane forever.
  const laneBusyUntil = [];
  const branchLane = new Map();
  for (const branch of branches) {
    let lane = 1;
    while (laneBusyUntil[lane] !== undefined && !(laneBusyUntil[lane] < branch.start)) lane += 1;
    laneBusyUntil[lane] = branch.merged ? branch.end : '9999-12-31';
    branchLane.set(branch.id, lane);
  }
  // laneBusyUntil is indexed by lane (starting at 1), so its length is the lane count.
  const laneCount = Math.max(1, laneBusyUntil.length);

  const events = [];
  if (degree) {
    if (degree.end_date) events.push({ type: 'tag', lane: 0, date: degree.end_date, entry: degree });
    events.push({ type: 'head', lane: 0, date: today, entry: degree });
    events.push({ type: 'root', lane: 0, date: degree.start_date, entry: degree });
  }
  for (const entry of milestones) events.push({ type: 'milestone', lane: 0, date: entry.start_date, entry });
  for (const branch of branches) {
    const lane = branchLane.get(branch.id);
    branch.roles.forEach((role, index) => {
      events.push({
        // The first role forks the branch; later ones are plain commits on it. Only
        // the newest commit carries the branch label, as `git log` shows it at the tip.
        type: index === 0 ? 'branch' : 'commit',
        lane,
        date: role.start_date,
        entry: role,
        isTip: index === branch.roles.length - 1
      });
    });
    if (branch.merged) {
      events.push({ type: 'merge', lane: 0, mergeLane: lane, date: branch.end, entry: branch.roles[branch.roles.length - 1], branchId: branch.id });
    }
  }

  events.sort((a, b) => b.date.localeCompare(a.date) || TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);

  const rows = events.map(event => ({
    ...event,
    key: `${event.type}-${event.entry.id}`,
    hash: shortHash(`${event.type}:${event.entry.id}`),
    future: event.date > today,
    lanes: Array.from({ length: laneCount }, () => ({
      top: false,
      bottom: false,
      bottomFromCurve: false,
      dashedTop: false,
      dashedBottom: false
    })),
    curve: null
  }));

  // main: from the first row down to the initial commit. Above HEAD it is the future.
  const rootIndex = rows.findIndex(row => row.type === 'root');
  const headIndex = rows.findIndex(row => row.type === 'head');
  const mainEnd = rootIndex === -1 ? rows.length - 1 : rootIndex;
  rows.forEach((row, index) => {
    if (index > mainEnd) return;
    const cell = row.lanes[0];
    cell.top = index > 0;
    cell.bottom = index < mainEnd;
    // Everything above HEAD has not happened yet.
    cell.dashedTop = headIndex !== -1 && index <= headIndex;
    cell.dashedBottom = headIndex !== -1 && index < headIndex;
  });

  // Branch lanes: from the merge row (or the very top) down to the branch's fork.
  for (const branch of branches) {
    const lane = branchLane.get(branch.id);
    const startIndex = rows.findIndex(row => row.type === 'branch' && row.entry.id === branch.id);
    const mergeIndex = rows.findIndex(row => row.type === 'merge' && row.branchId === branch.id);

    for (let index = mergeIndex === -1 ? 0 : mergeIndex + 1; index < startIndex; index += 1) {
      rows[index].lanes[lane].top = true;
      rows[index].lanes[lane].bottom = true;
    }
    if (mergeIndex !== -1) {
      rows[mergeIndex].lanes[lane].bottomFromCurve = true;
      rows[mergeIndex].curve = { from: 0, to: lane };
    }
    rows[startIndex].lanes[lane].top = startIndex > 0;
    rows[startIndex].curve = { from: lane, to: 0 };
  }

  return { rows, laneCount };
}
