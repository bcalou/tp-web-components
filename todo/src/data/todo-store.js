class TodoStore {
  #todos = [];
  #listeners = [];

  // Enregistrer une fonction qui sera appelée par le Store pour informer les
  // "abonnés" d'une mise à jour
  subscribe(callback) {
    this.#listeners.push(callback);

    // On retourne la fonction qui permettra de se désinscrire plus tard
    return () => this.#unsubscribe(callback);
  }

  // Récupérer toutes les todos
  getAll() {
    return this.#todos;
  }

  // Récupérer la todo qui correspond à l'id fourni
  getById(id) {
    return this.#todos.find(todo => todo.id === id);
  }

  // Créer une todo à partir du label et l'ajouter à la liste
  add(label) {
    this.#todos.push({
      label,
      done: 0,
      id: crypto.randomUUID()
    });

    console.log("Added todo. New list", this.#todos);

    this.#notify();
  }

  // Supprimer une todo à partir de son id
  deleteById(id) {
    this.#todos = this.#todos.filter(todo => todo.id !== id);

    console.log(`Deleted todo #${id}. New list:`, this.#todos);

    this.#notify();
  }

  // Garder uniquement les todos pour lesquelles done vaut 0
  deleteDone() {
    this.#todos = this.#todos.filter(todo => !todo.done);

    console.log("Deleted done todos");

    this.#notify();
  }

  // Appeler tous les écouteurs enregistrés pour leur passer la liste à jour
  #notify() {
    this.#listeners.forEach(listener => listener(this.#todos));
  }

  // Retirer un écouteur de la liste pour ne plus l'appeler dans #notify()
  #unsubscribe(callback) {
    this.#listeners = this.#listeners.filter(
      listener => listener !== callback
    )
  }
}

export const todoStore = new TodoStore();