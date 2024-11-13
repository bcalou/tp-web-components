let db;
const dbName = "todo-list";
const storeName = "todo";

async function initializeDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, {
        keyPath: "id"
      })
    }

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
      console.log("Database opened:", db)
    }

    request.onerror = (event) => {
      reject("Database error", event.target.errorCode);
    }
  });
}

async function add() {
  // J'attends que la DB soit dispo avant de faire quoi que ce soit
  await ready;

  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  const request = store.add({label: "Manger", done: 0, id: "124564"})

  request.onerror = (error) =>
    console.error(`Failed to add todo: ${error}`)

  request.onsuccess = () =>
    console.info(`Added todo #123456...`)
}

async function getById() {
  await ready;

  // Retour d'une promise pour lire la valeur de retour
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
  
    const request = store.get("124564");

    request.onerror = (error) => reject(error)
    request.onsuccess = () => resolve(request.result)
  })
}

// J'initialise la DB et je stocke la promesse dans "ready" pour
// savoir lorsqu'elle sera dispo
const ready = initializeDB();

// Action simple (pas de await, on attend pas de retour particulier)
add();

fetchTodo();

// fetchTodo est une fonction async pour pouvoir utiliser await sur getById
async function fetchTodo() {
  const todo = await getById();
  console.log(todo);
}


















const request = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Nope")
  }, 2000);
});

async function executeRequest() {
  const result = await request;

  //console.log(result);

  // D'autres trucs
}

//executeRequest();

setInterval(() => {
  //console.log("coucou")
}, 300)


















class CurrentTime extends HTMLElement {
  static observedAttributes = ["format"];

  connectedCallback() {
    // 1. Récupérer les attributs
    this.format = this.getAttribute("format");

    // 2. Générer le squelette
    this.innerHTML = /* HTML */ `
      <div class="currentTime">
        <p class="currentTime__title"></p>
        <time class="currentTime__time"></time>
      </div>
    `

    // 3. Stocker les éléments nécessaires
    this.$title = this.querySelector("p");
    this.$time = this.querySelector("time");

    // 4. Effectuer / planifier les rendus
    this.renderTitle();

    this.interval = setInterval(() => this.renderTime(), 1000);
    this.renderTime();
  }

  // Quand format est modifié, on stocke sa valeur et on met à jour le rendu
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "format") {
      this.format = newValue;

      this.renderTitle();
    }
  }

  // Désactiver l'interval récurrent lorsque le composant disparaît
  disconnectedCallback() {
    clearInterval(this.interval);
  }

  // Affichage du titre en fonction du format
  renderTitle() {
    if (this.$title) {
      this.$title.textContent = this.format === "utc"
        ? "Heure UTC"
        : "Heure locale";
    }
  }

  // Affichage de la date/heure en fonction du format
  renderTime() {
    if (this.$time) {
      this.$time.textContent = this.format === "utc"
        ? new Date().toUTCString()
        : new Date().toLocaleString();
    }
  }
}

customElements.define("current-time", CurrentTime);