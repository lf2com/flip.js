import Flip from '../../flip';
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

const getCardStyle: StyleGetter = (flip) => (`
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

const getNextCardStyle: StyleGetter = () => (`
  ${prefixCss(`@keyframes clip-next {
    0% { opacity: 0 }
    50%, 100% { opacity: 1 }
  }`, 'webkit')}

  :host {
    ${prefixCss('transform: rotateY(180deg);', 'webkit')}
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
 * Flips card horizontally.
 */
function flippingHorizontally(
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
    case Direction.left:
      domBackground.style.setProperty('--x-left', 'var(--left-x-left)');
      domBackground.style.setProperty('--x-right', 'var(--left-x-right)');
      domCard.style.setProperty('--start-x-left', 'var(--right-x-left)');
      domCard.style.setProperty('--start-x-right', 'var(--right-x-right)');
      domCard.style.setProperty('--end-x-left', 'var(--left-x-left)');
      domCard.style.setProperty('--end-x-right', 'var(--left-x-right)');
      domCard.style.setProperty('--end-deg', 'var(--left-end-deg)');
      break;

    case Direction.right:
      domBackground.style.setProperty('--x-left', 'var(--right-x-left)');
      domBackground.style.setProperty('--x-right', 'var(--right-x-right)');
      domCard.style.setProperty('--start-x-left', 'var(--left-x-left)');
      domCard.style.setProperty('--start-x-right', 'var(--left-x-right)');
      domCard.style.setProperty('--end-x-left', 'var(--right-x-left)');
      domCard.style.setProperty('--end-x-right', 'var(--right-x-right)');
      domCard.style.setProperty('--end-deg', 'var(--right-end-deg)');
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

export default flippingHorizontally;
