import todosService from "/src/services/todos.service.js";

const todoNewTemplate = document.createElement("template");
todoNewTemplate.innerHTML = `
  <style>
    .todoNew__inputAndButton {
      margin-top: 0.5rem;
      display: flex;
    }

    .todoNew__input {
      flex: 1;
      height: 30px;
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

export class TodoNew extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(todoNewTemplate.content.cloneNode(true));

    this.$input = this.shadowRoot.querySelector("input");

    this.shadowRoot
      .querySelector("form")
      .addEventListener("submit", this.onSubmit.bind(this));
  }

  // Add the submitted todo and clear the input
  onSubmit(event) {
    event.preventDefault();
    todosService.addTodo(this.$input.value);
    this.$input.value = "";
  }
}

customElements.define("todo-new", TodoNew);
