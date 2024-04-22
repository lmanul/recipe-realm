/** @file A component to represent a single recipe without its details. */

import Recipe from "../../model/recipe";
import Component from "./component";
import RecipePage from "../pages/recipePage";

export default class RecipeTile extends Component {
    public readonly recipe: Recipe;
    public readonly allowDelete: boolean;

    public constructor(recipe: Recipe, allowDelete?: boolean) {
        super();
        this.recipe = recipe;
        this.allowDelete = !!allowDelete;
    }

    attachEvents() {
        // When a tile is clicked, navigate to the corresponding details page.
        this.element.addEventListener('click', () => {
            new RecipePage(this.recipe.id).navigate();
        });
    }

    public render(): HTMLElement {
        this.element = document.createElement('div');
        this.element.classList.add('recipe-tile');
        this.element.innerHTML = `
            <div style="position: relative">
              <img src="/img/${this.recipe.id}.jpg" loading="lazy" />
              ${this.allowDelete
                  ? '<div class="inline-delete" data-recipe="' + this.recipe.id + '" title="Remove">❌</div>'
                  : ''
              }
            </div>
            <span>${this.recipe.name}</span>
        `;
        this.attachEvents();
        return this.element;
    };
}