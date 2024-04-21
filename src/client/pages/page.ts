/** @file A common class for pages of the application. */

export default class Page {

    // Performs any necessary steps to load data from the server before rendering this page.
    public load(): Promise<string> {
        const loading = document.createElement('div');
        loading.textContent = 'Loading...';
        document.getElementById('content').replaceChildren(loading);
        return Promise.resolve('');
    }

    // Navigates to this page, replacing the currently viewed page.
    public navigate() {
        this.load().then(data => {
            console.log(globalThis.location.origin + '/' + this.getPath());
            const title = this.getTitle();
            globalThis.document.title = (title ? title + ' | ' : '') + 'Recipe Realm';
            history.pushState({}, '', globalThis.location.origin + '/' + this.getPath());
            document.getElementById('content').replaceChildren(this.render(data));
        })
    }

    // Returns the URL path for this page, for history management purposes.
    // Returns the empty string for the root page.
    public getPath(): string {
        return '';
    }

    // Returns the title of the page, to be used (among others) for the browser tab.
    public getTitle(): string {
        return '';
    }

    // Returns an element containing the page's content.
    public render(data: string): HTMLElement {
        return document.createElement('div');
    }
}