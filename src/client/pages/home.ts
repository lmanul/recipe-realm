import RecipeStore from "../../model/recipeStore";
import RecipeTile from "../components/recipeTile";
import Page from "./page";

export default class Home extends Page {
    private recipeStore: RecipeStore = RecipeStore.getInstance();

    public render() {
        const page = document.createElement('div');
        const recipeList = document.createElement('div');
        recipeList.classList.add('recipe-list');

        // Render all the recipes we currently have.
        this.recipeStore.getAll().map(recipe => {
            recipeList.appendChild(new RecipeTile(recipe).render());
        });
        page.appendChild(recipeList);
        return page;
    }
}