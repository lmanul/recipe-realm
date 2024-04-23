import { RecipeListBundle } from "../../model/recipeList";
import RecipeListStore from "../../model/recipeListStore";
import RecipeList from "../components/recipeList";
import Page from "./page";

export default class ListsPage extends Page {

    public constructor() {
        super('/lists', 'My Lists');
    }

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
                            user);
                    });
                }
            });
        });
    }

    public render() {
        const container = document.createElement('div');
        container.innerHTML = `
          <form action="/d/newlist" method="get">
            <input name="listname" autocomplete="off" placeholder="List Name"></input>
            <input name="recipeid" type="hidden"></input>
            <button>➕ New List</button>
          </form>
        `;
        Array.from(RecipeListStore.getInstance().bundleForUser(
                globalThis['user']).recipeLists.values()).map(l => {
            container.appendChild(new RecipeList(l, true /* modifiable */).render());
        })
        return container;
    }
}