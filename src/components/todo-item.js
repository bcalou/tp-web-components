import todosService from "/src/services/todos.service.js";

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
          gap: 0.5rem;
        }

        .todoItem__checkbox {
          height: 2rem;
          width: 2rem;
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

      <article class="todoItem">
        <input type="checkbox" class="todoItem__checkbox">
        <label class="todoItem__label"></label>
        <button class="todoItem__edit">✍️</button>
        <button class="todoItem__delete">🗑️</button>
      </article>
    `;

    this.$checkbox = this.querySelector(".todoItem__checkbox");
    this.$label = this.querySelector(".todoItem__label");
    this.$editButton = this.querySelector(".todoItem__edit");
    this.$deleteButton = this.querySelector(".todoItem__delete");

    todosService.subscribe(this.render.bind(this));

    this.$checkbox.addEventListener("change", this.onCheck.bind(this));
    this.$editButton.addEventListener("click", this.onEdit.bind(this));
    this.$deleteButton.addEventListener("click", this.onDelete.bind(this));

    this.render();
  }

  render() {
    console.log("render")
    this.$checkbox.checked = this.todo.done;
    this.$checkbox.setAttribute("id", this.todo.id);
    this.$label.innerHTML = "";
    this.$editButton.setAttribute(
      "aria-label",
      `Modifier la tâche ${this.todo.name}`
    );
    this.$deleteButton.setAttribute(
      "aria-label",
      `Supprimer la tâche ${this.todo.name}`
    );

    if (this.todo.editing) {
      this.$label.appendChild(this.getEditingElement());
      this.$editButton.setAttribute("disabled", "");
      this.$checkbox.setAttribute("disabled", "");
    } else {
      this.$label.innerHTML = this.todo.name;
      this.$label.setAttribute("for", this.todo.id);
      this.$editButton.removeAttribute("disabled");
      this.$checkbox.removeAttribute("disabled", "");
    }
  }

  onCheck(event) {
    todosService.setDone(this.getAttribute("todo-id"), event.target.checked);
  }

  onEdit() {
    todosService.setEditing(this.getAttribute("todo-id"), true);
    this.render();
  }

  onDelete() {
    todosService.removeTodo(this.getAttribute("todo-id"));
  }

  getEditingElement() {
    const todoEditEl = document.createElement("todo-edit");
    todoEditEl.setAttribute("todo-id", this.todo.id);

    return todoEditEl;
  }
}

customElements.define("todo-item", TodoItem);
