class TodoStore {
  #todos = [
    {
      id: "123",
      label: "Faire les courses",
      done: 0
    },
    {
      id: "456",
      label: "Faire à manger",
      done: 1
    }
  ];

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
  }
}

export const todoStore = new TodoStore();