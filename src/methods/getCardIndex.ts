import Flip from '../flip';

/**
 * Returns card index by reference.
 */
function getCardIndex(
  this: Flip,
  source: string | HTMLElement | null,
): number {
  // null
  if (source === null) {
    return -1;
  }

  const { cardsCatch } = this;

  // card node
  if (source instanceof HTMLElement) {
    return cardsCatch.indexOf(source);
  }

  // value
  return cardsCatch.findIndex((card) => (
    Flip.getCardValue(card) === source
  ));
}

export default getCardIndex;
