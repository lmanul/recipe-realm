import Component from './component';
import Recipe from '../../model/recipe';

export default class RecipeHeader implements Component {

    private readonly recipe: Recipe;

    public constructor(recipe: Recipe) {
        this.recipe = recipe;
    }

    public render() {
        const header = document.createElement('div');
        header.classList.add('recipe-header');
        header.innerHTML = `
            <img src="/img/${this.recipe.id}.jpg">
            <h2>${this.recipe.name}</h2>
            <span class="recipe-source">
              <a href="${this.recipe.url}" target="_new">By ${this.recipe.author}</a>
            </span>
            <h3>Ingredients</h3>
            <ul>
              ${this.recipe.ingredients.map(ing => '<li>' + ing + '</li>').join('\n')}
            </ul>
        `;
        return header;
    }
}