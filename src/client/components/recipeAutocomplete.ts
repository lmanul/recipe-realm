import Component from "./component";
import Recipe from "../../model/recipe";
import RecipeStore from "../../model/recipeStore";
import RecipeList from "./recipeList";

export default class RecipeAutocomplete extends Component {

    readonly MAX_RESULT_COUNT = 10;

    store: RecipeStore;
    // The recipe list component we are currently adding to, or null if not applicable.
    list: RecipeList | null;
    inputField: HTMLInputElement;

    public constructor(inputField: HTMLInputElement, recipeList?: RecipeList) {
        super();
        this.inputField = inputField;
        this.list = recipeList || null;
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
        // Let's not throttle. This is all local (network), and we don't have that many
        // recipes (CPU).
        const query = event.target.value.trim().toLowerCase();
        if (!query) {
            this.reset();
            return;
        }
        // Treat multiple terms as "and".
        const queryTerms = query.includes(' ') ? query.split(' ') : [query];
        const matches: Array<Recipe> = [];
        for (const recipe of this.store.getAll()) {
            const name = recipe.name.toLowerCase();
            if (queryTerms.every(term => name.includes(term))) {
                matches.push(recipe);
            }
            if (matches.length >= this.MAX_RESULT_COUNT) {
                break;
            }
        }
        this.showMatches(matches);
    };

    onMatchSelected(e) {
        this.show(false);
        let currentEl: HTMLElement = e.target;
        while(currentEl && !currentEl.hasAttribute('data-id')) {
            currentEl = currentEl.parentElement;
        }
        const recipeId = currentEl.getAttribute('data-id');
        if (recipeId && this.list) {
            // Notify server
            fetch(`/d/addtolist/${this.list.model.id}/${recipeId}`);
            // Optimistic local update
            this.list.model.add(recipeId);
            this.list.refresh();
        }
    }

    attachEvents() {
        this.inputField.addEventListener('input', this.search);
        this.element.addEventListener('click', (event) => {
            this.onMatchSelected(event);
        });
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

    show(flag: boolean) {
        this.element.style.opacity = flag ? '1' : '0';
    }

    destruct() {
        // Disappear, but only after we've had time to process a click on a match
        this.inputField.removeEventListener('input', this.search);
        if (this.element && this.element.parentElement) {
            globalThis.setTimeout(() => {
                this.element.parentElement.removeChild(this.element);
            }, 100);
        }
    }
}