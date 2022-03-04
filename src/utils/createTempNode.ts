const tempCardCss = `
  :host {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /*pointer-events: none;*/
    display: block;
  }

  slot {
    display: block;
  }
`;

interface TempNodeOptions {
  className?: string;
  slot?: string;
  style?: string;
  attributes?: Record<string, string>;
  innerHTML?: string;
}

/**
 * Returns a temp node.
 */
function createTempNode(
  options: TempNodeOptions = {},
): HTMLElement {
  const {
    className,
    slot,
    style = '',
    attributes = {},
    innerHTML = '<slot></slot>',
  } = options;
  const tempNode = document.createElement('div');
  const shadowRoot = tempNode.attachShadow({ mode: 'open' });

  shadowRoot.innerHTML = `
    <style>
      ${tempCardCss}
      ${style}
    </style>
    ${innerHTML}
  `;

  if (className !== undefined) {
    tempNode.classList.add(className);
  }
  if (slot !== undefined) {
    tempNode.setAttribute('slot', slot);
  }

  Object.keys(attributes).forEach((key) => {
    tempNode.setAttribute(key, attributes[key]);
  });

  return tempNode;
}

export default createTempNode;
