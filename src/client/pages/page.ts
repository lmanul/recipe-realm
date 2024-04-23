/** @file A common class for pages of the application. */

import PageStore from "../pageStore";

export default class Page {

    // The URL path for this page, for history management purposes
    path: string;
    // The title of the page, to be used (among others) for the browser tab
    title: String;

    public constructor(path: string, title: string) {
        this.path = path;
        this.title = title;
    }

    // Performs any necessary steps to load data from the server before rendering this page.
    public load(): Promise<void> {
        const loading = document.createElement('div');
        loading.textContent = 'Loading...';
        document.getElementById('content').replaceChildren(loading);
        return Promise.resolve();
    }

    // Navigates to this page, replacing the currently viewed page.
    public navigate() {
        this.load().then(() => {
            PageStore.getInstance().add(this.path, this);
            globalThis.document.title = (this.title ? this.title + ' | ' : '') + 'Recipe Realm';
            history.pushState({path: this.path}, '', globalThis.location.origin + this.path);
            document.getElementById('content').replaceChildren(this.render());
            // Potentially update the nav bar. Mark as active the nav item
            // whose target matches where we are now.
            const navItems = document.querySelectorAll('.nav-item');
            for (const navItem of navItems) {
                navItem.classList.toggle('active',
                    navItem.getAttribute('data-target') == this.path);
            }
        })
    }

    // Returns an element containing the page's content.
    public render(): HTMLElement {
        return document.createElement('div');
    }
}