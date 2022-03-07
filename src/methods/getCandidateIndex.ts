import Flip from '../flip';

/**
 * Returns card index by reference.
 */
function getCandidateIndex(
  this: Flip,
  source: string | HTMLElement | null,
): number {
  // null
  if (source === null) {
    return -1;
  }

  const { candidatesCatch: cardsCatch } = this;

  // card node
  if (source instanceof HTMLElement) {
    return cardsCatch.indexOf(source);
  }

  // value
  return cardsCatch.findIndex((card) => (
    Flip.getCandidateValue(card) === source
  ));
}

export default getCandidateIndex;
