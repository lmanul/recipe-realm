import Recipe from './recipe';
import { expect, test } from 'vitest';

test('Should serialize and deserialize a recipe properly', () => {
    const recipe = new Recipe('Coconut Flan', undefined, 'https://allthingsflan.com/coconut');
    recipe.ingredients = ['1 coconut', '1 flan'];
    recipe.method = ['Place the coconut on the flan.', 'Enjoy!'];

    const serialized = recipe.serialize();
    const deserialized = Recipe.deserialize(serialized);
    const reCanned = deserialized.serialize();

    expect(reCanned).toEqual(serialized);
});