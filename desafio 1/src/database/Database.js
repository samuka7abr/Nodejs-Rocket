import { randomUUID } from 'crypto';

export class Database {
  #tasks = [];

  select(query) {
    if (!query) return this.#tasks;

    return this.#tasks.filter((task) =>
      Object.entries(query).every(([key, value]) =>
        task[key].toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  insert(data) {
    const task = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.#tasks.push(task);
    return task;
  }

  update(id, data) {
    const taskIndex = this.#tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return null;

    const current = this.#tasks[taskIndex];
    const updated = {
      ...current,
      ...data,
      updated_at: new Date(),
    };

    this.#tasks[taskIndex] = updated;
    return updated;
  }

  delete(id) {
    const index = this.#tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.#tasks.splice(index, 1);
    return true;
  }

  toggleComplete(id) {
    const task = this.#tasks.find((t) => t.id === id);
    if (!task) return null;

    task.completed_at = task.completed_at ? null : new Date();
    task.updated_at = new Date();
    return task;
  }
}
