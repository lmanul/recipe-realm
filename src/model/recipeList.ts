/**
 * @file Classes to hold user-define recipe lists. A recipe list "bundle"
 * represents all the recipe lists for a given user.
 */

import isClient from '../whereAmI';

const generateId = () => {
    return Math.random().toString(36).slice(-6);
};

export class RecipeList {
    public name: string;
    public recipeIds: Array<string>;
    public readonly id;

    public constructor(id?: string) {
        this.recipeIds = [];
        this.id = id || generateId();
    }

    public add(recipeId: string) {
        if (isClient()) {
            // Let the server know.
            fetch(`/d/addtolist/${this.id}/${recipeId}`);
        }
        // Don't add duplicates.
        const index = this.recipeIds.indexOf(recipeId);
        if (index == -1) {
            this.recipeIds.push(recipeId);
        }
    }

    public remove(recipeId: string) {
        if (isClient()) {
            // Let the server know.
            fetch(`/d/removefromlist/${this.id}/${recipeId}`);
        }
        const index = this.recipeIds.indexOf(recipeId);
        if (index != -1) {
            this.recipeIds.splice(index, 1);
        }
    }

    public serialize() {
        return this.id + '|' + this.name + '|' + this.recipeIds.join('|');
    }

    public static deserialize(canned: string): RecipeList {
        const pieces = canned.split('|');
        const id = pieces.shift();
        const l = new RecipeList(id);
        l.name = pieces.shift();
        while (pieces.length) {
            const recipeId = pieces.shift().trim();
            if (recipeId) {
                l.recipeIds.push(recipeId);
            }
        }
        return l;
    }
}

export class RecipeListBundle {
    public recipeLists: Map<string, RecipeList>;

    public constructor() {
        this.recipeLists = new Map();
    }

    public getListById(listId) {
        return this.recipeLists.get(listId);
    }

    public serialize() {
        return Array.from(this.recipeLists.values()).map(l => l.serialize()).join('#');
    }

    public static deserialize(canned: string): RecipeListBundle {
        const b = new RecipeListBundle();
        if (canned) {
            const listStrings = canned.split('#');
            for (const listStr of listStrings) {
                const l = RecipeList.deserialize(listStr)
                b.recipeLists.set(l.id, l);
            }
        }
        return b;
    }
}