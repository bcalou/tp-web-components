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

    .todoItem__checkbox:checked ~ .todoItem__name .todoItem__nameStatic {
      text-decoration: line-through;
    }

    .todoItem__name {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
    }

    .todoItem__nameStatic {
      margin: 0;
    }
  </style>

  <input type="checkbox" class="todoItem__checkbox">
  <div class="todoItem__name"></div>
`;

export class TodoItem extends HTMLElement {
  constructor() {
    super();

    this.el = this.attachShadow({ mode: "open" });
    this.el.appendChild(todoItemTemplate.content.cloneNode(true));

    this.checkboxEl = this.el.querySelector(".todoItem__checkbox");
    this.nameEl = this.el.querySelector(".todoItem__name");
    this.editing = false;
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
    this.editing = true;
    this.render();
  }

  render() {
    this.checkboxEl.checked = this.todo.done;
    this.nameEl.innerHTML = "";

    this.nameEl.appendChild(
      this.editing ? this.getEditingElement() : this.getStaticNameElement()
    );

    this.attachEvents();
  }

  attachEvents() {
    this.checkboxEl.addEventListener("change", () =>
      todosService.setDone(
        this.getAttribute("todo-id"),
        this.checkboxEl.checked
      )
    );
  }

  getEditingElement() {
    const todoEditEl = document.createElement("todo-edit");
    todoEditEl.setAttribute("todo-id", this.todo.id);

    return todoEditEl;
  }

  getStaticNameElement() {
    const staticNameEl = document.createElement("p");
    staticNameEl.innerHTML = this.todo.name;
    staticNameEl.classList.add("todoItem__nameStatic");
    staticNameEl.addEventListener("click", () => this.enterEditMode());

    return staticNameEl;
  }
}

customElements.define("todo-item", TodoItem);
