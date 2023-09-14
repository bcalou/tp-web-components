class TodosService {
  constructor() {
    this.todos = localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : [];
    this.subscribers = [];
  }

  addTodo(name) {
    this.todos.push({
      id: this.getRandomId(),
      name: name,
      done: false,
      editing: false,
    });
    this.onListUpdated();
  }

  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.onListUpdated();
  }

  getById(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  setDone(id, done) {
    this.getById(id).done = done;
    this.onListUpdated();
  }

  setEditing(id, editing) {
    if (editing) {
      this.todos.forEach((todo) => (todo.editing = todo.id === id));
    } else {
      this.getById(id).editing = false;
    }

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

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  onListUpdated() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.subscribers.forEach((update) => update());
  }

  getRandomId() {
    return Math.random().toString().slice(2);
  }
}

const todosService = new TodosService();

export default todosService;
