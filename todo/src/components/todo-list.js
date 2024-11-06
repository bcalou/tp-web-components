customElements.define("todo-list", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<ul>
      <li>One</li>
      <li>Two</li>
    </ul>`
  }
});
