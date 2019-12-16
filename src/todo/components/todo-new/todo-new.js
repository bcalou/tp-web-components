import todosService from '/src/todo/services/todos.service.js';

const todoNewTemplate = document.createElement('template');
todoNewTemplate.innerHTML = `
  <link rel="stylesheet" href="src/todo/components/todo-new/todo-new.css">

  <form class="todoNew__form">
    <input class="todoNew__input">
    <button class="todoNew__addButton">Add</button>
  </form>

  <p class="todoNew__error">The todo name cannot be empty</p>
`;

export class TodoNew extends HTMLElement {
  constructor() {
    super();

    this.el = this.attachShadow({ mode: 'open' });
    this.el.appendChild(todoNewTemplate.content.cloneNode(true));

    this.formEl = this.el.querySelector('.todoNew__form');
    this.inputEl = this.el.querySelector('.todoNew__input');

    this.errorEl = this.el.querySelector('.todoNew__error');
    this.errorEl.style.display = 'none';

    this.attachEvents();
  }

  attachEvents() {
    this.formEl.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addTodo();
    });

    this.inputEl.addEventListener('input', () => {
      if (this.inputEl.value.length) {
        this.errorEl.style.display = 'none';
      }
    });
  }

  addTodo() {
    if (this.inputEl.value.length) {
      todosService.addTodo(this.inputEl.value);
      this.inputEl.value = '';
    } else {
      this.errorEl.style.display = 'block';
    }
  }
}

customElements.define('todo-new', TodoNew);
