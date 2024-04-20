import crypto from "crypto";

export class Recipe {
    private static ID_LENGTH = 6;

    private name: string;
    private url: string;
    private id: string;
    private author: string;
    private description: string;
    private ingredients: Array<string>;
    private method: Array<string>;

    public constructor(name: string, url: string, description: string, ingredients: Array<string>, method: Array<string>) {
        this.name = name;
        this.url = url;
        this.id = this.calculateId();
        this.description = description;
        this.ingredients = ingredients;
        this.method = method;
    }

    private calculateId = (): string => {
        const sha = crypto.createHash('sha1');
        sha.update(this.url);
        return sha.digest('hex').substring(0, Recipe.ID_LENGTH);
    }

    // Returns a short textual representation for debugging purposes.
    public toString = (): string => {
        return `<Recipe "${this.name}" (${this.id}),` +
            ` ${this.ingredients.length} ingredients, ` +
            `${this.method.length} steps>`;
    };
}