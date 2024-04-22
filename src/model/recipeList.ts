/**
 * @file Classes to hold user-define recipe lists. A recipe list "bundle"
 * represents all the recipe lists for a given user.
 */

export class RecipeList {
    public name: string;
    public recipeIds: Array<string>;

    public constructor() {
        this.recipeIds = [];
    }

    public serialize() {
        return this.name + '|' + this.recipeIds.join('|');
    }

    public static deserialize(canned: string): RecipeList {
        const l = new RecipeList();
        const pieces = canned.split('|');
        l.name = pieces.shift();
        while (pieces.length) {
            l.recipeIds.push(pieces.shift());
        }
        return l;
    }
}

export class RecipeListBundle {
    public recipeLists: Array<RecipeList>;

    public constructor() {
        this.recipeLists = [];
    }

    public serialize() {
        return this.recipeLists.map(l => l.serialize()).join('#');
    }

    public static deserialize(canned: string): RecipeListBundle {
        const b = new RecipeListBundle();
        if (canned) {
            const listStrings = canned.split('#');
            for (const listStr of listStrings) {
                b.recipeLists.push(RecipeList.deserialize(listStr));
            }
        }
        return b;
    }
}