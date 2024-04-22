import Recipe from './model/recipe';
import RecipeStore from './model/recipeStore';
import { readFile } from "fs";

// Populates our recipe store with data from the on-disk JSON file.
export default () => {
    const recipeStore = RecipeStore.getInstance();
    readFile('data/recipes.json', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const recipeObject = JSON.parse(data.toString());
            recipeObject.map(item => {
                recipeStore.add(new Recipe(
                    item.Name, null, item.url, item.Author, item.Description, item.Ingredients, item.Method
                ));
            });
        }
    });
};