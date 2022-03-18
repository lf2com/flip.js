window.addEventListener('ready', () => {
  const domDuration = document.getElementById('duration').querySelector('input[type=number]');
  const domDirection = document.getElementById('direction');
  const domMode = document.getElementById('mode');
  const domAutoFlip = document.getElementById('auto').querySelector('input[type=checkbox]');
  const domFlip = document.getElementById('flip');

  async function autoFlip() {
    if (!domAutoFlip.checked) {
      return;
    }

    await domFlip.flip();
    setTimeout(async () => {
      autoFlip();
    }, 1000);
  }

  // changes the duration of flipping
  domDuration.addEventListener('input', function onInput() {
    domFlip.duration = this.value;
  });

  // changes the direction of flipping
  domDirection.querySelectorAll('input[type=radio]')
    .forEach((dom) => {
      dom.addEventListener('change', function onChange() {
        domFlip.direction = this.getAttribute('value');
      });
    });

  // changes the mode of choosing next candidate
  domMode.querySelectorAll('input[type=radio]')
    .forEach((dom) => {
      dom.addEventListener('change', function onChagne() {
        domFlip.mode = this.getAttribute('value');
      });
    });

  // checks auto flipping
  domAutoFlip.addEventListener('change', function onChange() {
    if (this.checked) {
      autoFlip();
    }
  });

  // initializes flip
  domFlip.duration = domDuration.value;
  domFlip.direction = domDirection.querySelector('input[type=radio][checked]').value;
  domFlip.mode = domMode.querySelector('input[type=radio][checked]').value;

  if (domAutoFlip.checked) {
    autoFlip();
  }
});
