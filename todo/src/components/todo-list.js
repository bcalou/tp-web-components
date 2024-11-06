import { todoStore } from '../data/todo-store.js';

customElements.define("todo-list", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<ul>
      ${todoStore.getAll().map(todo => `<li>${todo.label}</li>`).join("")}
    </ul>`
  }
});
