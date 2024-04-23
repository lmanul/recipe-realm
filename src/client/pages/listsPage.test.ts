import ListsPage from './listsPage';
import { afterAll, expect, test } from 'vitest';

afterAll(() => {
    delete globalThis['user'];
});

test('Lists page should render correctly even if the user has not lists yet', () => {

    globalThis['user'] = 'jackie';
    const rendered = new ListsPage().render();
    expect(rendered.outerHTML).to.contain('<button');
});
