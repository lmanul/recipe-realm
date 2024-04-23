/** @file A component to display a user-defined list of recipes. */

import Component from "./component";
import RecipeAutocomplete from "./recipeAutocomplete";
import RecipeListStore from "../../model/recipeListStore";
import RecipeTile from "./recipeTile";
import RecipeStore from "../../model/recipeStore";
import { escape } from 'html-escaper';
import { RecipeList as RecipeListModel} from '../../model/recipeList';

export default class RecipeList extends Component {

    private readonly modifiable;
    private autocomplete: RecipeAutocomplete | null;
    model: RecipeListModel;

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

        if (this.modifiable) {
            // Delete button
            this.element.querySelector('.delete-btn')?.addEventListener('click', () => {
                // Modal dialogs can be annoying, but for a destructive action, I like them.
                if (globalThis.confirm('Are you sure?')) {
                    RecipeListStore.getInstance().deleteList(globalThis['user'], this.model.id);
                    this.model = null;
                    this.refresh();
                }
            });

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
    }

    public render() {
        if (!this.model) {
            // We just got deleted.
            this.element.outerHTML = '';
            return this.element;
        }
        const store = RecipeStore.getInstance();
        this.element = document.createElement('div');
        this.element.classList.add('recipe-list-and-name');
        // List names are the only thing for which we allow actual
        // user-provided text. Be a little careful.
        this.element.innerHTML = `<h3 class="recipe-list-name">${escape(this.model.name)}</h3>`;
        if (this.modifiable) {
            this.element.innerHTML += `
                <button class="delete-btn">🗑️ Delete list</button>
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