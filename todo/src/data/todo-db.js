export class TodoDB {
  #dbName = "todo-list";
  #storeName = "todo";
  #db;
  #onUpdate;
  #ready;

  constructor(onUpdate) {
    this.#onUpdate = onUpdate;

    this.#ready = this.#initializeDB();
  }

  // On initialize la DB et on retourne la promesse pour savoir quand c'est ok
  async #initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.#dbName);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(this.#storeName, {
          keyPath: "id"
        })
      }
  
      request.onsuccess = (event) => {
        this.#db = event.target.result;
        resolve(this.#db);
        console.log("Database opened:", this.#db)
      }
  
      request.onerror = (event) => {
        reject("Database error", event.target.errorCode);
      }
    });
  }

  // Retourner toutes les todos
  async getAll() {
    await this.#ready;
  
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction(this.#storeName, "readonly");
      const store = transaction.objectStore(this.#storeName);
    
      const request = store.getAll();
  
      request.onerror = (error) => reject(error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  // Retourner la todo correspondant à l'id
  async getById(id) {
    await this.#ready;
  
    return new Promise((resolve, reject) => {
      const transaction = this.#db.transaction(this.#storeName, "readonly");
      const store = transaction.objectStore(this.#storeName);
    
      const request = store.get(id);
  
      request.onerror = (error) => reject(error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  // Ajouter une todo (objet déjà mis en forme par TodoStore)
  async add(todo) {
    await this.#ready;
  
    const transaction = this.#db.transaction(this.#storeName, "readwrite");
    const store = transaction.objectStore(this.#storeName);
  
    const request = store.add(todo)
  
    request.onerror = (error) =>
      console.error(`Failed to add todo: ${error}`)
  
    request.onsuccess = async () => {
      console.info(`Added todo: `, todo.id);

      // On a modifié la base, on appelle la fonction d'update
      this.#onUpdate(await this.getAll());
    }
  }
}
