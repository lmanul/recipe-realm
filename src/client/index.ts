import Home from '../client/pages/home';
import Recipe from '../model/recipe';
import RecipeStore from '../model/recipeStore';

const recipeStore = RecipeStore.getInstance();
console.log(recipeStore);

new Home().navigate();
