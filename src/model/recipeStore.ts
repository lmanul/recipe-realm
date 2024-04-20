import { Recipe } from './recipe';

export class RecipeStore {
    private static instance: RecipeStore;
    private allRecipes: Array<Recipe>;

    private constructor() {};

    public static getInstance(): RecipeStore {
        if (!RecipeStore.instance) {
            RecipeStore.instance = new RecipeStore();
        }
        return RecipeStore.instance;
    }

    public initializeFromStoredData() {
        import('../../data/recipes.json', { assert: { type: "json" } }).then((data) => {
            this.allRecipes = data.default.map((item) => new Recipe(
                item.Name, item.url, item.Description, item.Ingredients, item.Method
            ));
        });
    }

    public getAll = (): Array<Recipe> => {
        return this.allRecipes;
    };

    public getSlice = (start: number, end: number): Array<Recipe> => {
        return this.allRecipes.slice(start, end);
    }

    public getCount = (): number => {
        return this.allRecipes.length;
    };
};