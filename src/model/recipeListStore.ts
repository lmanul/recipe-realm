import isClient from "../whereAmI";
import { RecipeList, RecipeListBundle } from "./recipeList";

const generateId = () => {
    return Math.random().toString(36).slice(-6);
};

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

    public async newListForUser(username: string, listName: string, listId?: string, firstRecipeId?: string) {
        listId = listId || generateId();

        if (isClient()) {
            // Let the server know.
            // TODO: encode user-provided name
            fetch(`/d/newlist?listid=${listId}&listname=${listName}&firstrecipeid=${firstRecipeId || ''}`);
         }
         let bundle = this.bundleForUser(username);
         if (!bundle) {
             // Trust that the caller knows what it's doing with this username.
             bundle = new RecipeListBundle();
             this.setBundleForUser(bundle, username);
         }
         const newList = new RecipeList(listId);
         newList.name = listName;
         if (firstRecipeId) {
             newList.recipeIds.push(firstRecipeId);
         }
         bundle.recipeLists.set(newList.id, newList);
     }
}