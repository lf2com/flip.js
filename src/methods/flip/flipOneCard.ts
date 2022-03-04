import { FlipOptions } from '.';
import Flip from '../../flip';
import createTempNode from '../../utils/createTempNode';
import { triggerEvent } from '../../utils/eventHandler';
import ClassName from '../../values/className';
import Event from '../../values/event';
import Slot from '../../values/slot';
import { CardInfo } from '../getCardInfo';
import { FlipAnimationOption } from './flipAnimation';

export interface FlipOneCardOptions extends Required<FlipOptions> {
  lastCardInfo: CardInfo;
  nextCardInfo: CardInfo;
}

/**
 * Flips card once.
 */
async function flipOneCard(
  this: Flip,
  options: FlipOneCardOptions,
): Promise<void> {
  const { nextCardInfo } = options;
  const {
    index: nextIndex,
  } = nextCardInfo;
  const tempCardNode = createTempNode({
    className: ClassName.temp,
    slot: Slot.temp,
  });
  const lastTempCard = this.querySelector(`.${ClassName.temp}`);

  if (lastTempCard) {
    lastTempCard.remove();
  }

  this.index = nextIndex;
  this.append(tempCardNode);

  const passFlipCardStartEvent = triggerEvent<FlipAnimationOption>(
    this,
    Event.flipCardStart,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        ...options,
        tempCardNode,
      },
    },
  );

  if (passFlipCardStartEvent) {
    await this.flipAnimation({
      ...options,
      tempCardNode,
    });
  }

  triggerEvent<FlipAnimationOption>(
    this,
    Event.flipCardEnd,
    {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        ...options,
        tempCardNode,
      },
    },
  );
  tempCardNode.remove();
}

export default flipOneCard;
