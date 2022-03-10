class HeadContainer extends HTMLElement {
    connectedCallback() {
        this.render()
    }

    render() {
        this.innerHTML = `<div class="container"><h1>Cry-Market</h1></div>`;
    }
}
customElements.define("head-container", HeadContainer);