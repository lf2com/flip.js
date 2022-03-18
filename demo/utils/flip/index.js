(() => {
  /* eslint-disable no-console */
  /* eslint-disable no-alert */
  const { currentScript } = document;
  const { loadScript } = window;
  const rootPath = currentScript.getAttribute('src').replace(/\/[^/]+?$/, '');
  const modules = (currentScript.getAttribute('module') ?? '')
    .split(/[|;,\s]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  (async () => {
    if (!customElements.get('flip-pack')) {
      console.log('Loading flip');

      try {
        // try to load development .js
        const flipJsPath = '/flip.dev.js';

        await loadScript(flipJsPath);
      } catch (error) {
        try {
          const flipJsPath = '../../dist/flip.min.js';

          console.log('Loading flip');
          await loadScript(flipJsPath);
        } catch (err) {
          const detail = `Failed to load flip: ${err.message}`;

          console.warn(detail);
          alert(detail);
        }
      }
    }

    console.info('`- Flip ready');
    await modules.reduce(async (prevPromise, module) => {
      await prevPromise;
      console.log(`Loading flip module: ${module}`);
      await loadScript(`${rootPath}/${module}.js`);
      console.log(`\`- Loaded: ${module}`);
    }, Promise.resolve());
  })();
})();
