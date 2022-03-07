import Flip from '../flip';

/**
 * Returns card value by reference.
 */
function getCandidateValue(
  this: Flip,
  source: number | HTMLElement | null,
): string | null {
  // null
  if (source === null) {
    return null;
  }

  // card node
  if (source instanceof HTMLElement) {
    return Flip.getCandidateValue(source);
  }

  // index
  return Flip.getCandidateValue(this.candidatesCatch[source]);
}

export default getCandidateValue;
