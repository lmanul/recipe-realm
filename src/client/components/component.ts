/**
 * @file A common class for components within a page.
 */

export default class Component {
    public render(): HTMLElement {
        return document.createElement('div');
    }
}