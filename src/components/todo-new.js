import todosService from "/src/services/todos.service.js";

export class TodoNew extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<style>
      .todoNew__inputAndButton {
        margin-top: 0.5rem;
        display: flex;
      }

      .todoNew__input {
        flex: 1;
        height: 30px;
        min-width: 0;
      }

      .todoNew__addButton {
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
        <input id="name" class="todoNew__input">
        <button class="todoNew__addButton">Ajouter</button>
      </div>
    </form>

    <p class="todoNew__error">Le nom de la tâche ne peut pas être vide</p>`;

    this.formEl = this.querySelector(".todoNew__form");
    this.inputEl = this.querySelector(".todoNew__input");

    this.errorEl = this.querySelector(".todoNew__error");
    this.errorEl.style.display = "none";

    this.attachEvents();
  }

  attachEvents() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      this.addTodo();
    });

    this.inputEl.addEventListener("input", () => {
      if (this.inputEl.value.length) {
        this.errorEl.style.display = "none";
      }
    });
  }

  addTodo() {
    if (this.inputEl.value.length) {
      todosService.addTodo(this.inputEl.value);
      this.inputEl.value = "";
    } else {
      this.errorEl.style.display = "block";
    }
  }
}

customElements.define("todo-new", TodoNew);
