class ScreenSize extends HTMLElement {
  constructor() {
    super();
    this.unit = "px";

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          display: flex;
          align-items: center;
          right: 0.5rem;
          top: 0.5rem;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.7);
          padding-inline: 0.5rem;
        }
      </style>

      <p>
        <span aria-hidden="true">↔</span>
        <span class="size"></span>
        <span class="unit"></span>
      </p>
      <button>
        <span aria-hidden="true">🔄</span>
        <span class="switchUnit"></span>
      </button>
    `;

    this.$size = this.shadowRoot.querySelector(".size");
    this.$unit = this.shadowRoot.querySelector(".unit");
    this.$switch = this.shadowRoot.querySelector("button");
    this.$switchUnit = this.shadowRoot.querySelector(".switchUnit");

    this.render();

    this.resizeEventListener = this.render.bind(this);
    window.addEventListener("resize", this.resizeEventListener);

    this.$switch.addEventListener("click", this.onSwitch.bind(this));
  }

  static get observedAttributes() {
    return ["unit"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "unit") {
      this.unit = newVal === "rem" ? "rem" : "px";
    }

    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeEventListener);
  }

  render() {
    this.$unit.innerHTML = this.unit;
    this.$switchUnit.innerHTML = this.unit === "rem" ? "px" : "rem";
    this.renderSize();
  }

  renderSize() {
    this.$size.innerHTML =
      this.unit === "rem" ? this.getRemSize() : window.innerWidth;
  }

  getRemSize() {
    return (
      window.innerWidth /
      parseInt(getComputedStyle(document.body).getPropertyValue("font-size"))
    );
  }

  onSwitch() {
    this.unit = this.unit === "rem" ? "px" : "rem";
    this.render();
  }
}

customElements.define("screen-size", ScreenSize);
