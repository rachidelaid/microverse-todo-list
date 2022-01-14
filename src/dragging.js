function getDragAfterElm(y) {
  const elements = [...document.querySelectorAll('li:not(.dragging)')];

  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }

      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

export default function handleDrag(tasks) {
  const listParent = document.querySelector('.list');

  document.querySelectorAll('li').forEach((li) => {
    li.addEventListener('dragstart', (e) => {
      e.target.classList.add('dragging');
    });

    li.addEventListener('dragend', () => {
      document
        .querySelectorAll('li')
        .forEach((x) => x.classList.remove('dragging'));
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggable = document.querySelector('.dragging');
      const afterElm = getDragAfterElm(e.clientY);

      if (afterElm === undefined) {
        listParent.append(draggable);
      } else {
        listParent.insertBefore(draggable, afterElm);
      }

      document.querySelectorAll('li').forEach((elm, i) => {
        const id = Number(elm.id.split('-')[1]);

        tasks.sort(id, i + 1);
      });
    });
  });
}
