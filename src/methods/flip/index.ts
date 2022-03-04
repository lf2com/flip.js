import Flip from '../../flip';
import { triggerEvent } from '../../utils/eventHandler';
import Direction from '../../values/direction';
import Event from '../../values/event';
import { CardInfo } from '../getCardInfo';
import { GetNextCardOptions } from '../getNextCardIndex';
import flipOneCard from './flipOneCard';

export interface FlipOptions extends GetNextCardOptions {
  direct?: boolean;
  direction?: Direction;
  duration?: number;
}

export interface FlipDetail extends Required<FlipOptions> {
  lastCardInfo: CardInfo;
  targetCardInfo: CardInfo;
}

type FlipSource = number | string | HTMLElement | null;

/**
 * Flips to specific card/index.
 */
async function flip<
  A0 extends FlipSource | FlipOptions,
  A1 extends A0 extends FlipOptions ? never : FlipOptions,
>(
  this: Flip,
  arg0?: A0,
  arg1?: A1,
): Promise<void> {
  const options: FlipOptions = (typeof arg0 === 'object' && !(arg0 instanceof HTMLElement)
    ? arg0
    : arg1
  ) ?? {};
  const {
    mode = this.mode,
    different = this.cardsCatch.length > 1,
    direct = this.direct,
    duration = this.duration,
    direction = this.direction,
  } = options;
  const targetSource = (arg0 === options || arg0 === undefined
    ? this.getNextCardIndex({ different, mode })
    : arg0
  ) as number;
  const targetCardInfo = this.getCardInfo(targetSource);
  const {
    index: targetIndex,
    node: targetNode,
  } = targetCardInfo;

  if (targetNode === null) {
    throw new ReferenceError(`Target card doesn't exist: ${targetSource}`);
  }

  const lastCardInfo = this.getCardInfo(this.index);
  const passStartEvent = triggerEvent<FlipDetail>(
    this,
    Event.flipStart,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        mode,
        direct,
        different,
        duration,
        direction,
        lastCardInfo,
        targetCardInfo,
      },
    },
  );

  if (!passStartEvent) {
    return;
  }

  if (direct) {
    await flipOneCard.call(this, {
      mode,
      direct,
      different,
      duration,
      direction,
      lastCardInfo,
      nextCardInfo: targetCardInfo,
    });
  } else {
    const {
      minFlips,
      maxFlips,
    } = this;
    const flipNext = async (times = 1): Promise<void> => {
      const nextIndex = (times < maxFlips
        ? (
          this.getNextCardIndex({
            mode,
            different: times < minFlips,
          })
        )
        : targetIndex
      );
      const nextCardInfo = this.getCardInfo(nextIndex);
      const currentCardInfo = this.getCardInfo(this.index);

      await flipOneCard.call(this, {
        mode,
        direct,
        different,
        duration,
        direction,
        lastCardInfo: currentCardInfo,
        nextCardInfo,
      });

      if (nextIndex !== targetIndex) {
        await flipNext(times + 1);
      }
    };

    await flipNext();
  }

  triggerEvent<FlipDetail>(
    this,
    Event.flipEnd,
    {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        mode,
        direct,
        different,
        duration,
        direction,
        lastCardInfo,
        targetCardInfo,
      },
    },
  );
}

export default flip;
