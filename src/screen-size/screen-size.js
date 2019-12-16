let screenSizeTemplate = document.createElement('template');
screenSizeTemplate.innerHTML = `
  <link rel="stylesheet" href="src/screen-size/screen-size.css">
  
  <h2><slot></slot></h2>
  <p id="size"></p>
`;

class ScreenSize extends HTMLElement {
  constructor() {
    super();

    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(screenSizeTemplate.content.cloneNode(true));

    this.sizeElement = this.shadowRoot.getElementById('size');

    this.attachEvents();
  }

  static get observedAttributes() {
    return ['dimension'];
  }

  attributeChangedCallback(attr, old, val) {
    if (attr === 'dimension') {
      this.dimension = val;
      this.render();
    }
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
  }

  attachEvents() {
    this.onResize = this.render.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  render() {
    if (this.dimension === 'height') {
      this.sizeElement.innerHTML = window.innerHeight + 'px';
    } else {
      this.sizeElement.innerHTML = window.innerWidth + 'px';
    }
  }
}

customElements.define('screen-size', ScreenSize);
