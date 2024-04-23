import { RecipeList, RecipeListBundle } from "./recipeList";

export default class RecipeListStore {
    private static instance: RecipeListStore;
    // Recipe list bundles, keyed by username.
    private bundles: Map<string, RecipeListBundle>;

    private constructor() {
        this.bundles = new Map();
    };

    public static getInstance(): RecipeListStore {
        if (!RecipeListStore.instance) {
            RecipeListStore.instance = new RecipeListStore();
        }
        return RecipeListStore.instance;
    }

    public setBundleForUser(bundle: RecipeListBundle, username: string) {
        this.bundles.set(username, bundle);
    }

    public bundleForUser(username: string) {
        return this.bundles.get(username);
    }

    public listsContainingRecipe(username: string, recipeId: string): Array<RecipeList> {
        const bundle = this.bundleForUser(username);
        if (bundle) {
            return Array.from(bundle.recipeLists.values()).filter(l => l.has(recipeId));
        } else {
            return [];
        }
    }

    public newListForUser(username: string, listName: string, firstRecipeId?: string) {
        let bundle = this.bundleForUser(username);
        if (!bundle) {
            // Trust that the caller knows what it's doing with this username.
            bundle = new RecipeListBundle();
            this.setBundleForUser(bundle, username);
        }
        const newList = new RecipeList();
        newList.name = listName;
        if (firstRecipeId) {
            newList.recipeIds.push(firstRecipeId);
        }
        bundle.recipeLists.set(newList.id, newList);
    }
}