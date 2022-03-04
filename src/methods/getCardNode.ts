import Flip from '../flip';

/**
 * Returns card node by reference.
 */
function getCardNode(
  this: Flip,
  source: number | string | null,
): HTMLElement | null {
  // null
  if (source === null) {
    return null;
  }

  // value
  if (typeof source === 'string') {
    const cardResult = this.cardsCatch.find((card) => (
      Flip.getCardValue(card) === source
    ));

    return cardResult ?? null;
  }

  // index
  return this.cardsCatch[source] ?? null;
}

export default getCardNode;
