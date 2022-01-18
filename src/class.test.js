import Tasks from './class';

const tasks = new Tasks();

describe('testing add', () => {
  it('adding the first task', () => {
    tasks.add({ description: 'task 1' });
    expect(tasks.list.length).toBe(1);
  });

  it('adding and chacking task description', () => {
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
