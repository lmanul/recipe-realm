/** @file A component to represent a single recipe without its details. */

import Recipe from "../../model/recipe";
import Component from "./component";
import RecipePage from "../pages/recipePage";

export default class RecipeTile implements Component {
    public readonly recipe: Recipe;
    public readonly allowDelete: boolean;

    public constructor(recipe: Recipe, allowDelete?: boolean) {
        this.recipe = recipe;
        this.allowDelete = !!allowDelete;
    }

    private attachEvents(tile: HTMLElement) {
        // When a tile is clicked, navigate to the corresponding details page.
        tile.addEventListener('click', () => {
            new RecipePage(this.recipe.id).navigate();
        });
    }

    public render(): HTMLElement {
        const tile = document.createElement('div');
        tile.classList.add('recipe-tile');
        tile.innerHTML = `
            <div style="position: relative">
              <img src="/img/${this.recipe.id}.jpg" loading="lazy" />
              ${this.allowDelete ? '<div class="inline-delete" title="Remove">❌</div>' : ''}
            </div>
            <span>${this.recipe.name}</span>
        `;
        this.attachEvents(tile);
        return tile;
    };
}