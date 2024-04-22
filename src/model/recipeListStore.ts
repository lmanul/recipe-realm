import { RecipeListBundle } from "./recipeList";

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
}