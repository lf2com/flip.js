const tempCardCss = `
  :host {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    display: block;
  }

  slot {
    display: block;
  }
`;

interface TempCardOptions {
  className?: string;
  slot?: string;
  style?: string;
  innerHTML?: string;
}

/**
 * Returns a temp card.
 */
function createTempCard(
  options: TempCardOptions = {},
): HTMLElement {
  const {
    className,
    slot,
    style = '',
    innerHTML = '<slot></slot>',
  } = options;
  const tempCard = document.createElement('div');
  const shadowRoot = tempCard.attachShadow({ mode: 'open' });

  shadowRoot.innerHTML = `
    <style>
      ${tempCardCss}
      ${style}
    </style>
    ${innerHTML}
  `;

  if (className !== undefined) {
    tempCard.classList.add(className);
  }
  if (slot !== undefined) {
    tempCard.setAttribute('slot', slot);
  }

  return tempCard;
}

export default createTempCard;
