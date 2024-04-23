import Component from "./component";
import RecipeAutocomplete from "./recipeAutocomplete";
import RecipeTile from "./recipeTile";
import RecipeStore from "../../model/recipeStore";
import RecipeListStore from "../../model/recipeListStore";
import { RecipeList as RecipeListModel} from '../../model/recipeList';

export default class RecipeList extends Component {

    private readonly recipeList;
    private readonly modifiable;
    private autocomplete: RecipeAutocomplete | null;

    public constructor(recipeList: RecipeListModel, modifiable?: boolean) {
        super();
        this.recipeList = recipeList;
        this.modifiable = !!modifiable;
    }

    attachEvents() {
        // Recipe individual Remove buttons
        const deleteButtons = this.element.querySelectorAll('.inline-delete');
        for (const btn of deleteButtons) {
            btn.addEventListener('click', event => {
                if (event.target instanceof HTMLElement) {
                    const recipeId = event.target.getAttribute('data-recipe');
                    // Notify server
                    fetch(`/d/removefromlist/${this.recipeList.id}/${recipeId}`);
                    // Optimistic local update: remove this recipe from the list
                    const arrayToMutate = RecipeListStore.getInstance().bundleForUser(
                        globalThis['user']).recipeLists.get(this.recipeList.id).recipeIds;
                    const index = arrayToMutate.indexOf(recipeId);
                    if (index > -1) {
                        arrayToMutate.splice(index, 1);
                    }
                    // Don't bubble up.
                    event.stopPropagation();
                    this.refresh();
                }
            });
        }

        // Recipe addition autocomplete
        const input: HTMLInputElement = this.element.querySelector('.add-recipe-input');
        input.addEventListener('focus', () => {
            this.autocomplete = new RecipeAutocomplete(input);
            this.autocomplete.render();
        });
        input.addEventListener('blur', () => {
            this.autocomplete.destruct();
            this.autocomplete = null;
        });
    }

    public render() {
        const store = RecipeStore.getInstance();
        this.element = document.createElement('div');
        this.element.classList.add('recipe-list-and-name');
        this.element.innerHTML = `
          <h3 class="recipe-list-name">${this.recipeList.name}</h3>
        `;
        if (this.modifiable) {
            this.element.innerHTML += `
                <div><input class="add-recipe-input" placeholder="➕ Add recipe"></input></div>
            `;
        }
        const tiles = document.createElement('div');
        tiles.classList.add('recipe-list');
        this.recipeList.recipeIds.map(i => store.getById(i)).map(r => {
            tiles.appendChild(new RecipeTile(r, this.modifiable /* allowDelete */).render());
        });
        this.element.appendChild(tiles);
        this.attachEvents();
        return this.element;
    }
}