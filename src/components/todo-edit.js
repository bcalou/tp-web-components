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
  </style>

  <form class="todoEdit__form">
    <input class="todoEdit__input" required pattern=".*[^ ].*">
    <button>Valider</button>
  </form>
`;

export class TodoEdit extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(todoEditTemplate.content.cloneNode(true));

    this.$form = this.shadowRoot.querySelector(".todoEdit__form");
    this.$input = this.shadowRoot.querySelector(".todoEdit__input");
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

  connectedCallback() {
    this.$input.focus();
  }

  render() {
    this.$input.value = this.todo.name;

    this.$form.addEventListener("submit", this.onSubmit.bind(this));
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
