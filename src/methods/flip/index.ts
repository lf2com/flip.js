import Flip from '../../flip';
import { triggerEvent } from '../../utils/eventHandler';
import Directions from '../../values/directions';
import Events from '../../values/events';
import Modes from '../../values/modes';
import flipOneCard from './flipOneCard';

export interface FlipOptions {
  direct?: boolean;
  direction?: Directions;
  duration?: number;
}

export interface FlipDetail extends Required<FlipOptions> {
  lastIndex: number;
  lastCard: HTMLElement | null;
  targetIndex: number;
  targetCard: HTMLElement;
}

/**
 * Flips to specific card/index.
 */
async function flip(
  this: Flip,
  next: number | HTMLElement | null,
  options: FlipOptions = {},
): Promise<void> {
  const {
    card: nextCard,
    index: nextIndex,
  } = this.getCardInfo(
    next
    ?? this.getNextIndex({
      different: this.cards.length > 1,
    }),
  );

  if (nextCard === null) {
    if (next === undefined) {
      return;
    }

    throw new ReferenceError('Target card doesn\'t exist');
  }

  const {
    index: lastIndex,
    card: lastCard,
  } = this;
  const {
    direct = false,
    duration = this.duration,
    direction = this.direction,
  } = options;
  const startEventPassed = triggerEvent<FlipDetail>(
    this,
    Events.flipStart,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        direct,
        duration,
        direction,
        lastIndex,
        lastCard,
        targetIndex: nextIndex,
        targetCard: nextCard,
      },
    },
  );

  if (!startEventPassed) {
    return;
  }

  if (direct) {
    await flipOneCard.call(this, {
      direct,
      duration,
      direction,
      lastIndex,
      lastCard,
      nextIndex,
      nextCard,
    });
  } else {
    const {
      mode,
      cards,
      minFlips,
      maxFlips,
    } = this;
    const cardsLength = cards.length;
    const getNextIndex = (times: number) => {
      switch (mode) {
        default:
        case Modes.loop:
          return this.getNextIndex() as number;

        case Modes.random: {
          if (times < maxFlips) {
            let index = this.getNextIndex() as number;

            while (cardsLength > 2
              && (times < minFlips && index === nextIndex)
            ) {
              index = this.getNextIndex() as number;
            }

            return index;
          }

          return nextIndex;
        }
      }
    };
    const flipNext = async (
      prevIndex: number,
      prevCard: HTMLElement | null,
      times = 1,
    ): Promise<void> => {
      const targetIndex = getNextIndex(times);
      const targetCard = this.getCardByIndex(targetIndex) as HTMLElement;

      await flipOneCard.call(this, {
        direct,
        duration,
        direction,
        lastIndex: prevIndex,
        lastCard: prevCard,
        nextIndex: targetIndex,
        nextCard: targetCard,
      });

      if (targetIndex !== nextIndex) {
        await flipNext(targetIndex, targetCard, times + 1);
      }
    };

    await flipNext(lastIndex, lastCard);
  }

  triggerEvent<FlipDetail>(
    this,
    Events.flipEnd,
    {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        direct,
        duration,
        direction,
        lastIndex,
        lastCard,
        targetIndex: nextIndex,
        targetCard: nextCard,
      },
    },
  );
}

export default flip;
