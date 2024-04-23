import Home from '../client/pages/home';
import ListsPage from './pages/listsPage';
import PageStore from './pageStore';
import Recipe from '../model/recipe';
import { RecipeListBundle } from '../model/recipeList';
import RecipeListStore from '../model/recipeListStore';
import RecipePage from './pages/recipePage';
import RecipeStore from '../model/recipeStore';

// Initialize the pages reachable from the nav bar.
const pageStore = PageStore.getInstance();
pageStore.add('/', new Home());
pageStore.add('/lists', new ListsPage());

const recipeStore = RecipeStore.getInstance();

// Did we get initial data from the server? If so, populate our store
// with that.
if (globalThis['recipeListData']) {
    const data = globalThis['recipeListData'];
    const recipeStrings = data.split('#');
    for (const recipeString of recipeStrings) {
        const [id, name] = recipeString.split('|');
        const recipe = new Recipe(name, id);
        recipeStore.add(recipe);
    }
}

// Did we also get user list data? That will only happen if we are logged in.
if (globalThis['userListData'] && globalThis['user']) {
    const data = globalThis['userListData'];
    const user = globalThis['user'];
    RecipeListStore.getInstance().setBundleForUser(
        RecipeListBundle.deserialize(data),
        user);
}

// If we got recipe details data, load the recipe page.
if (globalThis['recipeDetailsData']) {
    const data = globalThis['recipeDetailsData'];
    const recipe = Recipe.deserialize(data);
    recipeStore.add(recipe);
    new RecipePage(recipe.id).navigate();
} else if (globalThis.location.pathname.endsWith('/login')) {
    // The login page is server-side rendered, and we leave it as-is.
} else {
    let pageToLoad = PageStore.getInstance().get(globalThis.location.pathname);
    if (!pageToLoad) {
        console.warn(
            'Could not look up page by path ' + globalThis.location.pathname
        );
    }
    // If we still don't know where to go, load the home page.
    (pageToLoad || new Home()).navigate();
}

// Make nav links work properly.
document.querySelector('nav').addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement) {
        PageStore.getInstance()
            .get(event.target.getAttribute('data-target'))
            .navigate();
    }
});

// Make sure we can navigate with browser buttons.
globalThis.addEventListener('popstate', (event) => {
    PageStore.getInstance().get(event.state.path).navigate();
});
