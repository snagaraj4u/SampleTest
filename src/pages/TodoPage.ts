import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface TodoItem {
  title: string;
  completed: boolean;
}

/**
 * Page object representing the Todo MVC application.
 * This serves as a sample implementation that can be replaced with your actual application pages.
 */
export class TodoPage extends BasePage {
  protected readonly pageUrl = '/';
  protected readonly pageTitle = 'TodoMVC';

  // Locators
  readonly newTodoInput: Locator;
  readonly todoList: Locator;
  readonly todoItems: Locator;
  readonly toggleAll: Locator;
  readonly clearCompletedButton: Locator;
  readonly todoCount: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;
  readonly footer: Locator;
  readonly mainSection: Locator;

  constructor(page: Page) {
    super(page);

    this.newTodoInput = page.locator('.new-todo');
    this.todoList = page.locator('.todo-list');
    this.todoItems = page.locator('.todo-list li');
    this.toggleAll = page.locator('.toggle-all');
    this.clearCompletedButton = page.locator('.clear-completed');
    this.todoCount = page.locator('.todo-count');
    this.filterAll = page.locator('a[href="#/"]');
    this.filterActive = page.locator('a[href="#/active"]');
    this.filterCompleted = page.locator('a[href="#/completed"]');
    this.footer = page.locator('.footer');
    this.mainSection = page.locator('.main');
  }

  async addTodo(todoText: string): Promise<void> {
    await this.fill(this.newTodoInput, todoText);
    await this.pressKey('Enter');
  }

  async addMultipleTodos(todos: string[]): Promise<void> {
    for (const todo of todos) {
      await this.addTodo(todo);
    }
  }

  async getTodoCount(): Promise<number> {
    return await this.getElementCount(this.todoItems);
  }

  async getTodoTextAtIndex(index: number): Promise<string> {
    const todoLabel = this.todoItems.nth(index).locator('label');
    return await this.getText(todoLabel);
  }

  async getAllTodoTexts(): Promise<string[]> {
    return await this.todoItems.locator('label').allTextContents();
  }

  async toggleTodoAtIndex(index: number): Promise<void> {
    const checkbox = this.todoItems.nth(index).locator('.toggle');
    await this.click(checkbox);
  }

  async toggleTodoByText(todoText: string): Promise<void> {
    const todoItem = this.todoItems.filter({ hasText: todoText });
    const checkbox = todoItem.locator('.toggle');
    await this.click(checkbox);
  }

  async toggleAllTodos(): Promise<void> {
    await this.click(this.toggleAll);
  }

  async deleteTodoAtIndex(index: number): Promise<void> {
    const todoItem = this.todoItems.nth(index);
    await this.hover(todoItem);
    const deleteButton = todoItem.locator('.destroy');
    await this.click(deleteButton);
  }

  async deleteTodoByText(todoText: string): Promise<void> {
    const todoItem = this.todoItems.filter({ hasText: todoText });
    await this.hover(todoItem);
    const deleteButton = todoItem.locator('.destroy');
    await this.click(deleteButton);
  }

  async editTodoAtIndex(index: number, newText: string): Promise<void> {
    const todoLabel = this.todoItems.nth(index).locator('label');
    await this.doubleClick(todoLabel);

    const editInput = this.todoItems.nth(index).locator('.edit');
    await editInput.fill(newText);
    await this.pressKey('Enter');
  }

  async editTodoByText(originalText: string, newText: string): Promise<void> {
    const todoItem = this.todoItems.filter({ hasText: originalText });
    const todoLabel = todoItem.locator('label');
    await this.doubleClick(todoLabel);

    const editInput = todoItem.locator('.edit');
    await editInput.fill(newText);
    await this.pressKey('Enter');
  }

  async cancelEditTodo(index: number): Promise<void> {
    await this.pressKey('Escape');
  }

  async clearCompletedTodos(): Promise<void> {
    if (await this.isVisible(this.clearCompletedButton)) {
      await this.click(this.clearCompletedButton);
    }
  }

  async filterByAll(): Promise<void> {
    await this.click(this.filterAll);
  }

  async filterByActive(): Promise<void> {
    await this.click(this.filterActive);
  }

  async filterByCompleted(): Promise<void> {
    await this.click(this.filterCompleted);
  }

  async getActiveItemCount(): Promise<number> {
    const countText = await this.getText(this.todoCount);
    const match = countText.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async isTodoCompleted(index: number): Promise<boolean> {
    const todoItem = this.todoItems.nth(index);
    const classAttribute = await this.getAttribute(todoItem, 'class');
    return classAttribute?.includes('completed') || false;
  }

  async isTodoCompletedByText(todoText: string): Promise<boolean> {
    const todoItem = this.todoItems.filter({ hasText: todoText });
    const classAttribute = await this.getAttribute(todoItem, 'class');
    return classAttribute?.includes('completed') || false;
  }

  async getCompletedTodosCount(): Promise<number> {
    return await this.todoItems.filter({ has: this.page.locator('.toggle:checked') }).count();
  }

  async getActiveTodosCount(): Promise<number> {
    const total = await this.getTodoCount();
    const completed = await this.getCompletedTodosCount();
    return total - completed;
  }

  async isFooterVisible(): Promise<boolean> {
    return await this.isVisible(this.footer);
  }

  async isMainSectionVisible(): Promise<boolean> {
    return await this.isVisible(this.mainSection);
  }

  async isClearCompletedVisible(): Promise<boolean> {
    return await this.isVisible(this.clearCompletedButton);
  }

  async getNewTodoPlaceholder(): Promise<string | null> {
    return await this.getAttribute(this.newTodoInput, 'placeholder');
  }

  async getTodoItemsData(): Promise<TodoItem[]> {
    const count = await this.getTodoCount();
    const items: TodoItem[] = [];

    for (let i = 0; i < count; i++) {
      const title = await this.getTodoTextAtIndex(i);
      const completed = await this.isTodoCompleted(i);
      items.push({ title, completed });
    }

    return items;
  }

  async markAllAsCompleted(): Promise<void> {
    const activeCount = await this.getActiveTodosCount();
    if (activeCount > 0) {
      await this.toggleAllTodos();
    }
  }

  async markAllAsActive(): Promise<void> {
    const completedCount = await this.getCompletedTodosCount();
    const totalCount = await this.getTodoCount();
    if (completedCount === totalCount && totalCount > 0) {
      await this.toggleAllTodos();
    }
  }
}

export default TodoPage;
