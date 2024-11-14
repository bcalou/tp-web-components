export class TodoWS {
  #ws;
  #ready;
  #onUpdate;

  constructor(onUpdate) {
    this.#onUpdate = onUpdate;
    this.#ready = this.#initializeWS();
  }

  async send(message) {
    await this.#ready;

    this.#ws.send(JSON.stringify(message));
  }

  async #initializeWS() {
    return new Promise((resolve, reject) => {
      this.#ws = new WebSocket("ws://localhost:8080");

      this.#ws.onopen = () => resolve(this.#ws);

      this.#ws.onmessage = (event) => this.#onUpdate(JSON.parse(event.data))

      this.#ws.onerror = (error) => reject("Websocket failed to open", error);
    })
  }
}