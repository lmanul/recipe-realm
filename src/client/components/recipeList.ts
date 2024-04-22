import Component from "./component";
import RecipeTile from "./recipeTile";
import RecipeStore from "../../model/recipeStore";
import { RecipeList as RecipeListModel} from '../../model/recipeList';

export default class RecipeList implements Component {

    private readonly recipeList;

    public constructor(recipeList: RecipeListModel, id?: string) {
        this.recipeList = recipeList;
    }

    private attachEvents(el: HTMLElement) {
        const deleteButtons = el.querySelectorAll('.inline-delete');
        for (const btn of deleteButtons) {
            btn.addEventListener('click', event => {
                if (event.target instanceof HTMLElement) {
                    const recipeId = event.target.getAttribute('data-recipe');
                    console.log(`TODO, remove recipe ${recipeId} from list ${this.recipeList.id}`);
                    event.stopPropagation();
                }
            });
        }
    }

    public render() {
        const store = RecipeStore.getInstance();
        const container = document.createElement('div');
        container.innerHTML = `
          <h3>${this.recipeList.name}</h3>
        `;
        const tiles = document.createElement('div');
        tiles.classList.add('recipe-list');
        this.recipeList.recipeIds.map(i => store.getById(i)).map(r => {
            tiles.appendChild(new RecipeTile(r, true /* allowDelete */).render());
        });
        container.appendChild(tiles);
        this.attachEvents(container);
        return container;
    }
}