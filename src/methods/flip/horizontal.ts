import Flip from '../../flip';
import createTempCard from '../../utils/createTempCard';
import prefixCss from '../../utils/prefixCss';
import Directions from '../../values/directions';
import { FlipAnimationOption } from './flipAnimation';

const backgroundStyle = `
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
`;
const wrapperStyle = `
  ${prefixCss(`@keyframes clip {
    0% {
      ${prefixCss(`clip-path: polygon(
        var(--start-x-left) -100vh,
        var(--start-x-right) -100vh,
        var(--start-x-right) calc(100% + 100vh),
        var(--start-x-left) calc(100% + 100vh)
      );`, 'webkit')}
    }
    50%, 100% {
      ${prefixCss(`clip-path: polygon(
        var(--end-x-left) -100vh,
        var(--end-x-right) -100vh,
        var(--end-x-right) calc(100% + 100vh),
        var(--end-x-left) calc(100% + 100vh)
      );`, 'webkit')}
    }
  }`, 'webkit')}

  :host {
    --hori-perspective: var(--3d-perspective, 5em);
    --right-x-left: 50%;
    --right-x-right: calc(100% + 100vw);
    --left-x-left: -100vw;
    --left-x-right: 50%;

    ${prefixCss('perspective: var(--hori-perspective);', 'webkit')}
    ${prefixCss('animation: clip var(--duration) forwards steps(1, end);', 'webkit')}
  }
`;
const cardStyle = `
  ${prefixCss(`@keyframes flip {
    0% {
      ${prefixCss('transform: rotateY(0);', 'webkit')}
    }
    100% {
      ${prefixCss('transform: rotateY(var(--end-deg));', 'webkit')}
    }
  }`, 'webkit')}

  :host {
    --left-end-deg: -180deg;
    --right-end-deg: 180deg;

    ${prefixCss('transform-style: preserve-3d;', 'webkit')}
    ${prefixCss('animation: flip var(--duration) forwards linear;', 'webkit')}
  }
`;
const nextCardStyle = `
  :host {
    ${prefixCss('backface-visibility: hidden;', 'webkit')}
    ${prefixCss('transform: rotateY(180deg);', 'webkit')}
  }
`;
const lastCardStyle = `
  :host {
    ${prefixCss('backface-visibility: hidden;', 'webkit')}
  }
`;

function flippingHorizontally(
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
    case Directions.left:
      domBackground.style.setProperty('--x-left', 'var(--left-x-left)');
      domBackground.style.setProperty('--x-right', 'var(--left-x-right)');
      domWrapper.style.setProperty('--start-x-left', 'var(--right-x-left)');
      domWrapper.style.setProperty('--start-x-right', 'var(--right-x-right)');
      domWrapper.style.setProperty('--end-x-left', 'var(--left-x-left)');
      domWrapper.style.setProperty('--end-x-right', 'var(--left-x-right)');
      domCard.style.setProperty('--end-deg', 'var(--left-end-deg)');
      break;

    case Directions.right:
      domBackground.style.setProperty('--x-left', 'var(--right-x-left)');
      domBackground.style.setProperty('--x-right', 'var(--right-x-right)');
      domWrapper.style.setProperty('--start-x-left', 'var(--left-x-left)');
      domWrapper.style.setProperty('--start-x-right', 'var(--left-x-right)');
      domWrapper.style.setProperty('--end-x-left', 'var(--right-x-left)');
      domWrapper.style.setProperty('--end-x-right', 'var(--right-x-right)');
      domCard.style.setProperty('--end-deg', 'var(--right-end-deg)');
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

export default flippingHorizontally;
