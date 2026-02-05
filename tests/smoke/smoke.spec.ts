import { test, expect } from '../../src/fixtures';

/**
 * Smoke tests for quick validation of core functionality.
 * These tests should be fast and cover critical paths.
 */
test.describe('Smoke Tests', () => {
  test('application should load successfully @smoke', async ({ page, todoPage }) => {
    await todoPage.navigate();

    const title = await page.title();
    expect(title).toContain('TodoMVC');
  });

  test('should be able to add a todo item @smoke', async ({ todoPage }) => {
    await todoPage.navigate();

    await todoPage.addTodo('Smoke test todo');

    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);
  });

  test('should be able to complete a todo item @smoke', async ({ todoPage }) => {
    await todoPage.navigate();
    await todoPage.addTodo('Task to complete');

    await todoPage.toggleTodoAtIndex(0);

    const isCompleted = await todoPage.isTodoCompleted(0);
    expect(isCompleted).toBe(true);
  });

  test('should be able to delete a todo item @smoke', async ({ todoPage }) => {
    await todoPage.navigate();
    await todoPage.addTodo('Task to delete');

    await todoPage.deleteTodoAtIndex(0);

    const count = await todoPage.getTodoCount();
    expect(count).toBe(0);
  });

  test('page elements should be interactive @smoke', async ({ todoPage, assertionHelper }) => {
    await todoPage.navigate();

    await assertionHelper.assertElementVisible(todoPage.newTodoInput);
    await assertionHelper.assertElementEnabled(todoPage.newTodoInput);

    const placeholder = await todoPage.getNewTodoPlaceholder();
    expect(placeholder).toBeTruthy();
  });
});
