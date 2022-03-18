import prefixCss from '../../../utils/prefixCss';
import Direction from '../../../values/direction';
import createTempNode from '../../../utils/createTempNode';
import { FlipAnimationOption } from '../flipAnimation';
import cloneNode from '../../../utils/cloneNode';
import Style from './style';

type StyleGetter = (options: FlipAnimationOption) => string;

const getBackgroundStyle: StyleGetter = () => (`
  :host {
    ${Style.upperYTop}: -100vh;
    ${Style.upperYBottom}: 50%;
    ${Style.lowerYTop}: 50%;
    ${Style.lowerYBottom}: calc(100% + 100vh);

    ${prefixCss(`clip-path: polygon(
      -100vw var(${Style.yTop}),
      calc(100% + 100vw) var(${Style.yTop}),
      calc(100% + 100vw) var(${Style.yBottom}),
      -100vw var(${Style.yBottom})
    );`, 'webkit')}
  }
`);

const getCandidateStyle: StyleGetter = (options) => (`
  ${prefixCss(`@keyframes flip {
    0% {
      ${prefixCss('transform: perspective(var(--vert-perspective)) rotateX(0);', 'webkit')}
    }
    100% {
      ${prefixCss('transform: perspective(var(--vert-perspective)) rotateX(var(--end-deg));', 'webkit')}
    }
  }`, 'webkit')}

  :host {
    --vert-perspective: ${options.perspective};
    --upper-y-top: -100vh;
    --upper-y-bottom: 50%;
    --lower-y-top: 50%;
    --lower-y-bottom: calc(100% + 100vh);
    --down-end-deg: -180deg;
    --up-end-deg: 180deg;

    ${prefixCss(`clip-path: polygon(
      -100vw var(--start-y-top),
      calc(100% + 100vw) var(--start-y-top),
      calc(100% + 100vw) var(--start-y-bottom),
      -100vw var(--start-y-bottom)
    );`, 'webkit')}
    ${prefixCss('animation: flip var(--duration) forwards linear;', 'webkit')}
  }
`);

const getNextCandidateStyle: StyleGetter = () => (`
  ${prefixCss(`@keyframes clip-next {
    0% { opacity: 0 }
    50%, 100% { opacity: 1 }
  }`, 'webkit')}

  :host {
    ${prefixCss('transform: rotateX(180deg);', 'webkit')}
    ${prefixCss('animation: clip-next var(--duration) forwards steps(1, end);', 'webkit')}
  }
`);

const getLastCandidateStyle: StyleGetter = () => (`
  ${prefixCss(`@keyframes clip-last {
    0% { opacity: 1 }
    50%, 100% { opacity: 0 }
  }`, 'webkit')}

  :host {
    ${prefixCss('animation: clip-last var(--duration) forwards steps(1, end);', 'webkit')}
  }
`);

/**
 * Flips candidate vertically.
 */
function flippingVertically(options: FlipAnimationOption): Promise<void> {
  const {
    duration,
    direction,
    lastCandidateInfo,
    nextCandidateInfo,
    tempCandidateNode,
  } = options;
  const {
    node: lastCandidateNode,
  } = lastCandidateInfo;
  const nextCandidateNode = nextCandidateInfo.node as HTMLElement;
  const durationSec = duration / 1000;
  const domCandidate = createTempNode({ style: getCandidateStyle(options) });
  const domNext = createTempNode({ style: getNextCandidateStyle(options) });
  const domNextCandidate = cloneNode(nextCandidateNode);

  switch (direction) {
    default:
    case Direction.down:
      domCandidate.style.setProperty('--start-y-top', 'var(--upper-y-top)');
      domCandidate.style.setProperty('--start-y-bottom', 'var(--upper-y-bottom)');
      domCandidate.style.setProperty('--end-y-top', 'var(--lower-y-top)');
      domCandidate.style.setProperty('--end-y-bottom', 'var(--lower-y-bottom)');
      domCandidate.style.setProperty('--end-deg', 'var(--down-end-deg)');
      break;

    case Direction.up:
      domCandidate.style.setProperty('--start-y-top', 'var(--lower-y-top)');
      domCandidate.style.setProperty('--start-y-bottom', 'var(--lower-y-bottom)');
      domCandidate.style.setProperty('--end-y-top', 'var(--upper-y-top)');
      domCandidate.style.setProperty('--end-y-bottom', 'var(--upper-y-bottom)');
      domCandidate.style.setProperty('--end-deg', 'var(--up-end-deg)');
      break;
  }

  domCandidate.style.setProperty('--duration', `${durationSec}s`);
  domNextCandidate.removeAttribute('slot');
  domNext.append(domNextCandidate);
  domCandidate.append(domNext);

  if (lastCandidateNode) {
    const domBackground = createTempNode({ style: getBackgroundStyle(options) });
    const domLast = createTempNode({ style: getLastCandidateStyle(options) });
    const domLastCandidate = cloneNode(lastCandidateNode);
    const domLastBackgroundCandidate = cloneNode(lastCandidateNode);

    switch (direction) {
      default:
      case Direction.down:
        domBackground.style.setProperty('--y-top', 'var(--lower-y-top)');
        domBackground.style.setProperty('--y-bottom', 'var(--lower-y-bottom)');
        break;

      case Direction.up:
        domBackground.style.setProperty('--y-top', 'var(--upper-y-top)');
        domBackground.style.setProperty('--y-bottom', 'var(--upper-y-bottom)');
        break;
    }

    domLastCandidate.removeAttribute('slot');
    domLast.append(domLastCandidate);
    domCandidate.append(domLast);
    domLastBackgroundCandidate.removeAttribute('slot');
    domBackground.append(domLastBackgroundCandidate);
    tempCandidateNode.append(domBackground);
  }

  return new Promise((resolve) => {
    tempCandidateNode.addEventListener(
      'animationend',
      () => {
        resolve(undefined);
      },
      { once: true },
    );
    tempCandidateNode.append(domCandidate);
  });
}

export default flippingVertically;
