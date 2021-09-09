interface ApplyFlipAnimationOptions {
  durationMs: number;
}

/**
 * Applies flipping animation.
 */
async function applyFlipAnimation(
  domWrap: HTMLElement,
  domToFlip: HTMLElement,
  options: ApplyFlipAnimationOptions = {},
): Promise<void> {
  const {
    durationMs = 400,
  } = options;

  
}

export default applyFlipAnimation;
