import { todoStore } from '../data/todo-store.js';

customElements.define("todo-form", class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = /* HTML */ `<form>
      <label>
        <span>Tâche :</span>
        <input
          required
          name="label"
          maxlength="100"
          pattern=".*[a-zA-Z0-9].*"
        />
        <button>Ajouter</button>
      </label>
    </form>`;

    this.$form = this.shadowRoot.querySelector("form");
    this.$input = this.shadowRoot.querySelector("input");

    this.$form.addEventListener("submit", (event) => this.onSubmit(event))
  }

  onSubmit(event) {
    event.preventDefault();

    todoStore.add(this.$input.value);

    this.$input.value = "";
  }
})