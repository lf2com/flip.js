window.addEventListener('ready', async () => {
  const domCandidate = document.getElementById('flip');
  const { clientWidth, clientHeight } = domCandidate;

  await Array.from(domCandidate.children).reduce(async (prevPromise, child) => {
    await prevPromise;

    const domCanvas = document.createElement('canvas');
    const value = child.getAttribute('value');
    const imagePath = `./${value}.jpg`;
    const image = new Image();

    await new Promise((resolve) => {
      image.addEventListener('load', function onLoad() {
        const context = domCanvas.getContext('2d');
        const { naturalWidth, naturalHeight } = this;
        const scale = 1.5 * (clientWidth / naturalWidth);
        const canvasWidth = clientWidth;
        const canvasHeight = clientHeight;
        const width = naturalWidth * scale;
        const height = naturalHeight * scale;
        const x = -0.5 * (width - clientWidth);
        const y = -0.15 * clientHeight;

        domCanvas.width = canvasWidth;
        domCanvas.height = canvasHeight;
        context.drawImage(
          this,
          0, 0, naturalWidth, naturalHeight, // origin x, y, width, height
          x, y, width, height, // target x, y, width, height
        );
        resolve();
      });
      image.src = imagePath;
      child.append(domCanvas);
    });
  }, Promise.resolve());

  async function flipCandidate() {
    await domCandidate.flip();
    flipCandidate();
  }

  flipCandidate();
});
