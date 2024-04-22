/** @file A class to represent a single recipe. */

import { sha1 } from "js-sha1";

export default class Recipe {
    private static ID_LENGTH = 6;

    public readonly name: string;
    public readonly id: string;
    public url: string;
    public author: string;
    public description: string;
    public ingredients: Array<string>;
    public method: Array<string>;

    public constructor(name: string, id?: string, url?: string,
          author?: string, description?: string, ingredients?: Array<string>, method?: Array<string>) {
        this.name = name;
        this.url = url;
        this.id = id || this.calculateId();
        this.author = author;
        this.description = description;
        this.ingredients = ingredients;
        this.method = method;
    }

    private calculateId(): string {
        const sha = sha1.create();
        sha.update(this.url);
        return sha.hex().substring(0, Recipe.ID_LENGTH);
    }

    // Returns a representation of this recipe to send over the wire.
    public serialize(summaryOnly?: boolean) {
        let pieces;
        if (summaryOnly) {
            pieces = [this.id, this.name];
        } else {
            pieces = [
                this.name, this.id, this.url, this.author, this.description,
                this.ingredients.join('@'), this.method.join('@')
            ];
        }
        return pieces.join('|');
    }

    // Returns an instance of Recipe deserialized from a string representation.
    public static deserialize(canned: string) {
        const pieces: Array<string> = canned.split('|');
        if (pieces.length == 2) {
            return new Recipe(pieces[1], pieces[0]);
        } else if (pieces.length == 7) {
            return new Recipe(pieces[0], pieces[1], pieces[2], pieces[3], pieces[4],
                pieces[5].split('@'), pieces[6].split('@')
            );
        }
        // Still here? Not cool.
        throw new Error('Could not deserialize ' + canned);
    }

    // Returns whether this object contains all the recipe details (false if
    // we only have the summary). This is only relevant client-side.
    public hasDetails(): boolean {
        // Let's take the list of ingredients as a proxy for all details.
        return this.ingredients?.length > 0;
    }

    // Returns a short textual representation for debugging purposes.
    public toString = (): string => {
        return `<Recipe "${this.name}" (${this.id}),` +
            ` ${this.ingredients.length} ingredients, ` +
            `${this.method.length} steps>`;
    };
}