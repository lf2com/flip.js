(() => {
  const domCard = document.getElementById('flip');

  async function flipCard() {
    await domCard.flip();
    flipCard();
  }

  window.addEventListener('load', () => {
    flipCard();
  });
})();
