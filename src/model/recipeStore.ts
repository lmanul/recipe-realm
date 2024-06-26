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

    public add(recipe: Recipe) {
        const existing = this.allRecipes.get(recipe.id);
        // If we already have this recipe and all its details,
        // don't do anything.
        if (!existing || !existing.hasDetails) {
            this.allRecipes.set(recipe.id, recipe);
        }
    }

    // Returns an array of all the recipes we have.
    public getAll(): Array<Recipe> {
        return Array.from(this.allRecipes.values());
    }

    public getSlice = (start: number, end: number): Array<Recipe> => {
        return this.getAll().slice(start, end);
    }

    public getById(recipeId: string) {
        return this.allRecipes.get(recipeId);
    }

    public getCount(): number {
        return this.allRecipes.size;
    }

    public clearAll() {
        this.allRecipes = new Map();
    }
}