import 'material-icons/iconfont/material-icons.css';
import './style.css';

import { addTask, updateTask, deleteTask } from './functions';

const listParent = document.querySelector('.list');
const addBtn = document.querySelector('#add');
const input = document.querySelector('.input');

let tasks = localStorage.getItem('tasks')
  ? JSON.parse(localStorage.getItem('tasks'))
  : [];

function render() {
  listParent.innerHTML = '';

  tasks
    .sort((a, b) => a.index - b.index)
    .forEach((t) => {
      listParent.innerHTML += `
      <li id="task-${t.index}">
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

        const obj = tasks.find((t) => t.index === id);

        obj.description = inp.value.trim();

        updateTask(tasks, obj);

        inp.readOnly = true;
      }
    });
  });

  document.querySelectorAll('.dele').forEach((delBtn) => {
    delBtn.addEventListener('click', () => {
      const id = Number(delBtn.parentNode.parentNode.id.split('-')[1]);

      deleteTask(tasks, id);
      tasks = JSON.parse(localStorage.getItem('tasks'));
      delBtn.parentNode.parentNode.remove();
    });
  });
}

render();

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask(tasks, input);
    render();
  }
});
