import Recipe from '../../model/recipe';
import RecipePage from './recipePage';
import RecipeStore from '../../model/recipeStore';
import { expect, test, afterAll } from 'vitest';

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

    const rendered = page.render();
    expect(rendered.innerHTML).toContain('more butter');
    expect(rendered.innerHTML).toContain('microwave');
});
