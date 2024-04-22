import RecipeList from "./recipeList";

export default class RecipeListStore {
    private static instance: RecipeListStore;
    // Recipe lists, keyed by username.
    private lists: Map<string, Array<RecipeList>>;

    private constructor() {
        this.lists = new Map();
    };

    public static getInstance(): RecipeListStore {
        if (!RecipeListStore.instance) {
            RecipeListStore.instance = new RecipeListStore();
        }
        return RecipeListStore.instance;
    }
}