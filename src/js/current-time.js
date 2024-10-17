customElements.define(
  "current-time",
  class CurrentTime extends HTMLElement {
    static observedAttributes = ["format"];

    connectedCallback() {
      this.innerHTML = /* HTML */ `
        <div class="currentTime">
          <p class="currentTime__title">${this.getTitle()}</p>
          <time class="currentTime__time"></time>
        </div>
      `;

      this.$title = this.querySelector(".currentTime__title");
      this.$time = this.querySelector(".currentTime__time");

      this.interval = setInterval(this.render.bind(this), 1000);
      this.render();
    }

    attributeChangedCallback(name) {
      if (name === "format") {
        if (this.$title) {
          this.$title.innerHTML = this.getTitle();
        }

        if (this.$time) {
          // Immediate rendering (reset the interval)
          clearInterval(this.interval);
          this.interval = setInterval(this.render.bind(this), 1000);
          this.render();
        }
      }
    }

    disconnectedCallback() {
      clearInterval(this.interval);
    }

    render() {
      const date = new Date();

      this.$time.innerHTML =
        this.getAttribute("format") === "utc"
          ? date.toUTCString()
          : date.toLocaleString();
    }

    getTitle() {
      return this.getAttribute("format") === "utc"
        ? "Heure UTC"
        : "Heure locale";
    }
  }
);
