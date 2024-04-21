import Recipe from "../../model/recipe";
import RecipeStore from "../../model/recipeStore";
import Page from "./page";

export default class RecipePage extends Page {
    private recipe: Recipe;
    private readonly recipeStore: RecipeStore = RecipeStore.getInstance();
    public constructor(recipeId: string) {
        super();
        this.recipe = this.recipeStore.getById(recipeId);
    }

    public load() {
        if (this.recipe.hasDetails()) {
            // We already have what we need
            return super.load();
        }
        return super.load().then(() => {
            return fetch('/r/' + this.recipe.id).then(response => response.text());
        });
    }

    public getPath() {
        return this.recipe.id;
    }

    public getTitle() {
        return this.recipe.name;
    }

    public render(data: string) {
        this.recipe = Recipe.deserialize(data);
        console.log(this.recipe);
        // Populate the store if necessary. Subsequent loads will be instant.
        this.recipeStore.add(this.recipe);
        const page = document.createElement('div');
        page.textContent = 'Recipe page ' + this.recipe.ingredients.join('');
        return page;
    }
}