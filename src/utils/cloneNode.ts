/**
 * Returns cloned candidate element.
 */
function cloneNode(node: Node): HTMLElement {
  const newNode = node.cloneNode(false);

  // canvas
  if (node instanceof HTMLCanvasElement) {
    const newCanvas = newNode as HTMLCanvasElement;

    newCanvas.width = node.width;
    newCanvas.height = node.height;
    newCanvas.getContext('2d')?.drawImage?.(node, 0, 0);
  }

  // children
  node.childNodes.forEach((child) => {
    newNode.appendChild(cloneNode(child));
  });

  return newNode as HTMLElement;
}

export default cloneNode;
