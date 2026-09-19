/* Place a rug in two deliberate clicks: an Assam-adjacent first half, then its mate. */
(() => {
  const N = 7;
  const orthogonal = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const priorRender = render;

  const inBoard = (x, y) => x >= 0 && x < N && y >= 0 && y < N;
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const adjacentToAssam = ([x, y]) => Math.abs(x - S.assam.x) + Math.abs(y - S.assam.y) === 1;

  function canCover(first, second) {
    if (!inBoard(...first) || !inBoard(...second) || same(first, [S.assam.x, S.assam.y]) || same(second, [S.assam.x, S.assam.y])) return false;
    const firstTop = S.board[first[1]][first[0]];
    const secondTop = S.board[second[1]][second[0]];
    // A single new rug cannot completely cover one opponent rug.
    return !(firstTop !== null && firstTop === secondTop && firstTop !== S.turn);
  }

  function firstChoices() {
    return orthogonal
      .map(([dx, dy]) => [S.assam.x + dx, S.assam.y + dy])
      .filter((first) => inBoard(...first) && orthogonal.some(([dx, dy]) => canCover(first, [first[0] + dx, first[1] + dy])));
  }

  function secondChoices(first) {
    return orthogonal
      .map(([dx, dy]) => [first[0] + dx, first[1] + dy])
      .filter((second) => canCover(first, second));
  }

  function cells() { return [...document.querySelectorAll('#board .cell')]; }
  function cellAt([x, y]) { return cells()[y * N + x]; }
  function clearPreview() { document.querySelectorAll('.rug-preview').forEach((node) => node.remove()); }

  function preview(first, second) {
    clearPreview();
    [first, second].forEach((square) => {
      const node = document.createElement('span');
      node.className = 'rug-preview';
      node.style.setProperty('--preview-color', S.players[S.turn].color);
      cellAt(square)?.append(node);
    });
  }

  function freshCells() {
    cells().forEach((cell) => cell.replaceWith(cell.cloneNode(true)));
  }

  function setHint(text) {
    const status = document.querySelector('#actions .status');
    if (status) status.textContent = text;
  }

  function configurePlacement() {
    freshCells(); // Remove the previous single-click handlers and hover listeners.
    const first = S.placementStart;
    if (!first) {
      firstChoices().forEach((square) => {
        const cell = cellAt(square);
        cell.classList.add('valid', 'first-choice');
        cell.onclick = () => { S.placementStart = square; render(); };
      });
      setHint('첫 번째 카펫 칸을 선택하세요. 아삼과 변을 맞댄 칸만 선택할 수 있습니다.');
      return;
    }

    const firstCell = cellAt(first);
    firstCell.classList.add('placement-first');
    firstCell.onclick = () => { S.placementStart = null; render(); };
    secondChoices(first).forEach((second) => {
      const cell = cellAt(second);
      cell.classList.add('valid', 'second-choice');
      cell.onclick = () => { S.placementStart = null; place(first, second); };
      cell.addEventListener('pointerenter', () => preview(first, second));
      cell.addEventListener('pointerleave', clearPreview);
    });
    setHint('두 번째 카펫 칸을 선택하세요. 표시된 칸만 규칙에 맞는 배치입니다.');
  }

  render = function renderWithTwoStepPlacement() {
    priorRender();
    if (S.phase === 'place') configurePlacement();
    else S.placementStart = null;
  };
})();
