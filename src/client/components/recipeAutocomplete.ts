import Component from "./component";
import Recipe from "../../model/recipe";
import RecipeStore from "../../model/recipeStore";

export default class RecipeAutocomplete extends Component {

    readonly MAX_RESULT_COUNT = 10;

    store: RecipeStore;
    inputField: HTMLInputElement;

    public constructor(inputField: HTMLInputElement) {
        super();
        this.inputField = inputField;
        this.store = RecipeStore.getInstance();
    }

    renderRow(contents: string, id: string) {
        return `<div class="autocomplete-row" data-id="${id}">${contents}</div>`;
    }

    reset() {
        this.element.innerHTML = this.renderRow('Type a recipe name', '');
    }

    renderRecipeRow(recipe: Recipe): string {
        return this.renderRow(`
            <img src="${recipe.getImageUrl()}" />
            <span>${recipe.name}</span>
        `, recipe.id);
    }

    showMatches(matches: Array<Recipe>) {
        if (matches.length == 0) {
            this.element.innerHTML = this.renderRow('∅ 🤷',  '');
        } else {
            this.element.innerHTML = matches.map(this.renderRecipeRow.bind(this)).join('');
        }
    }

    search = (event: InputEvent) => {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }
        // Let's not throttle. This is all local, and we don't have that many
        // recipes.
        const query = event.target.value.trim().toLowerCase();
        if (!query) {
            this.reset();
            return;
        }
        const matches: Array<Recipe> = [];
        for (const recipe of this.store.getAll()) {
            if (recipe.name.toLowerCase().includes(query)) {
                matches.push(recipe);
            }
            if (matches.length >= this.MAX_RESULT_COUNT) {
                break;
            }
        }
        this.showMatches(matches);
    };

    attachEvents() {
        this.inputField.addEventListener('input', this.search);
    }

    render() {
        this.element = document.createElement('div');
        this.element.setAttribute('id', 'autocomplete-menu');
        // Attach ourselves to the same parent as the input
        if (this.inputField.parentElement) {
            this.inputField.parentElement.appendChild(this.element);
        }
        this.reset();
        this.attachEvents();
        return this.element;
    }

    destruct() {
        this.inputField.removeEventListener('input', this.search);
        if (this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    }
}