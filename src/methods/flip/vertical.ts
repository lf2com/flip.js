import Flip from '../..';
import prefixCss from '../../utils/prefixCss';
import Directions from '../../values/directions';
import createTempCard from '../../utils/createTempCard';
import { FlipAnimationOption } from './flipAnimation';

const backgroundStyle = `
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
`;
const wrapperStyle = `
  ${prefixCss(`@keyframes clip {
    0% {
      ${prefixCss(`clip-path: polygon(
        -100vw var(--start-y-top),
        calc(100% + 100vw) var(--start-y-top),
        calc(100% + 100vw) var(--start-y-bottom),
        -100vw var(--start-y-bottom)
      );`, 'webkit')}
    }
    50%, 100% {
      ${prefixCss(`clip-path: polygon(
        -100vw var(--end-y-top),
        calc(100% + 100vw) var(--end-y-top),
        calc(100% + 100vw) var(--end-y-bottom),
        -100vw var(--end-y-bottom)
      );`, 'webkit')}
    }
  }`, 'webkit')}

  :host {
    --vert-perspective: var(--3d-perspective, 5em);
    --upper-y-top: -100vh;
    --upper-y-bottom: 50%;
    --lower-y-top: 50%;
    --lower-y-bottom: calc(100% + 100vh);

    ${prefixCss('perspective: var(--vert-perspective);', 'webkit')}
    ${prefixCss('animation: clip var(--duration) forwards steps(1, end);', 'webkit')}
  }
`;
const cardStyle = `
  ${prefixCss(`@keyframes flip {
    0% {
      ${prefixCss('transform: rotateX(0);', 'webkit')}
    }
    100% {
      ${prefixCss('transform: rotateX(var(--end-deg));', 'webkit')}
    }
  }`, 'webkit')}

  :host {
    --down-end-deg: -180deg;
    --up-end-deg: 180deg;

    ${prefixCss('transform-style: preserve-3d;', 'webkit')}
    ${prefixCss('animation: flip var(--duration) forwards linear;', 'webkit')}
  }
`;
const nextCardStyle = `
  :host {
    ${prefixCss('backface-visibility: hidden;', 'webkit')}
    ${prefixCss('transform: rotateX(180deg);', 'webkit')}
  }
`;
const lastCardStyle = `
  :host {
    ${prefixCss('backface-visibility: hidden;', 'webkit')}
  }
`;

function flippingVertically(
  this: Flip,
  options: FlipAnimationOption,
): Promise<void> {
  const {
    duration,
    direction,
    lastCard,
    nextCard,
    tempCard,
  } = options;
  const durationSec = duration / 1000;
  const domBackground = createTempCard({ style: backgroundStyle });
  const domWrapper = createTempCard({ style: wrapperStyle });
  const domCard = createTempCard({ style: cardStyle });
  const domNext = createTempCard({ style: nextCardStyle });
  const domNextCard = Flip.cloneCard(nextCard);

  switch (direction) {
    default:
    case Directions.down:
      domBackground.style.setProperty('--y-top', 'var(--lower-y-top)');
      domBackground.style.setProperty('--y-bottom', 'var(--lower-y-bottom)');
      domWrapper.style.setProperty('--start-y-top', 'var(--upper-y-top)');
      domWrapper.style.setProperty('--start-y-bottom', 'var(--upper-y-bottom)');
      domWrapper.style.setProperty('--end-y-top', 'var(--lower-y-top)');
      domWrapper.style.setProperty('--end-y-bottom', 'var(--lower-y-bottom)');
      domCard.style.setProperty('--end-deg', 'var(--down-end-deg)');
      break;

    case Directions.up:
      domBackground.style.setProperty('--y-top', 'var(--upper-y-top)');
      domBackground.style.setProperty('--y-bottom', 'var(--upper-y-bottom)');
      domWrapper.style.setProperty('--start-y-top', 'var(--lower-y-top)');
      domWrapper.style.setProperty('--start-y-bottom', 'var(--lower-y-bottom)');
      domWrapper.style.setProperty('--end-y-top', 'var(--upper-y-top)');
      domWrapper.style.setProperty('--end-y-bottom', 'var(--upper-y-bottom)');
      domCard.style.setProperty('--end-deg', 'var(--up-end-deg)');
      break;
  }

  domWrapper.style.setProperty('--duration', `${durationSec}s`);
  domNextCard.removeAttribute('slot');
  domNext.append(domNextCard);
  domCard.append(domNext);
  domWrapper.append(domCard);

  if (lastCard) {
    const domLast = createTempCard({ style: lastCardStyle });
    const domLastCard = Flip.cloneCard(lastCard);

    domLastCard.removeAttribute('slot');
    domLast.append(domLastCard);
    domCard.append(domLast);
    domBackground.append(Flip.cloneCard(domLast));
  }

  return new Promise((resolve) => {
    tempCard.addEventListener(
      'animationend',
      () => {
        resolve(undefined);
      },
      { once: true },
    );
    tempCard.append(domBackground);
    tempCard.append(domWrapper);
  });
}

export default flippingVertically;
