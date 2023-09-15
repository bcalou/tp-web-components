class CurrentTime extends HTMLElement {
  static get observedAttributes() {
    return ["format"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "format") {
      this.format = newVal;
    }

    if (this.$title) {
      this.render();
    }
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="currentTime">
        <p class="currentTime__title"></p>
        <time class="currentTime__time"></time>
      </div>
    `;
    this.$title = this.querySelector(".currentTime__title");
    this.$time = this.querySelector(".currentTime__time");

    this.render();

    this.interval = setInterval(this.renderTime.bind(this), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  render() {
    this.$title.innerHTML =
      this.format === "utc" ? "Heure UTC" : "Heure locale";
    this.renderTime();
  }

  renderTime() {
    const date = new Date();
    this.$time.innerHTML =
      this.format === "utc" ? date.toUTCString() : date.toLocaleString();
    this.$time.setAttribute("datetime", date.toISOString());
  }
}

customElements.define("current-time", CurrentTime);
