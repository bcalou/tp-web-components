import todosService from "/src/services/todos.service.js";

export class TodoEdit extends HTMLElement {
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
        .todoEdit {
          display: flex;
          gap: 0.5rem;
        }

        .todoEdit__input {
          flex-basis: 0;
          flex-grow: 1;
          width: 0;
        }
      </style>

      <form class="todoEdit">
        <input class="todoEdit__input" required pattern=".*[^ ].*">
        <button>Valider</button>
      </form>
    `;
  
    this.$input = this.querySelector(".todoEdit__input");

    this.$input.focus();

    this.render();
  }

  render() {
    this.$input.value = this.todo.name;

    this.addEventListener("submit", this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    this.setName();
  }

  setName() {
    todosService.setName(this.getAttribute("todo-id"), this.$input.value);
    todosService.setEditing(this.getAttribute("todo-id"), false);
  }
}

customElements.define("todo-edit", TodoEdit);
