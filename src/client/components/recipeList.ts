import Component from "./component";
import RecipeAutocomplete from "./recipeAutocomplete";
import RecipeTile from "./recipeTile";
import RecipeStore from "../../model/recipeStore";
import RecipeListStore from "../../model/recipeListStore";
import { RecipeList as RecipeListModel} from '../../model/recipeList';

export default class RecipeList extends Component {

    private readonly modifiable;
    private autocomplete: RecipeAutocomplete | null;
    readonly model: RecipeListModel;

    public constructor(recipeList: RecipeListModel, modifiable?: boolean) {
        super();
        this.model = recipeList;
        this.modifiable = !!modifiable;
    }

    attachEvents() {
        // Recipe individual Remove buttons
        const deleteButtons = this.element.querySelectorAll('.inline-delete');
        for (const btn of deleteButtons) {
            btn.addEventListener('click', event => {
                if (event.target instanceof HTMLElement) {
                    const recipeId = event.target.getAttribute('data-recipe');
                    this.model.remove(recipeId);
                    // Don't bubble up.
                    event.stopPropagation();
                    this.refresh();
                }
            });
        }

        // Recipe addition autocomplete
        const input: HTMLInputElement = this.element.querySelector('.add-recipe-input');
        input.addEventListener('focus', () => {
            if (!this.element.querySelector('.autocomplete-menu')) {
              this.autocomplete = new RecipeAutocomplete(input, this);
              this.autocomplete.render();
            }
            this.autocomplete.show(true);
        });
        input.addEventListener('blur', () => {
            // Hide after a short delay
            globalThis.setTimeout(() => this.autocomplete.show(false), 300);
        });
    }

    public render() {
        const store = RecipeStore.getInstance();
        this.element = document.createElement('div');
        this.element.classList.add('recipe-list-and-name');
        this.element.innerHTML = `<h3 class="recipe-list-name">${this.model.name}</h3>`;
        if (this.modifiable) {
            this.element.innerHTML += `
                <div class="add-recipe">
                    <input class="add-recipe-input" placeholder="➕ Add recipe"></input>
                </div>
            `;
        }
        const tiles = document.createElement('div');
        tiles.classList.add('recipe-list');
        this.model.recipeIds.map(i => store.getById(i)).map(r => {
            tiles.appendChild(new RecipeTile(r, this.modifiable /* allowDelete */).render());
        });
        this.element.appendChild(tiles);
        this.attachEvents();
        return this.element;
    }
}