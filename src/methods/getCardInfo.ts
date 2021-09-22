import Flip from '../flip';

interface CardInfo {
  index: number;
  card: HTMLElement | null;
}

/**
 * Returns card info with index and card element.
 */
function getCardInfo(
  this: Flip,
  source: number | HTMLElement | null,
): CardInfo {
  if (source instanceof HTMLElement) {
    const index = this.getIndexByCard(source);

    return {
      index,
      card: index >= 0 ? source : null,
    };
  }
  if (source === null) {
    return {
      index: -1,
      card: null,
    };
  }

  const card = this.getCardByIndex(source);

  return {
    card,
    index: card === null ? -1 : source,
  };
}

export default getCardInfo;
