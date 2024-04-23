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

    attachEvents(container) {
        const newListButton = container.querySelector('#list-add-button');
        newListButton.addEventListener('click', () => {
            const store = RecipeListStore.getInstance();
            const user = globalThis['user'];
            const name = container.querySelector('#list-add-input').value;
            if (name && user) {
                store.newListForUser(user, name);
                this.navigate();  // Local page refresh
            }
        });
    }

    public render() {
        const store = RecipeListStore.getInstance();
        const container = document.createElement('div');
        container.innerHTML = `
          <input placeholder="List Name" id="list-add-input" autocomplete="off"></input>
          <button id="list-add-button">➕ New List</button>
        `;
        Array.from(store.bundleForUser(
                globalThis['user']).recipeLists.values()).map(l => {
            container.appendChild(new RecipeList(l, true /* modifiable */).render());
        })
        this.attachEvents(container);
        return container;
    }
}