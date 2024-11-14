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
    case "greet":
      greet(payload, ws);
      break;
    default:
      ws.send(JSON.stringify({error: `Unknown action : ${action}`}))
  }
}

function greet(payload, ws) {
  clients.forEach((client) => {
    if (client !== ws) {
      client.send(JSON.stringify({message: `Hello from ${payload.firstname} ${payload.lastname}`}))
    }
  })
}