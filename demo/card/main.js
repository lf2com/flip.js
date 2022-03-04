(() => {
  window.addEventListener('ready', () => {
    const domCard = document.getElementById('flip');

    async function flipCard() {
      await domCard.flip();
      flipCard();
    }

    flipCard();
  });
})();
