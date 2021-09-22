import Flip from '../flip';
import Modes from '../values/modes';

interface GetNextCardOptions {
  different?: boolean;
  mode?: Modes;
}

/**
 * Returns the next card index.
 */
function getNextIndex(
  this: Flip,
  options: GetNextCardOptions = {},
): number | null {
  const {
    different = true,
    mode = this.mode,
  } = options;
  const { index, cards } = this;
  const { length } = cards;

  switch (mode) {
    default:
    case Modes.loop: {
      const nextIndex = (index + 1) % length;

      return (different && nextIndex === index
        ? null
        : nextIndex
      );
    }

    case Modes.random:
      switch (length) {
        case 0:
          return null;

        case 1:
          return different ? null : this.index;

        default: {
          let nextIndex = -1;

          while (nextIndex === -1 || (different && nextIndex === index)) {
            nextIndex = Math.floor(length * Math.random());
          }

          return nextIndex;
        }
      }
  }
}

export default getNextIndex;
