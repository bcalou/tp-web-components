import todosService from '/src/todo/services/todos.service.js';

const todoEditTemplate = document.createElement('template');
todoEditTemplate.innerHTML = `
  <link rel="stylesheet" href="src/todo/components/todo-edit/todo-edit.css">

  <form class="todoEdit__form">
    <input class="todoEdit__input">
    <button>Edit</button>
  </form>

  <p class="todoEdit__error">The todo name cannot be empty</p>
`;

export class TodoEdit extends HTMLElement {
  constructor() {
    super();

    this.el = this.attachShadow({ mode: 'open' });
    this.el.appendChild(todoEditTemplate.content.cloneNode(true));

    this.formEl = this.el.querySelector('.todoEdit__form');
    this.inputEl = this.el.querySelector('.todoEdit__input');

    this.errorEl = this.el.querySelector('.todoEdit__error');
    this.errorEl.style.display = 'none';
  }

  static get observedAttributes() {
    return ['todo-id'];
  }

  attributeChangedCallback(name) {
    if (name === 'todo-id') {
      this.todo = todosService.getById(this.getId());
      this.render();
    }
  }

  connectedCallback() {
    this.inputEl.focus();
  }

  render() {
    this.inputEl.value = this.todo.name;
    this.attachEvents();
  }

  attachEvents() {
    this.formEl.addEventListener('submit', (event) => {
      event.preventDefault();

      this.setName();
    });

    this.inputEl.addEventListener('input', () => {
      if (this.inputEl.value.length) {
        this.errorEl.style.display = 'none';
      }
    });
  }

  setName() {
    if (this.inputEl.value.length) {
      todosService.setName(this.getId(), this.inputEl.value);
    } else {
      this.errorEl.style.display = 'block';
    }
  }

  getId() {
    return parseInt(this.getAttribute('todo-id'));
  }
}

customElements.define('todo-edit', TodoEdit);
