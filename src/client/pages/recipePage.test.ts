import Recipe from '../../model/recipe';
import RecipePage from './recipePage';
import RecipeStore from '../../model/recipeStore';
import { afterAll, expect, test } from 'vitest';

afterAll(() => {
    RecipeStore.getInstance().clearAll();
});

const sampleRecipe = new Recipe(
    'Sweet buttery butter-flavored butter',
    'abcd',
    'https://notyournormaldiet.com/bbbutter',
    'Jack Greasy',
    'Pure decadence',
    ['sugar', 'butter', 'butter', 'more butter', 'side of butter'],
    ['Mix sugar and butter.', 'Melt in microwave.'],
);

test('Recipe details page should contain ingredients and method', () => {
    RecipeStore.getInstance().add(sampleRecipe);
    const page = new RecipePage(sampleRecipe.id);

    const rendered = page.render().outerHTML;
    expect(rendered).toContain('more butter');
    expect(rendered).toContain('microwave');
});

test('Recipe details page should render correctly even if the user has no lists yet', () => {

    globalThis['user'] = 'jackie';
    RecipeStore.getInstance().add(sampleRecipe);
    const page = new RecipePage(sampleRecipe.id).render();

    expect(page.outerHTML).to.contain('<div');
});
