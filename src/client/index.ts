import Home from '../client/pages/home';
import Recipe from "../model/recipe";
import RecipeStore from '../model/recipeStore';

// Did we get initial data from the server? If so, populate our store
// with that.

if (globalThis['initialRecipeData']) {
    const recipeStore = RecipeStore.getInstance();
    const recipeStrings = globalThis['initialRecipeData'].split('#');
    for (const recipeString of recipeStrings) {
        const [id, name] = recipeString.split('|');
        const recipe = new Recipe(name, id);
        recipeStore.add(recipe);
    }
}

globalThis.addEventListener('popstate', (data) => {
    // TODO: Handle back navigation properly.
    console.log('State popped', data);
});

new Home().navigate();
