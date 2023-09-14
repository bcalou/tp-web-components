import todosService from "/src/services/todos.service.js";

export class TodoList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .todoList__list {
          margin-top: 1rem;
          padding-bottom: 3rem;
        }

        .todoList__removeDone {
          position: fixed;
          bottom: 0;
          width: 100%;
          height: 3rem;
          left: 0;
          box-shadow: 0 -10px 10px white;
        }
      </style>

      <todo-new></todo-new>

      <section class="todoList__items"></section>

      <button class="todoList__removeDone">Retirer les tâches effectuées</button>
    `;

    this.itemsEl = this.querySelector(".todoList__items");
    this.itemsEls = [];
    this.removeDoneEl = this.querySelector(".todoList__removeDone");

    this.attachEvents();
    this.render();

    todosService.subscribe(this.render.bind(this));
  }

  attachEvents() {
    this.removeDoneEl.addEventListener("click", () =>
      todosService.removeDone()
    );
  }

  render() {
    this.renderTodos();
    this.removeDoneEl.disabled = !todosService.hasDoneTodos();
  }

  renderTodos() {
    const todosToAdd = [...todosService.todos];

    // Go trough each current item to determine which one should be kept
    this.itemsEls = this.itemsEls.filter((itemEl) => {
      // Search for the matching todo in the todos to add
      const todo = todosToAdd.find((todo, index) => {
        if (todo.id === itemEl.getAttribute("todo-id")) {
          // Remove the todos from the add list, so it is not added twice
          todosToAdd.splice(index, 1);
          return todo;
        }
      });

      // Todo not found, element must be removed
      if (!todo) {
        this.itemsEl.removeChild(itemEl);
      }

      // Keep only if the matching todo was found
      return todo;
    });

    // Add the remaining todos
    todosToAdd.forEach((todo) => {
      const todoItem = document.createElement("todo-item");
      todoItem.setAttribute("todo-id", todo.id);
      this.itemsEls.push(todoItem);
      this.itemsEl.appendChild(todoItem);
    });
  }
}

customElements.define("todo-list", TodoList);
