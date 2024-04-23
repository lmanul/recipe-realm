/** @file A bare-bones router to help with client-side navigation. */

import Page from "./pages/page";

export default class PageStore {
    private static instance: PageStore;

    private pages: Map<string, Page>;

    private constructor() {
        this.pages = new Map();
    };

    public static getInstance(): PageStore {
        if (!PageStore.instance) {
            PageStore.instance = new PageStore();
        }
        return PageStore.instance;
    }

    public add(key: string, page: Page) {
        this.pages.set(key, page);
    }

    public get(key: string) {
        return this.pages.get(key);
    }
}