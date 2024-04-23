import { RecipeListBundle } from "../../model/recipeList";
import RecipeListStore from "../../model/recipeListStore";
import RecipeList from "../components/recipeList";
import Page from "./page";

export default class ListsPage extends Page {

    public constructor() {
        super('/lists', 'My Lists');
    }

    public load() {
        // Are we logged in?
        if (!globalThis['user']) {
            globalThis.location.replace('/login');
        }
        // If we are logged in, we already got the list data in the initial page.
        return super.load();
    }

    public render() {
        const container = document.createElement('div');
        container.innerHTML = `
          <form action="/d/newlist" method="get">
            <input name="listname" required autocomplete="off" placeholder="List Name"></input>
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