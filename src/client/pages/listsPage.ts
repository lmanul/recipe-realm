import { RecipeListBundle } from "../../model/recipeList";
import RecipeListStore from "../../model/recipeListStore";
import Page from "./page";

export default class ListsPage extends Page {

    public load() {
        return super.load().then(() => {
            return fetch('/d/lists').then(response => {
                if (response.redirected) {
                    // We need to log in first.
                    globalThis.location.href = '/login';
                } else {
                    return response.text().then(data => {
                        const user = globalThis['user'];
                        RecipeListStore.getInstance().setBundleForUser(
                            RecipeListBundle.deserialize(data),
                            user
                        );
                    });
                }
            });
        });
    }

    public render() {
        const container = document.createElement('div');
        return container;
    }

    public getPath(): string {
        return '/lists';
    }

    public getTitle(): string {
        return 'My Lists';
    }
}