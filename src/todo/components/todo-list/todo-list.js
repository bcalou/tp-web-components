import { TodoItem } from '/src/todo/components/todo-item/todo-item.js';
import { TodoNew } from '/src/todo/components/todo-new/todo-new.js';
import todosService from '/src/todo/services/todos.service.js';

const todoListTemplate = document.createElement('template');
todoListTemplate.innerHTML = `
  <link rel="stylesheet" href="src/todo/components/todo-list/todo-list.css">

  <todo-new></todo-new>

  <section class="todoList__items"></section>

  <button class="todoList__removeDone">Remove done</button>
`;

export class TodoList extends HTMLElement {
  constructor() {
    super();

    this.el = this.attachShadow({ mode: 'open' });
    this.el.appendChild(todoListTemplate.content.cloneNode(true));

    this.itemsEl = this.el.querySelector('.todoList__items');
    this.removeDoneEl = this.el.querySelector('.todoList__removeDone');

    this.attachEvents();
    this.render();

    todosService.subscribe(this.render.bind(this));
  }

  attachEvents() {
    this.removeDoneEl.addEventListener('click', () =>
      todosService.removeDone(),
    );
  }

  render() {
    this.itemsEl.innerHTML = '';

    todosService.todos.forEach((todo) => {
      const todoItem = document.createElement('todo-item');
      todoItem.setAttribute('todo-id', todo.id);
      this.itemsEl.appendChild(todoItem);
    });

    this.removeDoneEl.disabled = !todosService.hasDoneTodos();
  }
}

customElements.define('todo-list', TodoList);
