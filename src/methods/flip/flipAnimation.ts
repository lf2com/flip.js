import Flip from '../../flip';
import Direction from '../../values/direction';
import { FlipOneCandidateOptions } from './flipOneCandidate';
import flippingHorizontally from './horizontal';
import flippingVertically from './vertical';

export interface FlipAnimationOption extends Required<FlipOneCandidateOptions> {
  tempCandidateNode: HTMLElement;
}

/**
 * Does flipping animation from last candidate to next candidate.
 */
async function flipAnimation(
  this: Flip,
  options: FlipAnimationOption,
): Promise<void> {
  const { direction } = options;

  switch (direction) {
    default:
      throw new TypeError(`Invalid direction: ${direction}`);

    case Direction.up:
    case Direction.down:
      return flippingVertically.call(this, options);

    case Direction.right:
    case Direction.left:
      return flippingHorizontally.call(this, options);
  }
}

export default flipAnimation;
