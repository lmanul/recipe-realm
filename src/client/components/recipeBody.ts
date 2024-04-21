import Component from './component';
import Recipe from '../../model/recipe';

export default class RecipeBody implements Component {

    private readonly recipe: Recipe;

    public constructor(recipe: Recipe) {
        this.recipe = recipe;
    }

    public render() {
        const container = document.createElement('div');
        container.classList.add('recipe-body');
        container.innerHTML = `
            <h3>Method</h3>
            <ol>
              ${this.recipe.method.map(step => '<li>' + step + '</li>').join('\n')}
            </ol>
        `;
        return container;
    }
}