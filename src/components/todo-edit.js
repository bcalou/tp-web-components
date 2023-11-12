import todosService from "/src/services/todos.service.js";

const todoEditTemplate = document.createElement("template");
todoEditTemplate.innerHTML = `
  <style>
    .todoEdit {
      display: flex;
    }

    .todoEdit__input {
      max-width: calc(100vw - 170px);
    }

    .todoEdit__error {
      color: red;
      margin-bottom: 0;
    }
  </style>

  <form class="todoEdit__form">
    <input class="todoEdit__input">
    <button>Valider</button>
  </form>

  <p class="todoEdit__error">Le nom de la tâche ne peut pas être vide</p>
`;

export class TodoEdit extends HTMLElement {
  static get observedAttributes() {
    return ["todo-id"];
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        .todoEdit {
          display: flex;
        }

        .todoEdit__input {
          max-width: calc(100vw - 170px);
        }

        .todoEdit__error {
          color: red;
          margin-bottom: 0;
        }
      </style>

      <form class="todoEdit__form">
        <input class="todoEdit__input">
        <button>Valider</button>
      </form>

      <p class="todoEdit__error">Le nom de la tâche ne peut pas être vide</p>
    `;

    this.formEl = this.querySelector(".todoEdit__form");
    this.inputEl = this.querySelector(".todoEdit__input");

    this.errorEl = this.querySelector(".todoEdit__error");
    this.errorEl.style.display = "none";
    this.inputEl.focus();

    this.render();
  }

  attributeChangedCallback(name) {
    if (name === "todo-id") {
      this.todo = todosService.getById(this.getAttribute("todo-id"));
    }
  }

  render() {
    this.inputEl.value = this.todo.name;
    this.attachEvents();
  }

  attachEvents() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      this.setName();
    });

    this.inputEl.addEventListener("input", () => {
      if (this.inputEl.value.length) {
        this.errorEl.style.display = "none";
      }
    });
  }

  setName() {
    if (this.inputEl.value.length) {
      todosService.setName(this.getAttribute("todo-id"), this.inputEl.value);
      todosService.setEditing(this.getAttribute("todo-id"), false);
    } else {
      this.errorEl.style.display = "block";
    }
  }
}

customElements.define("todo-edit", TodoEdit);
