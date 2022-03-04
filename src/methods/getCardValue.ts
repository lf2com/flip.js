import Flip from '../flip';

/**
 * Returns card value by reference.
 */
function getCardValue(
  this: Flip,
  source: number | HTMLElement | null,
): string | null {
  // null
  if (source === null) {
    return null;
  }

  // card node
  if (source instanceof HTMLElement) {
    return Flip.getCardValue(source);
  }

  // index
  return Flip.getCardValue(this.cardsCatch[source]);
}

export default getCardValue;
