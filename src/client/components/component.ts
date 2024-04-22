/** @file A common class for components within a page. */

export default class Component {
    element: HTMLElement;

    render(): HTMLElement {
        return null;
    }

    attachEvents() {}


    refresh() {
        if (this.element && this.element.parentElement) {
            console.log(this.element);
            const currentEl = this.element;
            const newVersion = this.render();
            currentEl.parentElement.replaceChild(newVersion, currentEl);
        }
    }
}