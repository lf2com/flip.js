/**
 * Returns cloned card element.
 *
 * TODO: clone style?
 */
function cloneCard(card: HTMLElement): HTMLElement {
  const newCard = card.cloneNode(true) as HTMLElement;

  { // case of canvas
    const newCardCanvases = Array.from(newCard.querySelectorAll('canvas'));

    if (newCard instanceof HTMLCanvasElement) {
      newCardCanvases.push(newCard);
    }
    if (newCardCanvases.length > 0) {
      card.querySelectorAll('canvas').forEach((dom, domIndex) => {
        const cardCanvas = dom as HTMLCanvasElement;
        const newCanvas = newCardCanvases[domIndex] as HTMLCanvasElement;

        newCanvas.width = cardCanvas.width;
        newCanvas.height = cardCanvas.height;
        newCanvas.getContext('2d')?.drawImage(cardCanvas, 0, 0);
      });
    }
  }

  return newCard;
}

export default cloneCard;
