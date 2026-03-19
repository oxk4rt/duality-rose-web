(function () {
  const draggables = document.querySelectorAll('.draggable');
  const dropZones = Array.from(document.querySelectorAll('.drop-zone'));
  const message = document.getElementById('minigame-message');
  const submitBtn = document.getElementById('submit-btn');

  // Aleatorizar orden
  function shuffle(parentSelector, childSelector) {
    const parent = document.querySelector(parentSelector);
    const children = Array.from(parent.querySelectorAll(childSelector));
    const shuffled = children.sort(() => Math.random() - 0.5);
    shuffled.forEach(el => parent.appendChild(el));
  }

  shuffle('#drag-items', '.draggable');
  shuffle('#drag-area', '.drop-zone');

  draggables.forEach(item => {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('symbol', item.dataset.symbol);
    });
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());

    zone.addEventListener('drop', e => {
      e.preventDefault();
      const droppedSymbol = e.dataTransfer.getData('symbol');
      const expectedSymbol = zone.dataset.symbol;

        if (droppedSymbol === expectedSymbol && !zone.classList.contains('filled')) {
            zone.classList.add('filled');
            zone.textContent = droppedSymbolToEmoji(droppedSymbol);
            const icon = document.querySelector(`.draggable[data-symbol="${droppedSymbol}"]`);
            icon.remove(); // O icon.style.opacity = '0.3';
            checkVictory();
        }
    });
  });

  function checkVictory() {
    if (dropZones.every(z => z.classList.contains('filled'))) {
      message.textContent = '✔ Minijuego resuelto. ¡Puedes conectar!';
      submitBtn.disabled = false;
    }
  }

    function droppedSymbolToEmoji(symbol) {
        switch (symbol) {
            case '♥️': return '♥️';
            case '♦️': return '♦️';
            case '♣️': return '♣️';
            case '♠️': return '♠️';
            default: return '?';
        }
    }

})();
