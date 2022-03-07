import { FlipOptions } from '.';
import Flip from '../../flip';
import createTempNode from '../../utils/createTempNode';
import { triggerEvent } from '../../utils/eventHandler';
import ClassName from '../../values/className';
import Event from '../../values/event';
import Slot from '../../values/slot';
import { CandidateInfo } from '../getCandidateInfo';
import { FlipAnimationOption } from './flipAnimation';

export interface FlipOneCandidateOptions extends Required<FlipOptions> {
  lastCandidateInfo: CandidateInfo;
  nextCandidateInfo: CandidateInfo;
}

/**
 * Flips card once.
 */
async function flipOneCandidate(
  this: Flip,
  options: FlipOneCandidateOptions,
): Promise<void> {
  const { nextCandidateInfo } = options;
  const {
    index: nextIndex,
  } = nextCandidateInfo;
  const tempCandidateNode = createTempNode({
    className: ClassName.temp,
    slot: Slot.temp,
  });
  const lastTempCard = this.querySelector(`.${ClassName.temp}`);

  if (lastTempCard) {
    lastTempCard.remove();
  }

  this.index = nextIndex;
  this.append(tempCandidateNode);

  const passFlipCardStartEvent = triggerEvent<FlipAnimationOption>(
    this,
    Event.flipCandidateStart,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        ...options,
        tempCandidateNode,
      },
    },
  );

  if (passFlipCardStartEvent) {
    await Flip.flipAnimation({
      ...options,
      tempCandidateNode,
    });
  }

  triggerEvent<FlipAnimationOption>(
    this,
    Event.flipCandidateEnd,
    {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        ...options,
        tempCandidateNode,
      },
    },
  );
  tempCandidateNode.remove();
}

export default flipOneCandidate;
