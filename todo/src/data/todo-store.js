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