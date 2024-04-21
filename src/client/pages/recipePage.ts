import Recipe from "../../model/recipe";
import RecipeStore from "../../model/recipeStore";
import Page from "./page";

export default class RecipePage extends Page {
    private readonly recipe: Recipe;
    public constructor(recipeId: string) {
        super();
        this.recipe = RecipeStore.getInstance().getById(recipeId);
    }

    public getPath() {
        return this.recipe.id;
    }

    public getTitle() {
        return this.recipe.name;
    }

    public render(data: string) {
        const page = document.createElement('div');
        page.textContent = 'Recipe page';
        return page;
    }
}