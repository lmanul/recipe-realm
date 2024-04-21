import Page from "./page";

export default class ListsPage extends Page {

    public load() {
        return super.load().then(() => {
            return fetch('/d/lists').then(data => {
                console.log(data);
            });
        });
    }

    public render() {
        const container = document.createElement('div');
        return container;
    }

    public getPath(): string {
        return 'lists';
    }

    public getTitle(): string {
        return 'My Lists';
    }
}