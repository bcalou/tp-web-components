
import { todoStore } from '../data/todo-store.js';
import './todo-item.js';

customElements.define("todo-list", class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `<ul></ul>`

    this.$list = this.shadowRoot.querySelector("ul");

    this.init();
  }

  disconnectedCallback() {
    this.unsubscribe();
  }

  async init() {
    // Créer une copie locale du tableau des todos
    this.localTodos = new Array(...(await todoStore.getAll()));

    // Pour chaque todo du store, l'ajouter à la liste (rendu initial)
    this.localTodos.forEach(todo => this.showTodo(todo));

    // Mettre à jour la liste quand le store publie une mise à jour
    this.unsubscribe = todoStore.subscribe((todos) => this.update(todos));
  }

  // Créer un élément todo-item et l'ajout à l'ul
  showTodo(todo) {
    const $todoLi = document.createElement("li");

    const $todoItem = document.createElement("todo-item");
    $todoItem.setAttribute("todo-id", todo.id);

    $todoLi.appendChild($todoItem);
    this.$list.appendChild($todoLi);
  }

  // Mettre à jour l'affichage en fonction des mises à jour
  update(updatedTodos) {

    // Ajouter les nouvelles todos qui ne sont pas encore affichées
    updatedTodos.forEach(updatedTodo => {
      if (!this.localTodos.find(localTodo => localTodo.id === updatedTodo.id)) {
        this.showTodo(updatedTodo);
      }
    });

    // Supprimer les todos obsolètes qui sont affichées mais absentes du store
    this.localTodos.forEach(localTodo => {
      if (!updatedTodos.find(updatedTodo => updatedTodo.id === localTodo.id)) {
        this.shadowRoot.querySelector(
          `li:has([todo-id="${localTodo.id}"])`
        ).remove();
      }
    });

    // Mettre à jour la copie locale du tableau pour les comparaisons suivantes
    this.localTodos = new Array(...updatedTodos);
  }
});
