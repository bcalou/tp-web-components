class CurrentTime extends HTMLElement {
  static observedAttributes = ["format"];

  connectedCallback() {
    // 1. Récupérer les attributs
    this.format = this.getAttribute("format");

    // 2. Générer le squelette
    this.innerHTML = /* HTML */ `
      <div class="currentTime">
        <p class="currentTime__title"></p>
        <time class="currentTime__time"></time>
      </div>
    `

    // 3. Stocker les éléments nécessaires
    this.$title = this.querySelector("p");
    this.$time = this.querySelector("time");

    // 4. Effectuer / planifier les rendus
    this.renderTitle();

    this.interval = setInterval(() => this.renderTime(), 1000);
    this.renderTime();
  }

  // Quand format est modifié, on stocke sa valeur et on met à jour le rendu
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "format") {
      this.format = newValue;

      this.renderTitle();
    }
  }

  // Désactiver l'interval récurrent lorsque le composant disparaît
  disconnectedCallback() {
    clearInterval(this.interval);
  }

  // Affichage du titre en fonction du format
  renderTitle() {
    if (this.$title) {
      this.$title.textContent = this.format === "utc"
        ? "Heure UTC"
        : "Heure locale";
    }
  }

  // Affichage de la date/heure en fonction du format
  renderTime() {
    if (this.$time) {
      this.$time.textContent = this.format === "utc"
        ? new Date().toUTCString()
        : new Date().toLocaleString();
    }
  }
}

customElements.define("current-time", CurrentTime);