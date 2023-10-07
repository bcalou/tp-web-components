import todosService from "/src/services/todos.service.js";

const todoItemTemplate = document.createElement("template");
todoItemTemplate.innerHTML = `
  <style>
    :host {
      margin: 1rem 0;
      display: flex;
    }

    .todoItem__checkbox {
      height: 2rem;
      width: 2rem;
      margin-right: 1rem;
      flex-shrink: 0;
    }

    .todoItem__checkbox:checked ~ .todoItem__label {
      text-decoration: line-through;
    }

    .todoItem__label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
    }
  </style>

  <input type="checkbox" class="todoItem__checkbox">
  <label class="todoItem__label"></label>
  <button class="todoItem__edit">✍️</button>
  <button class="todoItem__delete">🗑️</button>
`;

export class TodoItem extends HTMLElement {
  constructor() {
    super();

    this.el = this.attachShadow({ mode: "open" });
    this.el.appendChild(todoItemTemplate.content.cloneNode(true));

    this.checkboxEl = this.el.querySelector(".todoItem__checkbox");
    this.labelEl = this.el.querySelector(".todoItem__label");
    this.editEl = this.el.querySelector(".todoItem__edit");
    this.deleteEl = this.el.querySelector(".todoItem__delete");

    todosService.subscribe(this.render.bind(this));

    this.attachEvents();
  }

  static get observedAttributes() {
    return ["todo-id"];
  }

  attributeChangedCallback(name) {
    if (name === "todo-id") {
      this.todo = todosService.getById(this.getAttribute("todo-id"));
      this.render();
    }
  }

  enterEditMode() {
    todosService.setEditing(this.getAttribute("todo-id"), true);
    this.render();
  }

  render() {
    this.checkboxEl.checked = this.todo.done;
    this.checkboxEl.setAttribute("id", this.todo.id);
    this.labelEl.innerHTML = "";

    if (this.todo.editing) {
      this.labelEl.appendChild(this.getEditingElement());
    } else {
      this.labelEl.innerHTML = this.todo.name;
      this.labelEl.setAttribute("for", this.todo.id);
    }
  }

  attachEvents() {
    this.checkboxEl.addEventListener("change", () =>
      todosService.setDone(
        this.getAttribute("todo-id"),
        this.checkboxEl.checked
      )
    );

    this.editEl.addEventListener("click", () => this.enterEditMode());

    this.deleteEl.addEventListener("click", () =>
      todosService.removeTodo(this.getAttribute("todo-id"))
    );
  }

  getEditingElement() {
    const todoEditEl = document.createElement("todo-edit");
    console.log("edit", this.getAttribute("todo-id"));
    todoEditEl.setAttribute("todo-id", this.todo.id);

    return todoEditEl;
  }
}

customElements.define("todo-item", TodoItem);
