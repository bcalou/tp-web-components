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
      this.#notify();
    }
  }

  // Mettre à jour les todos dont les ids sont fournis avec les changements
  // contenus dans changes
  async updateByIds(ids, changes) {
    await this.#ready;
    
    const transaction = this.#db.transaction(this.#storeName, "readwrite");
    const store = transaction.objectStore(this.#storeName);

    ids.forEach(async (id) => {
      // On récupère les items via le store de la transaction en cours
      const item = await new Promise((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);

        request.onerror = (error) => reject(`Failed to get todo ${id}: ${error}`)
      });

      // Pour chaque changement dans changes, on modifie l'objet récupéré
      for (const [key, value] of Object.entries(changes)) {
        item[key] = value;
      }

      // On met à jour l'objet dans IndexedDB
      const request = store.put(item);

      request.onsuccess = () => console.info(`Updated todo ${id}`)
      request.onerror = (error) => console.error(`Failed updating todo ${id}`)
    })

    // La transaction est complète quand toutes les requêtes sont OK
    transaction.oncomplete = async () => {
      console.info("Update transaction complete");
      this.#notify();
    }

    transaction.onerror = (error) => console.error(`Update transaction failed: ${error}`);
  }

  // Supprimer les todos dont les ids sont fournis
  async deleteByIds(ids) {
    await this.#ready;

    const transaction = this.#db.transaction(this.#storeName, "readwrite");
    const store = transaction.objectStore(this.#storeName);

    // Pour chaque id passé, on fait une requête de suppression
    ids.forEach(id => {
      const request = store.delete(id);

      request.onsuccess = () => console.info(`Deleted todo ${id}`)
      request.onerror = (error) => console.error(`Failed deleting todo ${id}`)
    })

    // La transaction est complète quand toutes les requêtes sont OK
    transaction.oncomplete = async () => {
      console.info("Deletion transaction complete");
      this.#notify();
    }

    transaction.onerror = (error) => console.error(`Deletion transaction failed: ${error}`);
  }

  async #notify() {
    this.#onUpdate(await this.getAll());
  }
}
