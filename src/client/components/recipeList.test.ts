import createFetchMock from 'vitest-fetch-mock';
import RecipeListStore from '../../model/recipeListStore';
import RecipeStore from '../../model/recipeStore';
import RecipeHeader from './recipeHeader';
import RecipeList from './recipeList';
import Recipe from '../../model/recipe';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { vi } from 'vitest';
import { RecipeList as RecipeListModel } from '../../model/recipeList';

const fetchMocker = createFetchMock(vi);

beforeAll(() => {
    fetchMocker.enableMocks();
});

afterAll(() => {
    RecipeStore.getInstance().clearAll();
    delete globalThis['user'];
    fetchMocker.dontMock();
});

test('User-provided recipe list name should be properly escaped', () => {
    const user = 'eugene';
    globalThis['user'] = user;

    const model = new RecipeListModel('abcd');
    model.name = '<big></i>HA I GOT YOU</i>/big>';

    const rendered = new RecipeList(model).render().outerHTML;
    expect(rendered).not.contains('<big>');
    expect(rendered).not.contains('</i>');
    expect(rendered).contains('&lt;big&gt;');
    expect(rendered).contains('&lt;/i&gt;');
});