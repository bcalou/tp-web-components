import todosService from "/src/services/todos.service.js";

export class TodoList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
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
  
      <div class="todoList">
        <todo-new></todo-new>
        <section class="todoList__items"></section>
        <button class="todoList__removeDone">
          Retirer les tâches effectuées
        </button>
      </div>
    `;

    this.itemElements = [];
    this.$items = this.querySelector(".todoList__items");
    this.$removeDone = this.querySelector(".todoList__removeDone");

    this.$removeDone.addEventListener(
      "click",
      todosService.removeDone.bind(todosService)
    );

    this.render();
    todosService.subscribe(this.render.bind(this));
  }

  render() {
    this.renderTodos();
    this.$removeDone.disabled = !todosService.hasDoneTodos();
  }

  renderTodos() {
    const todosToAdd = [...todosService.todos];

    // Go through each current item to determine which ones should be kept
    this.itemElements = this.itemElements.filter(($item) => {
      // Search for the matching todo in the todos to add
      const todo = todosToAdd.find((todo, index) => {
        if (todo.id === $item.getAttribute("todo-id")) {
          // Remove the todos from the add list, so it is not added twice
          todosToAdd.splice(index, 1);
          return todo;
        }
      });

      // Todo not found, element must be removed
      if (!todo) {
        this.$items.removeChild($item);
      }

      // Keep only if the matching todo was found
      return todo;
    });

    // Add the remaining todos
    todosToAdd.forEach((todo) => {
      const $todo = document.createElement("todo-item");
      $todo.setAttribute("todo-id", todo.id);
      this.itemElements.push($todo);
      this.$items.appendChild($todo);
    });
  }
}

customElements.define("todo-list", TodoList);
