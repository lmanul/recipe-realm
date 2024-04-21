import Home from '../client/pages/home';
import Recipe from "../model/recipe";
import RecipePage from './pages/recipePage';
import RecipeStore from '../model/recipeStore';
import PageStore from './pageStore';

// Did we get initial data from the server? If so, populate our store
// with that.

if (globalThis['initialRecipeData']) {
    const data = globalThis['initialRecipeData'];
    const recipeStore = RecipeStore.getInstance();
    // TODO: Nicer page-store-like mechanism to distinguish pages.
    if (data.includes('#')) {
        const recipeStrings = globalThis['initialRecipeData'].split('#');
        for (const recipeString of recipeStrings) {
            const [id, name] = recipeString.split('|');
            const recipe = new Recipe(name, id);
            recipeStore.add(recipe);
        }
        new Home().navigate();
    } else {
        const recipe = Recipe.deserialize(data);
        recipeStore.add(recipe);
        new RecipePage(recipe.id).navigate();
    }
}

globalThis.addEventListener('popstate', (event) => {
    PageStore.getInstance().get(event.state.path).navigate();
});
