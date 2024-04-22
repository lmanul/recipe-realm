import RecipeStore from './recipeStore';
import Recipe from './recipe';
import { expect, test, afterAll } from 'vitest';

afterAll(() => {
    RecipeStore.getInstance().clearAll();
});

test('Recipe store should be a singleton', () => {
    const recipeStore = RecipeStore.getInstance();
    const otherStore = RecipeStore.getInstance();
    expect(recipeStore).toStrictEqual(otherStore);
});

test('Should be able to add and retrieve a recipe', () => {
    const recipeStore = RecipeStore.getInstance();
    expect(recipeStore.getCount()).toBe(0);

    const recipe = new Recipe('Chocolate Lava Cake', undefined, 'https://allrecipes.com/chocchoccholate');
    recipeStore.add(recipe);

    expect(recipeStore.getCount()).toBe(1);
    const retrievedRecipe = recipeStore.getById(recipe.id);
    expect(retrievedRecipe).toBeTruthy();
    expect(retrievedRecipe?.name).toEqual(recipe.name);
});