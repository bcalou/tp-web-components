class ScreenSize extends HTMLElement {
  static observedAttributes = ["unit"];

  connectedCallback() {
    // 0. Passer en mode shadow root si souhaité
    this.attachShadow({ mode: "open" });

    // 1. Récupérer les attributs
    this.unit = this.getAttribute("unit") ?? "px";

    // 2. Générer le squelette
    this.shadowRoot.innerHTML = /* HTML */ `
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
      </p>
      <button>
        <span aria-hidden="true">🔄</span>
        <span class="switchUnit"></span>
      </button>
    `

    // 3. Stocker les éléments nécessaires
    this.$size = this.shadowRoot.querySelector(".size");
    this.$button = this.shadowRoot.querySelector("button");
    this.$switchUnit = this.shadowRoot.querySelector(".switchUnit");

    // 4. Effectuer les rendus initiaux
    this.renderSize();
    this.renderSwitchUnit();

    // 5. Attachez les écouteurs d'événement
    this.$button.addEventListener("click", () => this.onSwitchUnit());

    // Stocker l'appel à renderSize avec bind.this pour pouvoir l'annuler dans
    // le disconnectedCallback()
    this.resizeListener = this.renderSize.bind(this);
    window.addEventListener("resize", this.resizeListener);
  }

  // Quand unit est modifié, on stocke sa valeur et on met à jour le rendu
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "unit") {
      this.unit = newValue;

      this.renderSize();
      this.renderSwitchUnit();
    }
  }

  // On arrête d'écouter le redimensionnement de la fenêtre quand le composant
  // est supprimé
  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeListener);
  }

  // Affichage de la taille en fonction de l'unité
  renderSize() {
    if (this.$size) {
      this.$size.textContent = this.unit === "px"
        ? `${window.innerWidth} px`
        : `${this.getRemSize()} rem`;
    }
  }

  // Affichage de l'autre unité dans le bouton de switch
  renderSwitchUnit() {
    if (this.$switchUnit) {
      this.$switchUnit.textContent = this.unit === "px" ? "rem" : "px";
    }
  }

  // Calcul de la taille de l'écran en REM
  getRemSize() {
    return window.innerWidth
      / parseInt(getComputedStyle(document.body).getPropertyValue("font-size"));
  }

  // Pour changer d'unité, on modifie l'attribut du composant lui-même
  // Cela va déclencher attributeChangedCallback
  onSwitchUnit() {
    this.setAttribute("unit", this.unit === "px" ? "rem" : "px");
  }
}

customElements.define("screen-size", ScreenSize);