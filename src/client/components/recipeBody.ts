import Component from './component';
import Recipe from '../../model/recipe';

export default class RecipeBody extends Component {

    private readonly recipe: Recipe;

    public constructor(recipe: Recipe) {
        super();
        this.recipe = recipe;
    }

    public render() {
        this.element = document.createElement('div');
        this.element.classList.add('recipe-body');
        this.element.innerHTML = `
            <h3>Method</h3>
            <ol>
              ${this.recipe.method.map(step => '<li>' + step + '</li>').join('\n')}
            </ol>
        `;
        return this.element;
    }
}