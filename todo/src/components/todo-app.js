import { todoStore } from '../data/todo-store.js';
import './todo-form.js';
import './todo-list.js';

customElements.define("todo-app", class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <h1>Todo-List</h1>

      <todo-form></todo-form>
      <todo-list></todo-list>

      <button id="deleteDone">Supprimer les tâches effectuées</button>
    `

    this.shadowRoot.getElementById("deleteDone").addEventListener("click", () =>
      todoStore.deleteDone()
    )
  }
})