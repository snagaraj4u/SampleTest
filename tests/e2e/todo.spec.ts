import { test, expect } from '../../src/fixtures';

test.describe('Todo Application Tests', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.navigate();
  });

  test.describe('Adding Todos', () => {
    test('should add a new todo item @smoke', async ({ todoPage }) => {
      const todoText = 'Complete the project documentation';

      await todoPage.addTodo(todoText);

      const todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBe(1);

      const displayedText = await todoPage.getTodoTextAtIndex(0);
      expect(displayedText).toBe(todoText);
    });

    test('should add multiple todo items @regression', async ({ todoPage }) => {
      const todos = [
        'First task',
        'Second task',
        'Third task',
      ];

      await todoPage.addMultipleTodos(todos);

      const todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBe(3);

      const allTexts = await todoPage.getAllTodoTexts();
      expect(allTexts).toEqual(todos);
    });

    test('should not add empty todo items', async ({ todoPage, page }) => {
      await todoPage.fill(todoPage.newTodoInput, '   ');
      await page.keyboard.press('Enter');

      const todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBe(0);
    });

    test('should trim whitespace from todo text', async ({ todoPage }) => {
      const todoWithSpaces = '   Trimmed todo   ';
      const expectedText = 'Trimmed todo';

      await todoPage.addTodo(todoWithSpaces);

      const displayedText = await todoPage.getTodoTextAtIndex(0);
      expect(displayedText.trim()).toBe(expectedText);
    });
  });

  test.describe('Completing Todos', () => {
    test.beforeEach(async ({ todoPage }) => {
      await todoPage.addMultipleTodos(['Task 1', 'Task 2', 'Task 3']);
    });

    test('should mark a todo as completed @smoke', async ({ todoPage }) => {
      await todoPage.toggleTodoAtIndex(0);

      const isCompleted = await todoPage.isTodoCompleted(0);
      expect(isCompleted).toBe(true);
    });

    test('should mark a todo as active again', async ({ todoPage }) => {
      await todoPage.toggleTodoAtIndex(0);
      await todoPage.toggleTodoAtIndex(0);

      const isCompleted = await todoPage.isTodoCompleted(0);
      expect(isCompleted).toBe(false);
    });

    test('should toggle all todos at once @regression', async ({ todoPage }) => {
      await todoPage.toggleAllTodos();

      const completedCount = await todoPage.getCompletedTodosCount();
      expect(completedCount).toBe(3);
    });

    test('should update active items count', async ({ todoPage }) => {
      const initialCount = await todoPage.getActiveItemCount();
      expect(initialCount).toBe(3);

      await todoPage.toggleTodoAtIndex(0);

      const updatedCount = await todoPage.getActiveItemCount();
      expect(updatedCount).toBe(2);
    });
  });

  test.describe('Editing Todos', () => {
    test.beforeEach(async ({ todoPage }) => {
      await todoPage.addTodo('Original todo text');
    });

    test('should edit todo text by double clicking @regression', async ({ todoPage }) => {
      const newText = 'Updated todo text';

      await todoPage.editTodoAtIndex(0, newText);

      const displayedText = await todoPage.getTodoTextAtIndex(0);
      expect(displayedText).toBe(newText);
    });

    test('should cancel edit on escape key', async ({ todoPage, page }) => {
      const originalText = 'Original todo text';

      const todoLabel = todoPage.todoItems.first().locator('label');
      await todoLabel.dblclick();

      const editInput = todoPage.todoItems.first().locator('.edit');
      await editInput.fill('New text that should be cancelled');
      await page.keyboard.press('Escape');

      const displayedText = await todoPage.getTodoTextAtIndex(0);
      expect(displayedText).toBe(originalText);
    });
  });

  test.describe('Deleting Todos', () => {
    test.beforeEach(async ({ todoPage }) => {
      await todoPage.addMultipleTodos(['Task to delete', 'Task to keep']);
    });

    test('should delete a todo item @smoke', async ({ todoPage }) => {
      await todoPage.deleteTodoAtIndex(0);

      const todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBe(1);

      const remainingText = await todoPage.getTodoTextAtIndex(0);
      expect(remainingText).toBe('Task to keep');
    });

    test('should clear all completed todos @regression', async ({ todoPage }) => {
      await todoPage.toggleTodoAtIndex(0);
      await todoPage.clearCompletedTodos();

      const todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBe(1);
    });
  });

  test.describe('Filtering Todos', () => {
    test.beforeEach(async ({ todoPage }) => {
      await todoPage.addMultipleTodos(['Active task', 'Completed task']);
      await todoPage.toggleTodoByText('Completed task');
    });

    test('should filter by active todos', async ({ todoPage }) => {
      await todoPage.filterByActive();

      const visibleCount = await todoPage.getTodoCount();
      expect(visibleCount).toBe(1);
    });

    test('should filter by completed todos @regression', async ({ todoPage }) => {
      await todoPage.filterByCompleted();

      const visibleCount = await todoPage.getTodoCount();
      expect(visibleCount).toBe(1);
    });

    test('should show all todos', async ({ todoPage }) => {
      await todoPage.filterByActive();
      await todoPage.filterByAll();

      const visibleCount = await todoPage.getTodoCount();
      expect(visibleCount).toBe(2);
    });
  });

  test.describe('UI Elements', () => {
    test('should show footer when todos exist', async ({ todoPage }) => {
      await todoPage.addTodo('Sample task');

      const isFooterVisible = await todoPage.isFooterVisible();
      expect(isFooterVisible).toBe(true);
    });

    test('should hide footer when no todos exist', async ({ todoPage }) => {
      const isFooterVisible = await todoPage.isFooterVisible();
      expect(isFooterVisible).toBe(false);
    });

    test('should show clear completed button when completed todos exist @regression', async ({ todoPage }) => {
      await todoPage.addTodo('Task');
      await todoPage.toggleTodoAtIndex(0);

      const isClearVisible = await todoPage.isClearCompletedVisible();
      expect(isClearVisible).toBe(true);
    });

    test('should display correct placeholder text', async ({ todoPage }) => {
      const placeholder = await todoPage.getNewTodoPlaceholder();
      expect(placeholder).toContain('What needs to be done?');
    });
  });
});
