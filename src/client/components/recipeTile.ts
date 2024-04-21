/** @file A component to represent a single recipe without its details. */

import Recipe from "../../model/recipe";
import Component from "./component";

export default class RecipeTile implements Component {
    public readonly recipe: Recipe;

    public constructor(recipe: Recipe) {
        this.recipe = recipe;
    }

    public render(): HTMLElement {
        const container = document.createElement('div');
        container.classList.add('recipe-tile');
        container.innerHTML = `<img src="/img/${this.recipe.id}.jpg" loading="lazy" />
            <span>${this.recipe.name}</span>`;
        return container;
    };
}