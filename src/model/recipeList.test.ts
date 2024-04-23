import createFetchMock from 'vitest-fetch-mock';
import { RecipeList, RecipeListBundle } from './recipeList';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';

const fetchMocker = createFetchMock(vi);

beforeAll(() => {
    fetchMocker.enableMocks();
});


afterAll(() => {
    fetchMocker.dontMock();
});

test('Should deserialize an empty string to an empty bundle', () => {
    const bundle = RecipeListBundle.deserialize('');
    expect(bundle.recipeLists.size).toBe(0);
});

test('Should deserialize a list with only a name to an empty recipe list', () => {
    const list = RecipeList.deserialize('abcd|Awesome Recipes|');
    expect(list.recipeIds.length).toBe(0);
});

test('Should serialize and deserialize a recipe list properly', () => {
    const list = new RecipeList('xyz0');
    list.add('abcd');
    list.add('1234');
    list.add('wxyz');

    const serialized = list.serialize();
    const deserialized = RecipeList.deserialize(serialized);
    const reCanned = deserialized.serialize();

    expect(reCanned).toEqual(serialized);
});