/**
 * @file A singleton repository of recipes. Note that this is used on both the
 *     server and the client, but the data may be partial on the client side.
*/

import Recipe from './recipe';

export default class RecipeStore {
    private static instance: RecipeStore;
    // All of our recipes, keyed by ID
    private allRecipes: Map<string, Recipe>;

    private constructor() {
        this.allRecipes = new Map();
    };

    public static getInstance(): RecipeStore {
        if (!RecipeStore.instance) {
            RecipeStore.instance = new RecipeStore();
        }
        return RecipeStore.instance;
    }

    public initializeFromStoredData() {
        import('../../data/recipes.json', { assert: { type: "json" } }).then((data) => {
            const allRecipes: Array<Recipe> = data.default.map((item) => new Recipe(
                item.Name, null, item.url, item.Description, item.Ingredients, item.Method
            ));
            for (const recipe of allRecipes) {
                this.add(recipe);
            }
        });
    }

    public add(recipe: Recipe) {
        if (!this.allRecipes.has(recipe.id)) {
            this.allRecipes.set(recipe.id, recipe);
        }
    };

    public getAll(): Array<Recipe> {
        return Array.from(this.allRecipes.values());
    };

    public getSlice = (start: number, end: number): Array<Recipe> => {
        return this.getAll().slice(start, end);
    }

    public getCount(): number {
        return this.allRecipes.size;
    };
};