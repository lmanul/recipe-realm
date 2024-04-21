import Recipe from "../../model/recipe";
import RecipeStore from "../../model/recipeStore";
import RecipeTile from "../recipeTile";

export default class Home {
    private recipeStore: RecipeStore = RecipeStore.getInstance();

    public render(): HTMLElement {
        const page = document.createElement('div');
        const recipeList = document.createElement('div');
        recipeList.classList.add('recipe-list');
        // We got some initial data from the server, let's render that.
        const recipeStrings = globalThis['initialRecipeData'].split('#');
        for (const recipeString of recipeStrings) {
            const [id, name] = recipeString.split('|');
            const recipe = new Recipe(name, id);
            this.recipeStore.add(recipe);
            recipeList.appendChild(new RecipeTile(recipe).render());
        }
        page.appendChild(recipeList);
        return page;
    }
}