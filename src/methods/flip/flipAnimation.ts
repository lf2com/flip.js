import Flip from '../../flip';
import Directions from '../../values/directions';
import { FlipOneCardOptions } from './flipOneCard';
import flippingHorizontally from './horizontal';
import flippingVertically from './vertical';

export interface FlipAnimationOption extends FlipOneCardOptions {
  tempCard: HTMLElement;
}

/**
 * Does flipping animation from last card to next card.
 */
async function flipAnimation(
  this: Flip,
  options: FlipAnimationOption,
): Promise<void> {
  switch (options.direction) {
    default:
      return flippingVertically.call(this, {
        ...options,
        direction: Directions.down,
      });

    case Directions.up:
    case Directions.down:
      return flippingVertically.call(this, options);

    case Directions.right:
    case Directions.left:
      return flippingHorizontally.call(this, options);
  }
}

export default flipAnimation;
