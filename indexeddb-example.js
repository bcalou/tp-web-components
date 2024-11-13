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
