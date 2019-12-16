import { TodoList } from '/src/todo/components/todo-list/todo-list.js';

const todoAppTemplate = document.createElement('template');
todoAppTemplate.innerHTML = `
  <link rel="stylesheet" href="src/todo/pages/todo-app/todo-app.css">

  <header>
    <h1 class="todoApp__title">Todo List</h1>
  </header>

  <todo-list></todo-list>
`;

class TodoApp extends HTMLElement {
  constructor() {
    super();

    this.el = this.attachShadow({ mode: 'open' });
    this.el.appendChild(todoAppTemplate.content.cloneNode(true));
  }
}

customElements.define('todo-app', TodoApp);
