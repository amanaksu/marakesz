/* A rug may touch Assam, but it may never cover the square he occupies. */
(() => {
  const originalValidPlacements = validPlacements;

  validPlacements = function placementsExcludingAssam() {
    const { x, y } = S.assam;
    return originalValidPlacements().filter(([first, second]) =>
      !(first[0] === x && first[1] === y) &&
      !(second[0] === x && second[1] === y),
    );
  };

  const renderedGame = render;

  function clearPreview() {
    document.querySelectorAll('.rug-preview').forEach((preview) => preview.remove());
  }

  function drawPreview(pair) {
    clearPreview();
    const color = S.players[S.turn].color;
    pair.forEach(([x, y]) => {
      const cell = document.querySelectorAll('#board .cell')[y * 7 + x];
      if (!cell) return;
      const preview = document.createElement('span');
      preview.className = 'rug-preview';
      preview.style.setProperty('--preview-color', color);
      cell.append(preview);
    });
  }

  function addRugPreviews() {
    const pairs = validPlacements();
    const cells = [...document.querySelectorAll('#board .cell')];
    cells.forEach((cell, index) => {
      if (!cell.classList.contains('valid')) return;
      const x = index % 7;
      const y = Math.floor(index / 7);
      const pair = pairs.find(([first, second]) =>
        (first[0] === x && first[1] === y) || (second[0] === x && second[1] === y),
      );
      if (!pair) return;
      cell.addEventListener('pointerenter', () => drawPreview(pair));
      cell.addEventListener('pointerleave', clearPreview);
      cell.addEventListener('focus', () => drawPreview(pair));
      cell.addEventListener('blur', clearPreview);
    });
  }

  render = function renderWithRugPreviews() {
    renderedGame();
    if (S.phase === 'place') addRugPreviews();
  };
})();
