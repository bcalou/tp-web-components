import todosService from "/src/services/todos.service.js";

export class TodoNew extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .todoNew__inputAndButton {
          margin-top: 0.5rem;
          display: flex;
          gap: 0.5rem;
        }

        .todoNew__input {
          flex: 1;
          width: 0;
        }

        .todoNew__submit {
          padding: 0 1rem;
        }

        .todoNew__error {
          color: red;
          margin-bottom: 0;
        }
      </style>

      <form class="todoNew__form">
        <label for="name">Nom de la tâche</label>

        <div class="todoNew__inputAndButton">
          <input id="name" class="todoNew__input" required pattern=".*[^ ].*">
          <button class="todoNew__submit">Ajouter</button>
        </div>
      </form>
    `;

    this.$input = this.querySelector("input");
    this.$form = this.querySelector("form");

    this.addEventListener("submit", this.onSubmit.bind(this));
  }

  // Add the submitted todo and clear the input
  onSubmit(event) {
    event.preventDefault();
    todosService.addTodo(this.$input.value);
    this.$input.value = "";
  }
}

customElements.define("todo-new", TodoNew);
