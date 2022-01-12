function addTask(tasks, input) {
  if (input.value.trim() === '') return;

  tasks.push({
    description: input.value,
    completed: false,
    index: tasks.length,
  });

  input.value = '';

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(tasks, task) {
  tasks[task.index - 1] = task;

  document
    .querySelectorAll('li')
    .forEach((elm) => elm.classList.remove('active'));

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(tasks, index) {
  tasks = tasks.filter((t) => t.index !== index);
  tasks = tasks.map((t) => {
    if (t.index > index) {
      t.index = t.index - 1;
    }
    return t;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export { addTask, updateTask, deleteTask };
