class CurrentTime extends HTMLElement {
  static observedAttributes = ["format"];

  connectedCallback() {
    this.format = this.getAttribute("format");

    this.innerHTML = /* HTML */ `
      <div class="currentTime">
        <p class="currentTime__title"></p>
        <time class="currentTime__time"></time>
      </div>
    `

    this.$title = this.querySelector("p");
    this.$time = this.querySelector("time");

    this.renderTitle();

    this.interval = setInterval(() => this.renderTime(), 1000);
    this.renderTime();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "format") {
      this.format = newValue;

      this.renderTitle();
    }
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  renderTitle() {
    if (this.$title) {
      this.$title.textContent = this.format === "utc"
        ? "Heure UTC"
        : "Heure locale";
    }
  }

  renderTime() {
    if (this.$time) {
      this.$time.textContent = this.format === "utc"
        ? new Date().toUTCString()
        : new Date().toLocaleString();
    }
  }
}

customElements.define("current-time", CurrentTime);