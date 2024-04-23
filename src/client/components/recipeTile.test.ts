import Recipe from '../../model/recipe';
import RecipeTile from './recipeTile';
import RecipeStore from '../../model/recipeStore';
import { expect, test } from 'vitest';

test('Recipe tile should contain an image and image, but no ingredients or method', () => {
    const recipeId = 'abcd';
    const recipe = new Recipe(
        'The best recipe in the whole world',
        recipeId,
        'https://darkrecipes.com/secret',
        'The Riddler',
        'A mysterious recipe',
        ['no', 'nope', 'nope-nope'],
        ['I ain\'t gonna tell ya, it\'s a secret'],
    );
    const component = new RecipeTile(recipe);

    const rendered = component.render().outerHTML;
    expect(rendered).toContain('<img');
    expect(rendered).toContain('best recipe');
    expect(rendered).not.toContain('nope');
    expect(rendered).not.toContain('gonna tell ya');
});
