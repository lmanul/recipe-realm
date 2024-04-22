import Page from "./page";
import Recipe from "../../model/recipe";
import RecipeBody from "../components/recipeBody";
import RecipeHeader from "../components/recipeHeader";
import RecipeStore from "../../model/recipeStore";

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
        // Get recipe details from the server.
        return super.load().then(() => {
            return fetch('/r/' + this.recipe.id).then(
                response => response.text().then((data) => {
                    this.recipe = Recipe.deserialize(data);
                }));
        });
    }

    public getPath() {
        return '/' + this.recipe.id;
    }

    public getTitle() {
        return this.recipe.name;
    }

    public render() {
        // Populate the store if necessary. Subsequent loads will be instant.
        this.recipeStore.add(this.recipe);
        const page = document.createElement('div');
        page.classList.add('recipe-page');
        page.appendChild(new RecipeHeader(this.recipe).render());
        page.appendChild(new RecipeBody(this.recipe).render());
        return page;
    }
}