import Component from "./component";
import RecipeTile from "./recipeTile";
import RecipeStore from "../../model/recipeStore";
import RecipeListStore from "../../model/recipeListStore";
import { RecipeList as RecipeListModel} from '../../model/recipeList';

export default class RecipeList extends Component {

    private readonly recipeList;

    public constructor(recipeList: RecipeListModel, id?: string, modifiable?: boolean) {
        super();
        this.recipeList = recipeList;
    }

    attachEvents() {
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
    }

    public render() {
        const store = RecipeStore.getInstance();
        this.element = document.createElement('div');
        this.element.classList.add('recipe-list-and-name');
        this.element.innerHTML = `
          <h3 class="recipe-list-name">${this.recipeList.name}</h3>
          <form action="/d/addtolist" method="get">
            <input placeholder="Recipe name"></input>
            <button class="add-to-list-button">➕ Add recipe</button>
          </form>
        `;
        const tiles = document.createElement('div');
        tiles.classList.add('recipe-list');
        this.recipeList.recipeIds.map(i => store.getById(i)).map(r => {
            tiles.appendChild(new RecipeTile(r, true /* allowDelete */).render());
        });
        this.element.appendChild(tiles);
        this.attachEvents();
        return this.element;
    }
}