customElements.define(
  "custom-details",
  class CustomDetails extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: "open" });
      const template = document.getElementById("custom-details").content;
      this.shadowRoot.appendChild(template.cloneNode(true));

      this.$details = this.shadowRoot.querySelector("details");

      this.shadowRoot.addEventListener("focusin", this.open.bind(this));
      this.shadowRoot.addEventListener("mouseover", this.open.bind(this));

      this.shadowRoot.addEventListener("focusout", this.close.bind(this));
      this.shadowRoot.addEventListener("mouseout", this.close.bind(this));

      this.keyDownEventListener = this.onKeyDown.bind(this);
      document.addEventListener("keydown", this.keyDownEventListener);
    }

    disconnectedCallback() {
      document.removeEventListener(this.keyDownEventListener);
    }

    open() {
      this.$details.open = true;
    }

    close() {
      this.$details.open = false;
    }

    onKeyDown(event) {
      if (event.key === "Escape") {
        this.close();
      }
    }
  }
);
