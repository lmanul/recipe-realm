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
            console.log(this.allRecipes[0]);
        });
    }

    public getCount = (): number => {
        return this.allRecipes.length;
    };
};