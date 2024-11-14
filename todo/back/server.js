const WebSocket = require("ws");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("todos.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
  }
})

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  ws.on("message", (data) => onMessage(data, ws));

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  })
})

function onMessage(data, ws) {
  const message = JSON.parse(data);
  console.log("Received message", message);

  const { action, payload } = message;

  switch(action) {
    case "add":
      add(message, ws);
      break;
    default:
      ws.send(JSON.stringify({error: `Unknown action : ${action}`}))
  }
}

function add(message, ws) {
  const { todo } = message.payload;

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO TODOS (id, label, done) VALUES (?, ?, ?)",
      [todo.id, todo.label, todo.done],
      function(error) {
        if (error) {
          reject(`Failed to add item #${todo.id}: ${error}`)
        }

        clients.forEach((client) => {
          if (client !== ws) {
            client.send(JSON.stringify(message))
          }
        })

        resolve();
      }
    )
  });
}