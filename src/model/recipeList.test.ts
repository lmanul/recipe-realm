import { RecipeList, RecipeListBundle } from './recipeList';
import { expect, test } from 'vitest';

test('Should deserialize an empty string to an empty bundle', () => {
    const bundle = RecipeListBundle.deserialize('');
    expect(bundle.recipeLists.size).toBe(0);
});

test('Should deserialize a list with only a name to an empty recipe list', () => {
    const list = RecipeList.deserialize('abcd|Awesome Recipes|');
    expect(list.recipeIds.length).toBe(0);
});