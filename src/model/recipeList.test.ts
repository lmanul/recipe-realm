import { RecipeListBundle } from './recipeList';
import { expect, test } from 'vitest';

test('Should deserialize an empty string to an empty bundle', () => {
    const bundle = RecipeListBundle.deserialize('');
    expect(bundle.recipeLists.length).toBe(0);
});