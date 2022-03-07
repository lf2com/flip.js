import Flip from '../../flip';
import cloneNode from '../../utils/cloneNode';
import createTempNode from '../../utils/createTempNode';
import prefixCss from '../../utils/prefixCss';
import Direction from '../../values/direction';
import { FlipAnimationOption } from './flipAnimation';

type StyleGetter = (flip: Flip) => string;

const getBackgroundStyle: StyleGetter = () => (`
  :host {
    --right-x-left: 50%;
    --right-x-right: 100vw;
    --left-x-left: -100vw;
    --left-x-right: 50%;

    ${prefixCss(`clip-path: polygon(
      var(--x-left) -100vh,
      var(--x-right) -100vh,
      var(--x-right) calc(100% + 100vh),
      var(--x-left) calc(100% + 100vh)
    );`, 'webkit')}
  }
`);

const getCandidateStyle: StyleGetter = (flip) => (`
  ${prefixCss(`@keyframes flip {
    0% {
      ${prefixCss('transform: perspective(var(--hori-perspective)) rotateY(0);', 'webkit')}
    }
    100% {
      ${prefixCss('transform: perspective(var(--hori-perspective)) rotateY(var(--end-deg));', 'webkit')}
    }
  }`, 'webkit')}

  :host {
    --hori-perspective: ${flip.perspective};
    --right-x-left: 50%;
    --right-x-right: calc(100% + 100vw);
    --left-x-left: -100vw;
    --left-x-right: 50%;
    --left-end-deg: -180deg;
    --right-end-deg: 180deg;

    ${prefixCss(`clip-path: polygon(
      var(--start-x-left) -100vh,
      var(--start-x-right) -100vh,
      var(--start-x-right) calc(100% + 100vh),
      var(--start-x-left) calc(100% + 100vh)
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
    ${prefixCss('transform: rotateY(180deg);', 'webkit')}
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
 * Flips candidate horizontally.
 */
function flippingHorizontally(
  this: Flip,
  options: FlipAnimationOption,
): Promise<void> {
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
  const domCandidate = createTempNode({ style: getCandidateStyle(this) });
  const domNext = createTempNode({ style: getNextCandidateStyle(this) });
  const domNextCandidate = cloneNode(nextCandidateNode);

  switch (direction) {
    default:
    case Direction.left:
      domCandidate.style.setProperty('--start-x-left', 'var(--right-x-left)');
      domCandidate.style.setProperty('--start-x-right', 'var(--right-x-right)');
      domCandidate.style.setProperty('--end-x-left', 'var(--left-x-left)');
      domCandidate.style.setProperty('--end-x-right', 'var(--left-x-right)');
      domCandidate.style.setProperty('--end-deg', 'var(--left-end-deg)');
      break;

    case Direction.right:
      domCandidate.style.setProperty('--start-x-left', 'var(--left-x-left)');
      domCandidate.style.setProperty('--start-x-right', 'var(--left-x-right)');
      domCandidate.style.setProperty('--end-x-left', 'var(--right-x-left)');
      domCandidate.style.setProperty('--end-x-right', 'var(--right-x-right)');
      domCandidate.style.setProperty('--end-deg', 'var(--right-end-deg)');
      break;
  }

  domCandidate.style.setProperty('--duration', `${durationSec}s`);
  domNextCandidate.removeAttribute('slot');
  domNext.append(domNextCandidate);
  domCandidate.append(domNext);

  if (lastCandidateNode) {
    const domBackground = createTempNode({ style: getBackgroundStyle(this) });
    const domLast = createTempNode({ style: getLastCandidateStyle(this) });
    const domLastCandidate = cloneNode(lastCandidateNode);
    const domLastBackgroundCandidate = cloneNode(lastCandidateNode);

    switch (direction) {
      default:
      case Direction.left:
        domBackground.style.setProperty('--x-left', 'var(--left-x-left)');
        domBackground.style.setProperty('--x-right', 'var(--left-x-right)');
        break;

      case Direction.right:
        domBackground.style.setProperty('--x-left', 'var(--right-x-left)');
        domBackground.style.setProperty('--x-right', 'var(--right-x-right)');
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

export default flippingHorizontally;
