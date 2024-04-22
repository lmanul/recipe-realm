import Home from '../client/pages/home';
import ListsPage from './pages/listsPage';
import PageStore from './pageStore';
import Recipe from "../model/recipe";
import RecipePage from './pages/recipePage';
import RecipeStore from '../model/recipeStore';

// Initialize the pages reachable from the nav bar.
const pageStore = PageStore.getInstance();
pageStore.add('/', new Home());
pageStore.add('lists', new ListsPage());

// Did we get initial data from the server? If so, populate our store
// with that.

if (globalThis['recipeListData']) {
    const data = globalThis['recipeListData'];
    const recipeStore = RecipeStore.getInstance();
    const recipeStrings = data.split('#');
    for (const recipeString of recipeStrings) {
        const [id, name] = recipeString.split('|');
        const recipe = new Recipe(name, id);
        recipeStore.add(recipe);
    }

    // TODO: Nicer page-store-like mechanism to distinguish pages.
    if (globalThis['recipeDetailsData']) {
        const data = globalThis['recipeDetailsData'];
        const recipe = Recipe.deserialize(data);
        recipeStore.add(recipe);
        new RecipePage(recipe.id).navigate();
    } else {
        new Home().navigate();
    }
}


document.querySelector('nav').addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement) {
        PageStore.getInstance().get(event.target.getAttribute('data-target')).navigate();
    }
});

globalThis.addEventListener('popstate', (event) => {
    PageStore.getInstance().get(event.state.path).navigate();
});
