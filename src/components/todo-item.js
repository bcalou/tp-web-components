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
  <button class="todoItem__edit">✍️</button>
  <button class="todoItem__delete">🗑️</button>
`;

export class TodoItem extends HTMLElement {
  static get observedAttributes() {
    return ["todo-id"];
  }

  attributeChangedCallback(name) {
    if (name === "todo-id") {
      this.todo = todosService.getById(this.getAttribute("todo-id"));
    }
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        .todoItem {
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

      <div class="todoItem">
        <input type="checkbox" class="todoItem__checkbox">
        <div class="todoItem__name"></div>
        <button class="todoItem__edit">✍️</button>
        <button class="todoItem__delete">🗑️</button>
      </div>
    `;

    this.checkboxEl = this.querySelector(".todoItem__checkbox");
    this.nameEl = this.querySelector(".todoItem__name");
    this.editEl = this.querySelector(".todoItem__edit");
    this.deleteEl = this.querySelector(".todoItem__delete");

    this.attachEvents();

    this.render();
    todosService.subscribe(this.render.bind(this));
  }

  enterEditMode() {
    todosService.setEditing(this.getAttribute("todo-id"), true);
  }

  render() {
    this.checkboxEl.checked = this.todo.done;
    this.nameEl.innerHTML = "";

    if (this.todo.editing) {
      this.nameEl.appendChild(this.getEditingElement());
    } else {
      this.nameEl.innerHTML = this.todo.name;
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
    todoEditEl.setAttribute("todo-id", this.todo.id);

    return todoEditEl;
  }
}

customElements.define("todo-item", TodoItem);
