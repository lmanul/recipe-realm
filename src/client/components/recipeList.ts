import Component from "./component";
import { RecipeList as RecipeListModel} from '../../model/recipeList';
import RecipeTile from "./recipeTile";
import RecipeStore from "../../model/recipeStore";

export default class RecipeList implements Component {

    private readonly recipeList;

    public constructor(recipeList: RecipeListModel) {
        this.recipeList = recipeList;
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
        return container;
    }
}