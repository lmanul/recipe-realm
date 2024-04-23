import Recipe from '../../model/recipe';
import RecipePage from './recipePage';
import RecipeStore from '../../model/recipeStore';
import { afterAll, expect, test } from 'vitest';

afterAll(() => {
    RecipeStore.getInstance().clearAll();
});

test('Recipe details page should contain ingredients and method', () => {
    const recipeId = 'abcd';
    const recipe = new Recipe(
        'Sweet buttery butter-flavored butter',
        recipeId,
        'https://notyournormaldiet.com/bbbutter',
        'Jack Greasy',
        'Pure decadence',
        ['sugar', 'butter', 'butter', 'more butter', 'side of butter'],
        ['Mix sugar and butter.', 'Melt in microwave.'],
    );
    RecipeStore.getInstance().add(recipe);
    const page = new RecipePage(recipeId);

    const rendered = page.render().outerHTML;
    expect(rendered).toContain('more butter');
    expect(rendered).toContain('microwave');
});