class TodoStore {
  #todos = [];
  #listeners = [];

  subscribe(callback) {
    this.#listeners.push(callback);

    console.log(this.#listeners);
  }

  getAll() {
    return this.#todos;
  }

  add(label) {
    this.#todos.push({
      label,
      done: 0,
      id: crypto.randomUUID()
    });

    console.log("Added todo. New list", this.#todos);

    this.#notify();
  }

  #notify() {
    this.#listeners.forEach(listener => listener(this.#todos));
  }
}

export const todoStore = new TodoStore();