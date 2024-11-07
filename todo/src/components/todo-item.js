import { todoStore } from "../data/todo-store.js";

customElements.define("todo-item", class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.id = this.getAttribute("todo-id");
    this.todo = todoStore.getById(this.id);

    this.shadowRoot.innerHTML = /* HTML */ `
      <form>
        <label>
          <input type="checkbox" ${this.todo.done ? "checked" : ""} />
          <span>${this.todo.label}</span>
        </label>
      </form>
      <button id="delete" aria-label="Supprimer ${this.todo.label}">
        🗑️
      </button>
    `;

    this.shadowRoot.getElementById("delete").addEventListener("click", () =>
      todoStore.deleteById(this.todo.id)
    );
  }
});