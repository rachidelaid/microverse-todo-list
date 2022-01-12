import 'material-icons/iconfont/material-icons.css';
import './style.css';

import Tasks from './class';

const listParent = document.querySelector('.list');
const clearAll = document.querySelector('.clear');
const addBtn = document.querySelector('#add');
const input = document.querySelector('.input');

const tasks = new Tasks();

function render() {
  listParent.innerHTML = '';

  tasks.list
    .sort((a, b) => a.index - b.index)
    .forEach((t) => {
      listParent.innerHTML += `
      <li id="task-${t.index}" draggable="true">
        <div class="content">
          <input class="check" type="checkbox" ${t.completed ? 'checked' : ''}/>
          <input class="input" type="text" value='${t.description}' readonly />
        </div>
        <div class="actions">
          <span class="material-icons drag">more_vert</span>
          <span class="material-icons dele">delete_outline</span>
        </div>
      </li>
      `;
    });

  const lis = document.querySelectorAll('li');
  lis.forEach((li) => {
    li.addEventListener('click', (e) => {
      const elm = e.target;
      if (elm.classList.contains('drag') || elm.classList.contains('check')) {
        return;
      }

      lis.forEach((elm) => elm.classList.remove('active'));
      li.classList.add('active');

      const inp = li.querySelector('.input');
      inp.readOnly = false;
      inp.focus();
      inp.setSelectionRange(inp.value.length, inp.value.length);
    });
  });

  document.querySelectorAll('li .input').forEach((inp) => {
    inp.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const id = Number(inp.parentNode.parentNode.id.split('-')[1]);

        const obj = tasks.list.find((t) => t.index === id);

        obj.description = inp.value.trim();

        tasks.edit(obj);

        inp.parentNode.parentNode.classList.remove('active');

        inp.readOnly = true;
      }
    });
  });

  document.querySelectorAll('li .check').forEach((inp) => {
    inp.addEventListener('change', () => {
      const id = Number(inp.parentNode.parentNode.id.split('-')[1]);

      const obj = tasks.list.find((t) => t.index === id);

      obj.completed = inp.checked;

      tasks.edit(obj);
    });
  });

  document.querySelectorAll('.dele').forEach((delBtn) => {
    delBtn.addEventListener('click', () => {
      const id = Number(delBtn.parentNode.parentNode.id.split('-')[1]);

      tasks.remove(id);
      delBtn.parentNode.parentNode.remove();
    });
  });
}

render();

function addTask() {
  tasks.add({
    description: input.value.trim(),
  });

  input.value = '';

  render();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

clearAll.addEventListener('click', () => {
  tasks.clearCompleted();
  render();
});

///////////////////////////////////////

function getDragAfterElm(y) {
  const elements = [...document.querySelectorAll('li:not(.dragging)')];

  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

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

    render();
  });
});
