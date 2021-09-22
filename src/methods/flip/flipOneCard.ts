import { FlipOptions } from '.';
import Flip from '../..';
import createTempCard from '../../utils/createTempCard';
import { triggerEvent } from '../../utils/eventHandler';
import ClassNames from '../../values/classNames';
import Events from '../../values/events';
import Slots from '../../values/slots';
import flipAnimation, { FlipAnimationOption } from './flipAnimation';

export interface FlipOneCardOptions extends Required<FlipOptions> {
  lastIndex: number;
  lastCard: HTMLElement | null;
  nextIndex: number;
  nextCard: HTMLElement;
}

async function flipOneCard(
  this: Flip,
  options: FlipOneCardOptions,
): Promise<void> {
  const { nextIndex } = options;
  const tempCard = await createTempCard({
    className: ClassNames.temp,
    slot: Slots.temp,
  });
  const lastTempCard = this.querySelector(`.${ClassNames.temp}`);

  if (lastTempCard) {
    lastTempCard.remove();
  }

  this.index = nextIndex;
  this.append(tempCard);

  const cardStartEventPassed = triggerEvent<FlipAnimationOption>(
    this,
    Events.flipCardStart,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        ...options,
        tempCard,
      },
    },
  );

  if (cardStartEventPassed) {
    await flipAnimation.call(this, {
      ...options,
      tempCard,
    });
  }

  triggerEvent<FlipAnimationOption>(
    this,
    Events.flipCardEnd,
    {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        ...options,
        tempCard,
      },
    },
  );
  tempCard.remove();
}

export default flipOneCard;
