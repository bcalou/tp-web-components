import { todoStore } from '../data/todo-store.js';

customElements.define("todo-list", class extends HTMLElement {
  connectedCallback() {
    this.render();

    todoStore.subscribe(() => this.render());
  }

  render() {
    this.innerHTML = `<ul>
      ${todoStore.getAll().map(todo => `<li>${todo.label}</li>`).join("")}
    </ul>`
  }
});
