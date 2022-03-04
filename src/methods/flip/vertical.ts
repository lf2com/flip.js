import Flip from '../../flip';
import prefixCss from '../../utils/prefixCss';
import Direction from '../../values/direction';
import createTempNode from '../../utils/createTempNode';
import { FlipAnimationOption } from './flipAnimation';

type StyleGetter = (flip: Flip) => string;

const getBackgroundStyle: StyleGetter = () => (`
  :host {
    --upper-y-top: -100vh;
    --upper-y-bottom: 50%;
    --lower-y-top: 50%;
    --lower-y-bottom: calc(100% + 100vh);

    ${prefixCss(`clip-path: polygon(
      -100vw var(--y-top),
      calc(100% + 100vw) var(--y-top),
      calc(100% + 100vw) var(--y-bottom),
      -100vw var(--y-bottom)
    );`, 'webkit')}
  }
`);

const getCardStyle: StyleGetter = (flip) => (`
  ${prefixCss(`@keyframes flip {
    0% {
      ${prefixCss('transform: perspective(var(--vert-perspective)) rotateX(0);', 'webkit')}
    }
    100% {
      ${prefixCss('transform: perspective(var(--vert-perspective)) rotateX(var(--end-deg));', 'webkit')}
    }
  }`, 'webkit')}

  :host {
    --vert-perspective: ${flip.perspective};
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

const getNextCardStyle: StyleGetter = () => (`
  ${prefixCss(`@keyframes clip-next {
    0% { opacity: 0 }
    50%, 100% { opacity: 1 }
  }`, 'webkit')}

  :host {
    ${prefixCss('transform: rotateX(180deg);', 'webkit')}
    ${prefixCss('animation: clip-next var(--duration) forwards steps(1, end);', 'webkit')}
  }
`);

const getLastCardStyle: StyleGetter = () => (`
  ${prefixCss(`@keyframes clip-last {
    0% { opacity: 1 }
    50%, 100% { opacity: 0 }
  }`, 'webkit')}

  :host {
    ${prefixCss('animation: clip-last var(--duration) forwards steps(1, end);', 'webkit')}
  }
`);

/**
 * Flips card vertically.
 */
function flippingVertically(
  this: Flip,
  options: FlipAnimationOption,
): Promise<void> {
  const {
    duration,
    direction,
    lastCardInfo,
    nextCardInfo,
    tempCardNode,
  } = options;
  const {
    node: lastCardNode,
  } = lastCardInfo;
  const nextCardNode = nextCardInfo.node as HTMLElement;
  const durationSec = duration / 1000;
  const domBackground = createTempNode({ style: getBackgroundStyle(this) });
  const domCard = createTempNode({ style: getCardStyle(this) });
  const domNext = createTempNode({ style: getNextCardStyle(this) });
  const domNextCard = Flip.cloneCard(nextCardNode);

  switch (direction) {
    default:
    case Direction.down:
      domBackground.style.setProperty('--y-top', 'var(--lower-y-top)');
      domBackground.style.setProperty('--y-bottom', 'var(--lower-y-bottom)');
      domCard.style.setProperty('--start-y-top', 'var(--upper-y-top)');
      domCard.style.setProperty('--start-y-bottom', 'var(--upper-y-bottom)');
      domCard.style.setProperty('--end-y-top', 'var(--lower-y-top)');
      domCard.style.setProperty('--end-y-bottom', 'var(--lower-y-bottom)');
      domCard.style.setProperty('--end-deg', 'var(--down-end-deg)');
      break;

    case Direction.up:
      domBackground.style.setProperty('--y-top', 'var(--upper-y-top)');
      domBackground.style.setProperty('--y-bottom', 'var(--upper-y-bottom)');
      domCard.style.setProperty('--start-y-top', 'var(--lower-y-top)');
      domCard.style.setProperty('--start-y-bottom', 'var(--lower-y-bottom)');
      domCard.style.setProperty('--end-y-top', 'var(--upper-y-top)');
      domCard.style.setProperty('--end-y-bottom', 'var(--upper-y-bottom)');
      domCard.style.setProperty('--end-deg', 'var(--up-end-deg)');
      break;
  }

  domCard.style.setProperty('--duration', `${durationSec}s`);
  domNextCard.removeAttribute('slot');
  domNext.append(domNextCard);
  domCard.append(domNext);

  if (lastCardNode) {
    const domLast = createTempNode({ style: getLastCardStyle(this) });
    const domLastCard = Flip.cloneCard(lastCardNode);

    domLastCard.removeAttribute('slot');
    domLast.append(domLastCard);
    domCard.append(domLast);
    domBackground.append(Flip.cloneCard(domLast));
  }

  return new Promise((resolve) => {
    tempCardNode.addEventListener(
      'animationend',
      () => {
        resolve(undefined);
      },
      { once: true },
    );
    tempCardNode.append(domBackground);
    tempCardNode.append(domCard);
  });
}

export default flippingVertically;
