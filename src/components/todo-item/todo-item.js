import todosService from '/src/services/todos.service.js';

const todoItemTemplate = document.createElement('template');
todoItemTemplate.innerHTML = `
  <link rel="stylesheet" href="src/components/todo-item/todo-item.css">

  <input type="checkbox" class="todoItem__checkbox">
  <div class="todoItem__name"></div>
`;

export class TodoItem extends HTMLElement {
  constructor() {
    super();

    this.el = this.attachShadow({ mode: 'open' });
    this.el.appendChild(todoItemTemplate.content.cloneNode(true));

    this.checkboxEl = this.el.querySelector('.todoItem__checkbox');
    this.nameEl = this.el.querySelector('.todoItem__name');
    this.editing = false;
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

  enterEditMode() {
    this.editing = true;
    this.render();
  }

  render() {
    this.checkboxEl.checked = this.todo.done;
    this.nameEl.innerHTML = '';

    this.nameEl.appendChild(
      this.editing ? this.getEditingElement() : this.getStaticNameElement(),
    );

    this.attachEvents();
  }

  attachEvents() {
    this.checkboxEl.addEventListener('change', () =>
      todosService.setDone(this.getId(), this.checkboxEl.checked),
    );
  }

  getEditingElement() {
    const todoEditEl = document.createElement('todo-edit');
    todoEditEl.setAttribute('todo-id', this.todo.id);

    return todoEditEl;
  }

  getStaticNameElement() {
    const staticNameEl = document.createElement('p');
    staticNameEl.innerHTML = this.todo.name;
    staticNameEl.classList.add('todoItem__nameStatic');
    staticNameEl.addEventListener('click', () => this.enterEditMode());

    return staticNameEl;
  }

  getId() {
    return parseInt(this.getAttribute('todo-id'));
  }
}

customElements.define('todo-item', TodoItem);
