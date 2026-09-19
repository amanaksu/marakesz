/* Visual guide for the same edge-turn rules used by step() in game.js. */
(() => {
  const originalRender = render;
  const N = 7;

  // When Assam would leave the market, he takes the perimeter U-turn into
  // the next lane. The turn itself does not consume a movement point.
  step = function uTurnAtBoardEdge() {
    const { x, y, dir } = S.assam;
    const [dx, dy] = DIRS[dir];
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < N && ny >= 0 && ny < N) return { x: nx, y: ny, dir };

    if (dir === 0) return { x, y: 1, dir: 2 };
    if (dir === 2) return { x, y: N - 2, dir: 0 };
    if (dir === 1) return { x: N - 2, y, dir: 3 };
    return { x: 1, y, dir: 1 };
  };

  function addGuide(cell, side, arrow) {
    const mark = document.createElement('span');
    mark.className = `turn-guide ${side}`;
    mark.textContent = arrow;
    mark.setAttribute('aria-hidden', 'true');
    const board = cell.parentElement;
    const cellIndex = [...board.children].indexOf(cell);
    const lane = side === 'top' || side === 'bottom' ? cellIndex % N : Math.floor(cellIndex / N);
    mark.style.setProperty('--lane', lane);
    board.append(mark);
  }

  function drawEdgeTurnGuides() {
    const cells = [...document.querySelectorAll('#board .cell')];
    if (cells.length !== N * N) return;
    const cellAt = (x, y) => cells[y * N + x];

    for (let x = 0; x < N; x++) {
      addGuide(cellAt(x, 0), 'top', '↓');
      addGuide(cellAt(x, N - 1), 'bottom', '↑');
    }
    for (let y = 0; y < N; y++) {
      addGuide(cellAt(0, y), 'left', '→');
      addGuide(cellAt(N - 1, y), 'right', '←');
    }
  }

  render = function renderWithEdgeTurnGuides() {
    originalRender();
    drawEdgeTurnGuides();
  };
})();
