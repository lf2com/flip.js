import Flip from '../flip';
import Mode from '../values/mode';

export interface GetNextCardOptions {
  different?: boolean;
  mode?: Mode;
}

/**
 * Returns the index of next card.
 */
function getNextCardIndex(
  this: Flip,
  options: GetNextCardOptions = {},
): number {
  const {
    different = this.cardsCatch.length > 1,
    mode = this.mode,
  } = options;
  const { index, cardsCatch } = this;
  const { length } = cardsCatch;

  switch (mode) {
    default:
      throw new TypeError(`Invalid mode: ${mode}`);

    case Mode.loop: {
      const nextIndex = (index + 1) % length;

      return (nextIndex === index && different
        ? -1
        : nextIndex
      );
    }

    case Mode.random: {
      switch (length) {
        case 0:
          return -1;

        case 1:
          return different ? -1 : this.index;

        default: {
          let nextIndex = -1;

          while (
            nextIndex === -1
            || (nextIndex === index && different)
          ) {
            nextIndex = Math.floor(length * Math.random());
          }

          return nextIndex;
        }
      }
    }
  }
}

export default getNextCardIndex;
