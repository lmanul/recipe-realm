/**
 * @file A common class for pages of the application.
 */

export default class Page {
    public navigate() {
        document.getElementById('content').replaceChildren(this.render());
    }
    public render() {
        return document.createElement('div');
    }
}