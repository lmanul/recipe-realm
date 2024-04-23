import Component from './component';
import Recipe from '../../model/recipe';
import RecipeListStore from '../../model/recipeListStore';
import { RecipeList, RecipeListBundle } from '../../model/recipeList';

export default class RecipeHeader extends Component {

    private readonly recipe: Recipe;

    public constructor(recipe: Recipe) {
        super();
        this.recipe = recipe;
    }

    attachEvents() {
        const dropdown = this.element.querySelector('#add-to-dropdown');
        if (dropdown) {
          dropdown.addEventListener('change', event => {
            if (!(event.target instanceof HTMLSelectElement)) {
              return;
            }
            const store = RecipeListStore.getInstance();
            const selected = event.target.selectedOptions[0];
            const user = globalThis['user'];
            if (selected?.hasAttribute('name')) {
              const listId = selected.getAttribute('name');
              if (listId == 'new') {
                let name = '';
                while(!name.trim()) {
                  name = prompt('Name for the new list?');
                }
                store.newListForUser(user, name, undefined, this.recipe.id);
              } else {
                store.bundleForUser(user).getListById(listId).add(this.recipe.id);
              }
              this.refresh();
            }
          });
        }
    }

    public render() {
        const user = globalThis['user'];
        const store = RecipeListStore.getInstance();
        // Get lists that contain this recipe and lists that don't.
        let haveIt: Array<RecipeList> = [];
        let dontHaveIt: Array<RecipeList> = [];
        if (user) {
          const allLists: RecipeListBundle = store.bundleForUser(user);
          if (allLists) {
            for (const l of allLists.recipeLists.values()) {
              (l.has(this.recipe.id) ? haveIt : dontHaveIt).push(l);
            }
          }
        }
        this.element = document.createElement('div');
        this.element.classList.add('recipe-header');
        this.element.innerHTML = `
            <img src="/img/${this.recipe.id}.jpg" />
            <div class="recipe-header-text">
              <h2>${this.recipe.name}</h2>
              <span class="recipe-source">
                <a href="${this.recipe.url}" target="_new">by ${this.recipe.author}</a>
              </span>
              ${
                // If logged in, show lists that have this recipe, and offer
                // to add it to lists that don't.
                user ? `
                  <div id="recipe-inclusion">
                    ${haveIt.map(l => '<span>' + l.name + '</span>').join('')}
                    <select id="add-to-dropdown">
                      <option>Add to...</option>
                      ${dontHaveIt.map(l => `<option name=${l.id}>${l.name}</option>`).join('')}
                      <option name="new">New List</option>
                    </select>
                  </div>`
                : ''
              }
              <div>${this.recipe.description}</div>
              <h3>Ingredients</h3>
              <ul>
                ${this.recipe.ingredients.map(ing => '<li>' + ing + '</li>').join('\n')}
              </ul>
            </div>
        `;
        this.attachEvents();
        return this.element;
    }
}