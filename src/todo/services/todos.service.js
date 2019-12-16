class TodosService {
  constructor() {
    this.todos = localStorage.getItem('todos')
      ? JSON.parse(localStorage.getItem('todos'))
      : [];
    this.updates = [];
  }

  addTodo(name) {
    this.todos.push({
      id: this.getRandomId(),
      name: name,
      done: false,
    });
    this.onListUpdated();
  }

  getById(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  setDone(id, done) {
    this.getById(id).done = done;
    this.onListUpdated();
  }

  setName(id, name) {
    this.getById(id).name = name;
    this.onListUpdated();
  }

  removeDone() {
    this.todos = this.todos.filter((todo) => !todo.done);
    this.onListUpdated();
  }

  hasDoneTodos() {
    return this.todos.some((todo) => todo.done);
  }

  subscribe(onChange) {
    this.updates.push(onChange);
  }

  onListUpdated() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
    this.updates.forEach((update) => update());
  }

  getRandomId() {
    return parseInt(
      Math.random()
        .toString()
        .slice(2),
    );
  }
}

const todosService = new TodosService();

export default todosService;
