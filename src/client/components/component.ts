/** @file A common interface for components within a page. */

export default interface Component {
    render(): HTMLElement;
}