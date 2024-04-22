import Recipe from './model/recipe';
import { RecipeListBundle } from './model/recipeList';
import RecipeListStore from './model/recipeListStore';
import RecipeStore from './model/recipeStore';
import { readFile } from "fs/promises";

// Populates our recipe store with data from the on-disk JSON file.
export const seedRecipeData = () => {
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

export const seedUserListData = () => {
    return readFile('data/user_lists.txt').catch(err => {
        console.log(err);
    }).then(data => {
        if (data) {
            const store = RecipeListStore.getInstance();
            const lines = data.toString().split('\n');
            for (let line of lines) {
                line = line.trim();
                const [user, bundle = ''] = line.split(':', 2);
                store.setBundleForUser(RecipeListBundle.deserialize(bundle), user);
            }
        }
    });
};