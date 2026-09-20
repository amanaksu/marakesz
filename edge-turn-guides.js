/* Visual guide for the edge-turn rule that lives in step() in game.js: at each
   border, two adjacent lanes are bridged by a single arch (A1<->B1, A1<->A2,
   etc.) and one lane per edge self-loops (G1, A7, A7, G1). This file only
   draws that mosaic - it does not redefine step() itself, so the picture can
   never drift out of sync with how Assam actually moves. */
(() => {
  const originalRender = render;
  const N = 7;

  // Same pairing tables as game.js's step(), used here only to decide how
  // wide each arch badge should be and where it should sit.
  const TOP_PAIR = [1, 0, 3, 2, 5, 4, 6], LEFT_PAIR = [1, 0, 3, 2, 5, 4, 6];
  const BOTTOM_PAIR = [0, 2, 1, 4, 3, 6, 5], RIGHT_PAIR = [0, 2, 1, 4, 3, 6, 5];

  // At a self-loop corner (a single-lane group) Assam doesn't bounce back into the
  // grid - he turns 90deg and continues along the border he just reached. That's a
  // different arrow direction than the side's normal swap arrow, so each self-loop
  // group gets its own rotation instead of the side's CSS default.
  const SELF_ROTATION = { top: '90deg', right: '0deg', bottom: '270deg', left: '180deg' };

  // Collapse a pairing table into the 4 groups it represents per edge:
  // three 2-lane bridges and one 1-lane self-loop.
  function groupsOf(pairTable) {
    const groups = [];
    for (let i = 0; i < N; i++) {
      const j = pairTable[i];
      if (j === i) groups.push([i]);
      else if (j > i) groups.push([i, j]);
    }
    return groups;
  }

  function addGuide(side, group) {
    const mark = document.createElement('span');
    mark.className = `turn-guide ${side}`;
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = '<span class="arch"></span><span class="arrow"></span>';
    const lo = group[0], hi = group[group.length - 1];
    const centerPct = ((lo + hi + 1) / 2) / N * 100;
    const spanPct = (group.length > 1 ? 1.7 : 0.7) / N * 100;
    if (side === 'top' || side === 'bottom') {
      mark.style.left = `${centerPct}%`;
      mark.style.width = `${spanPct}%`;
    } else {
      mark.style.top = `${centerPct}%`;
      mark.style.height = `${spanPct}%`;
    }
    if (group.length === 1) mark.style.setProperty('--rot', SELF_ROTATION[side]);
    document.getElementById('board').append(mark);
  }

  function drawEdgeTurnGuides() {
    const cells = document.querySelectorAll('#board .cell');
    if (cells.length !== N * N) return;

    // Each badge's arrow (set by side in CSS) shows the direction Assam heads
    // in after the about-turn on that edge: top→down, bottom→up, left→right, right→left.
    groupsOf(TOP_PAIR).forEach((g) => addGuide('top', g));
    groupsOf(BOTTOM_PAIR).forEach((g) => addGuide('bottom', g));
    groupsOf(LEFT_PAIR).forEach((g) => addGuide('left', g));
    groupsOf(RIGHT_PAIR).forEach((g) => addGuide('right', g));
  }

  render = function renderWithEdgeTurnGuides() {
    originalRender();
    drawEdgeTurnGuides();
  };
})();
