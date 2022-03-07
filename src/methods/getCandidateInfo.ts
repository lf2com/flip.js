import Flip from '../flip';

export interface CandidateInfo {
  index: number;
  node: HTMLElement | null;
  value: string | null;
}

/**
 * Returns card info by reference.
 */
function getCandidateInfo(
  this: Flip,
  source: number | string | HTMLElement | null,
): CandidateInfo {
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
    const index = this.getCandidateIndex(source);
    const card = index === -1 ? null : source;

    return {
      node: card,
      index,
      value: Flip.getCandidateValue(card),
    };
  }

  // value
  if (typeof source === 'string') {
    const index = this.getCandidateIndex(source);
    const card = index === -1 ? null : this.getCandidateNode(index);

    return {
      node: card,
      index,
      value: Flip.getCandidateValue(card),
    };
  }

  // index
  const card = this.getCandidateNode(source);

  return {
    node: card,
    index: card === null ? -1 : source,
    value: Flip.getCandidateValue(card),
  };
}

export default getCandidateInfo;
