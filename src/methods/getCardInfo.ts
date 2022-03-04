import Flip from '../flip';

export interface CardInfo {
  index: number;
  node: HTMLElement | null;
  value: string | null;
}

/**
 * Returns card info by reference.
 */
function getCardInfo(
  this: Flip,
  source: number | string | HTMLElement | null,
): CardInfo {
  // null
  if (source === null) {
    return {
      node: null,
      index: -1,
      value: null,
    };
  }

  // card node
  if (source instanceof HTMLElement) {
    const index = this.getCardIndex(source);
    const card = index === -1 ? null : source;

    return {
      node: card,
      index,
      value: Flip.getCardValue(card),
    };
  }

  // value
  if (typeof source === 'string') {
    const index = this.getCardIndex(source);
    const card = index === -1 ? null : this.getCardNode(index);

    return {
      node: card,
      index,
      value: Flip.getCardValue(card),
    };
  }

  // index
  const card = this.getCardNode(source);

  return {
    node: card,
    index: card === null ? -1 : source,
    value: Flip.getCardValue(card),
  };
}

export default getCardInfo;
