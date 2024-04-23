/** @file A common class for components within a page. */

export default class Component {
    element: HTMLElement;

    // Renders this component, and returns its containing element.
    render(): HTMLElement { return null; }

    // Once the DOM part has been set up, attaches event listeners as needed.
    attachEvents() {}

    // Renders this component again and replaces the previously rendered version.
    refresh() {
        if (this.element && this.element.parentElement) {
            const currentEl = this.element;
            const newVersion = this.render();
            currentEl.parentElement.replaceChild(newVersion, currentEl);
        }
    }
}