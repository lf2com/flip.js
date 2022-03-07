import Flip from '../../flip';
import { triggerEvent } from '../../utils/eventHandler';
import Direction from '../../values/direction';
import Event from '../../values/event';
import { CandidateInfo } from '../getCandidateInfo';
import { GetNextCandidateOptions } from '../getNextCandidateIndex';
import flipOneCandidate from './flipOneCandidate';

export interface FlipOptions extends GetNextCandidateOptions {
  direct?: boolean;
  direction?: Direction;
  duration?: number;
}

export interface FlipDetail extends Required<FlipOptions> {
  lastCandidateInfo: CandidateInfo;
  targetCandidateInfo: CandidateInfo;
}

type FlipSource = number | string | HTMLElement | null;

/**
 * Flips to specific candidate/index.
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
    direct = false,
    different = this.candidatesCatch.length > 1,
    duration = this.duration,
    direction = this.direction,
  } = options;
  const targetSource = (arg0 === options || arg0 === undefined
    ? this.getNextCandidateIndex({ different, mode })
    : arg0
  ) as number;
  const targetCandidateInfo = this.getCandidateInfo(targetSource);
  const {
    index: targetIndex,
    node: targetNode,
  } = targetCandidateInfo;

  if (targetNode === null) {
    throw new ReferenceError(`Target candidate doesn't exist: ${targetSource}`);
  }

  const lastCandidateInfo = this.getCandidateInfo(this.index);
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
        lastCandidateInfo,
        targetCandidateInfo,
      },
    },
  );

  if (!passStartEvent) {
    return;
  }

  if (direct) {
    await flipOneCandidate.call(this, {
      mode,
      direct,
      different,
      duration,
      direction,
      lastCandidateInfo,
      nextCandidateInfo: targetCandidateInfo,
    });
  } else {
    const {
      minFlips,
      maxFlips,
    } = this;
    const flipNext = async (times = 1): Promise<void> => {
      const nextIndex = (times < maxFlips
        ? (
          this.getNextCandidateIndex({
            mode,
            different: times < minFlips,
          })
        )
        : targetIndex
      );
      const nextCandidateInfo = this.getCandidateInfo(nextIndex);
      const currentCandidateInfo = this.getCandidateInfo(this.index);

      await flipOneCandidate.call(this, {
        mode,
        direct,
        different,
        duration,
        direction,
        lastCandidateInfo: currentCandidateInfo,
        nextCandidateInfo,
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
        lastCandidateInfo,
        targetCandidateInfo,
      },
    },
  );
}

export default flip;
