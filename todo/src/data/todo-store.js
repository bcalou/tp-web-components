import { TodoDB } from './todo-db.js';

class TodoStore {
  #todoDB;
  #listeners = [];

  constructor() {
    this.#todoDB = new TodoDB((items) => this.#notify(items));
  }

  // Enregistrer une fonction qui sera appelée par le Store pour informer les
  // "abonnés" d'une mise à jour
  subscribe(callback) {
    this.#listeners.push(callback);

    // On retourne la fonction qui permettra de se désinscrire plus tard
    return () => this.#unsubscribe(callback);
  }

  // Récupérer toutes les todos
  getAll() {
    return this.#todoDB.getAll();
  }

  // Récupérer la todo qui correspond à l'id fourni
  getById(id) {
    return this.#todoDB.getById(id);
  }

  // Créer une todo à partir du label et l'ajouter à la liste
  add(label) {
    const newTodo = {
      label,
      done: 0,
      id: crypto.randomUUID()
    };

    this.#todoDB.add(newTodo);
  }

  // Mettre à jour la valeur done de la todo dont l'id est fourni
  updateDone(id, done) {
    this.getById(id).done = done;

    console.log(`Todo #${id} done property set to ${done}`);

    this.#notify();
  }

  // Supprimer une todo à partir de son id
  deleteById(id) {
    console.warn("Pas implémenté");
    //this.#todos = this.#todos.filter(todo => todo.id !== id);

    //console.log(`Deleted todo #${id}`);

    //this.#notify();
  }

  // Garder uniquement les todos pour lesquelles done vaut 0
  deleteDone() {
    console.warn("Pas implémenté");
    //this.#todos = this.#todos.filter(todo => !todo.done);

    //console.log("Deleted done todos");

    //this.#notify();
  }

  // Appeler tous les écouteurs enregistrés pour leur passer la liste à jour
  #notify(todos) {
    console.log("Notifying:", todos);

    this.#listeners.forEach(listener => listener(todos));
  }

  // Retirer un écouteur de la liste pour ne plus l'appeler dans #notify()
  #unsubscribe(callback) {
    this.#listeners = this.#listeners.filter(
      listener => listener !== callback
    )
  }
}

export const todoStore = new TodoStore();