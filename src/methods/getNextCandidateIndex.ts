import Flip from '../flip';
import Mode from '../values/mode';

export interface GetNextCandidateOptions {
  mode?: Mode;
}

/**
 * Returns the index of next card.
 */
function getNextCandidateIndex(
  this: Flip,
  options: GetNextCandidateOptions = {},
): number {
  const {
    mode = this.mode,
  } = options;
  const { index, candidatesCatch } = this;
  const { length } = candidatesCatch;

  switch (mode) {
    default:
      throw new TypeError(`Invalid mode: ${mode}`);

    case Mode.loop:
      return (length > 0
        ? (index + 1) % length
        : -1
      );

    case Mode.random: {
      switch (length) {
        case 0:
          return -1;

        case 1:
          return this.index;

        default: {
          let nextIndex = index;

          while (nextIndex === index) {
            nextIndex = Math.floor(length * Math.random());
          }

          return nextIndex;
        }
      }
    }
  }
}

export default getNextCandidateIndex;
