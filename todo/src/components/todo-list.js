
import { todoStore } from '../data/todo-store.js';
import './todo-item.js';

customElements.define("todo-list", class extends HTMLElement {
  connectedCallback() {
    this.render();

    this.unsubscribe = todoStore.subscribe(() => this.render());
  }

  disconnectedCallback() {
    this.unsubscribe();
  }

  // Rendu de la liste complète à partir des todos
  render() {
    this.innerHTML = `<ul>
      ${todoStore.getAll().map(todo => `<li>
        <todo-item todo-id="${todo.id}"></todo-item>
      </li>`).join("")}
    </ul>`
  }
});
