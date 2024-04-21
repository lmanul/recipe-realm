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

    public constructor(name: string, id?: string, url?: string, description?: string, ingredients?: Array<string>, method?: Array<string>) {
        this.name = name;
        this.url = url;
        this.id = id || this.calculateId();
        this.description = description;
        this.ingredients = ingredients;
        this.method = method;
    }

    private calculateId = (): string => {
        const sha = sha1.create();
        sha.update(this.url);
        return sha.hex().substring(0, Recipe.ID_LENGTH);
    }

    // Returns a short textual representation for debugging purposes.
    public toString = (): string => {
        return `<Recipe "${this.name}" (${this.id}),` +
            ` ${this.ingredients.length} ingredients, ` +
            `${this.method.length} steps>`;
    };
}