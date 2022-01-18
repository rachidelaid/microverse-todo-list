import Tasks from './class';

describe('testing add', () => {
  const tasks = new Tasks();

  it('adding the first task', () => {
    tasks.add({ description: 'task 1' });
    expect(tasks.list.length).toBe(1);
  });
});
