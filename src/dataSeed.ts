import Recipe from './model/recipe';
import RecipeStore from './model/recipeStore';
import { readFile } from "fs/promises";

// Populates our recipe store with data from the on-disk JSON file.
export default () => {
    return readFile('data/recipes.json').catch(err => {
        console.log(err);
    }).then(data => {
        if (data) {
            const recipeStore = RecipeStore.getInstance();
            const recipeObject = JSON.parse(data.toString());
            recipeObject.map(item => {
                recipeStore.add(new Recipe(
                    item.Name, null, item.url, item.Author, item.Description, item.Ingredients, item.Method
                ));
            });
        }
    });
};