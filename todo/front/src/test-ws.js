let ws;
let ready;

async function initializeWS() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => resolve(ws);

    ws.onmessage = (event) => console.log(JSON.parse(event.data))

    ws.onerror = (error) => reject("Websocket failed to open", error);
  })
}

async function testSend() {
  await ready;
  ws.send(JSON.stringify({
    action: "greet",
    payload: {
      firstname: "Bastien",
      lastname: Math.random()
    }
  }))
}

ready = initializeWS();
testSend();

