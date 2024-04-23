/** @file An abstraction to store and manage user custom lists. */

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

    public deleteList(username: string, listId: string) {
        if (isClient()) {
            // Let the server know.
            fetch(`/d/deletelist/${listId}`);
        }
        const bundle = this.bundles.get(username);
        // If the list we want to delete is actually not there, don't make
        // a fuss about it.
        if (bundle && bundle.getListById(listId)) {
            bundle.recipeLists.delete(listId);
        }
    }

    public async newListForUser(username: string, listName: string, listId?: string, firstRecipeId?: string) {
        listId = listId || generateId();

        if (isClient()) {
            // Let the server know. URL-encode the user-provided input.
            fetch(`/d/newlist?listid=${listId}&listname=${encodeURI(listName)}&firstrecipeid=${firstRecipeId || ''}`);
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