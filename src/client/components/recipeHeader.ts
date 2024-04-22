import Component from './component';
import Recipe from '../../model/recipe';

export default class RecipeHeader extends Component {

    private readonly recipe: Recipe;

    public constructor(recipe: Recipe) {
        super();
        this.recipe = recipe;
    }

    public render() {
        this.element = document.createElement('div');
        this.element.classList.add('recipe-header');
        this.element.innerHTML = `
            <img src="/img/${this.recipe.id}.jpg" />
            <div class="recipe-header-text">
              <h2>${this.recipe.name}</h2>
              <span class="recipe-source">
                <a href="${this.recipe.url}" target="_new">by ${this.recipe.author}</a>
              </span>
              <h3>Ingredients</h3>
              <ul>
                ${this.recipe.ingredients.map(ing => '<li>' + ing + '</li>').join('\n')}
              </ul>
            </div>
        `;
        return this.element;
    }
}