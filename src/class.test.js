/**
 * @jest-environment jsdom
 */

import Tasks from './class';
import LocalStorage from './local-storage-mock';
import render from './render';

document.body.innerHTML = `
  <main>
    <div class="head">
      <h2>Today's To Do</h2>
      <span class="material-icons">autorenew</span>
    </div>
    <div class="table">
      <form class="add">
        <input
          class="input"
          id="input"
          type="text"
          placeholder="Add to your list"
          required
        />
        <button type="submit" id="add">
          <span class="material-icons">keyboard_return</span>
        </button>
      </form>
      <ul class="list"></ul>
    </div>
    <div class="clear">Clear all completed</div>
  </main>
`;

global.localStorage = new LocalStorage();

const tasks = new Tasks();

describe('testing add', () => {
  it('adding the first task', () => {
    tasks.add({ description: 'task 1' });
    expect(tasks.list.length).toBe(1);
  });

  it('adding and checking task description', () => {
    tasks.add({ description: 'task 2' });
    expect(tasks.list[1].description).toBe('task 2');
  });
});

describe('testing delete', () => {
  const deleteIndex = 1;

  it('test if first element is deleted', () => {
    tasks.remove(deleteIndex);
    expect(tasks.list.length).toBe(1);
  });
});

describe('testing edit', () => {
  const tasks = new Tasks();
  tasks.add({ description: 'task 1' });
  const currentTask = tasks.list[0];
  currentTask.description = 'Edited description';
  tasks.edit(currentTask);

  it('Checking if the list is edited with new description', () => {
    expect(tasks.list[0].description).toBe('Edited description');
  });
});

describe('testing completed tasks', () => {
  const tasks = new Tasks();
  tasks.add({ description: 'new task' });
  const currentTask = tasks.list[0];
  currentTask.completed = true;
  tasks.edit(currentTask);

  it('Checking if tasks completed is true', () => {
    expect(tasks.list[0].completed).toBeTruthy();
  });
});

describe('testing clear all completed', () => {
  const tasks = new Tasks();

  const firstTask = tasks.list[0];
  firstTask.completed = true;
  tasks.edit(firstTask);

  const secondTask = tasks.list[1];
  secondTask.completed = true;
  tasks.edit(secondTask);

  it('Checking if the list is empty', () => {
    tasks.clearCompleted();
    expect(tasks.list.length).toBe(0);
  });
});

describe('testing localStorage', () => {
  const tasks = new Tasks();

  it('checking if local storage is empty after clear', () => {
    localStorage.clear();
    expect(localStorage.getItem('tasks')).toBeNull();
  });

  it('checking if local storage is not empty after adding', () => {
    tasks.add({ description: 'task 1' });
    expect(localStorage.getItem('tasks')).not.toBeNull();
  });
});

describe('testing DOM manipulation functions', () => {
  localStorage.clear();
  const tasks = new Tasks();

  it('we should see one li in the list after adding', () => {
    tasks.add({ description: 'task 1' });
    render(tasks);

    expect(document.querySelectorAll('li').length).toBe(1);
  });

  it('the task description should change on the page after update', () => {
    const currentTask = tasks.list[0];
    currentTask.description = 'task 2';
    tasks.edit(currentTask);
    render(tasks);

    expect(document.querySelector('li .input').value).toBe('task 2');
  });

  it('the complete should be true after we click the checkbox', () => {
    document.querySelector('li .check').click();

    expect(tasks.list[0].completed).toBeTruthy();
  });

  it('the li count should be 1 after removing the second task', () => {
    tasks.add({ description: 'last task' });
    render(tasks);

    document.querySelectorAll('li .dele')[1].click();

    expect(document.querySelectorAll('li').length).toBe(1);
  });

  it('because the only task left is complete, the list should be empty after clearing all completed', () => {
    tasks.clearCompleted();
    render(tasks);

    expect(document.querySelectorAll('li').length).toBe(0);
  });
});
