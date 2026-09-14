(() => {
  const cards = [...document.querySelectorAll('.grid > .card')];
  const sizes = ['tile-lead', 'tile-compact', 'tile-wide', 'tile-half', 'tile-standard', 'tile-only'];
  function arrangeTiles() {
    cards.forEach(card => card.classList.remove(...sizes));
    const visible = cards.filter(card => !card.hidden);
    const assign = (index, size) => visible[index].classList.add(size);
    let index = 0;
    if (visible.length === 1) { assign(0, 'tile-only'); return; }
    if (visible.length === 3 || visible.length >= 5) {
      assign(0, 'tile-lead');
      assign(1, 'tile-compact');
      assign(2, 'tile-compact');
      index = 3;
    }
    const pairs = [['tile-wide', 'tile-standard'], ['tile-half', 'tile-half'], ['tile-standard', 'tile-wide']];
    let pair = 0;
    while (index < visible.length) {
      if (visible.length - index === 3) {
        while (index < visible.length) assign(index++, 'tile-standard');
      } else {
        for (const size of pairs[pair++ % pairs.length]) {
          if (index < visible.length) assign(index++, size);
        }
      }
    }
  }
  // The existing inline genre filter runs first, then the visible tiles are arranged.
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', arrangeTiles));
  arrangeTiles();
})();
