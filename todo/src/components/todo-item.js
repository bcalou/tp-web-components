import { todoStore } from "../data/todo-store.js";

customElements.define("todo-item", class extends HTMLElement {
  connectedCallback() {
    this.id = this.getAttribute("todo-id");
    this.todo = todoStore.getById(this.id);

    this.innerHTML = /* HTML */ `
      <form>
        <label>
          <input type="checkbox" ${this.todo.done ? "checked" : ""} />
          <span>${this.todo.label}</span>
        </label>
      </form>
    `;
  }
});