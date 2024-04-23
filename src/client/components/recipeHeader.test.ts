import Recipe from '../../model/recipe';
import RecipeListStore from '../../model/recipeListStore';
import RecipeStore from '../../model/recipeStore';
import { afterAll, expect, test } from 'vitest';
import RecipeHeader from './recipeHeader';

afterAll(() => {
    RecipeStore.getInstance().clearAll();
    delete globalThis['user'];
});

test('Recipe header should provide list-related info and options', () => {
    const user = 'eugene';
    globalThis['user'] = user;
    const recipeId = 'abcd';
    const recipe = new Recipe(
        'Sweet buttery butter-flavored butter',
        recipeId,
        'https://notyournormaldiet.com/bbbutter',
        'Jack Greasy',
        'Pure decadence',
        [],
        [],
    );
    RecipeStore.getInstance().add(recipe);
    const listStore = RecipeListStore.getInstance();

    // These two lists contain this recipe.
    listStore.newListForUser(user, 'A', recipeId);
    listStore.newListForUser(user, 'B', recipeId);

    // Those two do not.
    listStore.newListForUser(user, 'Y');
    listStore.newListForUser(user, 'Z');

    const rendered = new RecipeHeader(recipe).render();

    // We show the lists that contain this recipe.
    const tags = rendered.querySelectorAll('#recipe-inclusion span');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent).toBe('A');
    expect(tags[1].textContent).toBe('B');

    // We offer to add it to lists that don't contain it.
    const options = rendered.querySelectorAll('#add-to-dropdown option');
    expect(options).toHaveLength(4);
    expect(options[0].textContent).toBe('Add to...');
    expect(options[1].textContent).toBe('Y');
    expect(options[2].textContent).toBe('Z');
    expect(options[3].getAttribute('name')).toBe('new');
});