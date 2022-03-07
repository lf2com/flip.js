(() => {
  window.addEventListener('ready', () => {
    const domFlip = document.getElementById('flip');
    const domItem = document.getElementById('item');
    const domItemName = domItem.querySelector('input[type=text]');
    const domItemAdd = domItem.querySelector('button');
    const domList = document.getElementById('list');

    const defaultItems = [
      'Taipei', 'New Taipei', 'Keelung', 'Taoyuan', 'Hsinchu',
      'Miaoli', 'Taichung', 'Changhua', 'Nantou', 'Yunlin',
      'Chiayi', 'Tainan', 'Kaohsiung', 'Pingtung', 'Yilan',
      'Hualien', 'Taitung', 'Penghu', 'Kinmen', 'Lienchiang',
    ];

    // adds item to list
    function addItem(name) {
      const domCandidate = document.createElement('div');
      const domNewItem = document.createElement('div');
      const domNewItemName = document.createElement('div');
      const domNewButtons = document.createElement('div');
      const domNewBtnMoveUp = document.createElement('div');
      const domNewBtnMoveDown = document.createElement('div');
      const domNewBtnRemove = document.createElement('div');

      domCandidate.innerHTML = name;
      domCandidate.classList.add('candidate');
      domNewItemName.innerHTML = name;
      domNewButtons.classList.add('buttons');
      domNewBtnMoveUp.classList.add('move-up');
      domNewBtnMoveDown.classList.add('move-down');
      domNewBtnRemove.classList.add('remove');
      domNewBtnMoveUp.addEventListener('click', (event) => {
        const index = Array.from(domNewItem.parentNode.children).indexOf(domNewItem);
        const candidate = domFlip.children[index];

        domNewItem.parentNode.insertBefore(
          domNewItem,
          // should not throw error here if the item is not the top one
          domNewItem.previousSibling,
        );
        candidate.parentNode.insertBefore(
          candidate,
          candidate.previousSibling,
        );
        event.stopPropagation();
      });
      domNewBtnMoveDown.addEventListener('click', (event) => {
        const index = Array.from(domNewItem.parentNode.children).indexOf(domNewItem);
        const candidate = domFlip.children[index];

        domNewItem.parentNode.insertBefore(
          domNewItem,
          // should not throw error here if the item is not the bottom one
          domNewItem.nextSibling.nextSibling,
        );
        candidate.parentNode.insertBefore(
          candidate,
          candidate.nextSibling.nextSibling,
        );
        event.stopPropagation();
      });
      domNewBtnRemove.addEventListener('click', (event) => {
        const index = Array.from(domNewItem.parentNode.children).indexOf(domNewItem);
        const candidate = domFlip.children[index];

        domNewItem.remove();
        candidate.remove();
        event.stopPropagation();
      });
      domNewItem.addEventListener('click', () => {
        const index = Array.from(domNewItem.parentNode.children).indexOf(domNewItem);

        domList.querySelectorAll('.focused').forEach((dom) => {
          dom.classList.remove('focused');
        });
        domNewItem.classList.add('focused');
        domFlip.flip(index);
      });
      domNewButtons.append(domNewBtnMoveUp);
      domNewButtons.append(domNewBtnMoveDown);
      domNewButtons.append(domNewBtnRemove);
      domNewItem.append(domNewItemName);
      domNewItem.append(domNewButtons);
      domList.append(domNewItem);
      domFlip.append(domCandidate);
    }

    // adds item
    domItemAdd.addEventListener('click', () => {
      addItem(domItemName.value);
      setTimeout(() => {
        const { children } = domList;

        children[children.length - 1].dispatchEvent(new Event('click'));
      }, 0);
    });
    domItemName.addEventListener('keydown', (event) => {
      switch (event.key) {
        default:
          break;

        case 'Enter':
          if (domItemName.value.length > 0) {
            domItemAdd.dispatchEvent(new Event('click'));
          }
          break;
      }
    });

    // initializes default items
    defaultItems.forEach((name) => {
      addItem(name);
    });
    domList.children[0].classList.add('focused');
  });
})();
