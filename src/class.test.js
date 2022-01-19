import Tasks from './class';
import LocalStorage from './local-storage-mock';

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
