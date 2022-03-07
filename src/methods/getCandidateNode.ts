import Flip from '../flip';

/**
 * Returns card node by reference.
 */
function getCandidateNode(
  this: Flip,
  source: number | string | null,
): HTMLElement | null {
  // null
  if (source === null) {
    return null;
  }

  // value
  if (typeof source === 'string') {
    const cardResult = this.candidatesCatch.find((card) => (
      Flip.getCandidateValue(card) === source
    ));

    return cardResult ?? null;
  }

  // index
  return this.candidatesCatch[source] ?? null;
}

export default getCandidateNode;
