import Flip from '../../flip';
import Direction from '../../values/direction';
import { FlipOneCardOptions } from './flipOneCard';
import flippingHorizontally from './horizontal';
import flippingVertically from './vertical';

export interface FlipAnimationOption extends Required<FlipOneCardOptions> {
  tempCardNode: HTMLElement;
}

/**
 * Does flipping animation from last card to next card.
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
