import { test as base, Page } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { createLogger, Logger } from '../utils/Logger';
import { createWaitUtils, WaitUtils } from '../utils/WaitUtils';
import { createAssertionHelper, AssertionHelper } from '../helpers/AssertionHelper';
import { createBrowserHelper, BrowserHelper } from '../helpers/BrowserHelper';
import { NavigationComponent } from '../components/NavigationComponent';
import { ModalComponent } from '../components/ModalComponent';
import { TableComponent } from '../components/TableComponent';

/**
 * Custom test fixtures that extend Playwright's base test.
 * These fixtures provide initialized page objects and utilities for tests.
 */

interface PageFixtures {
  todoPage: TodoPage;
  loginPage: LoginPage;
  homePage: HomePage;
}

interface UtilityFixtures {
  logger: Logger;
  waitUtils: WaitUtils;
  assertionHelper: AssertionHelper;
  browserHelper: BrowserHelper;
}

interface ComponentFixtures {
  navigationComponent: NavigationComponent;
  modalComponent: ModalComponent;
  tableComponent: TableComponent;
}

type CustomFixtures = PageFixtures & UtilityFixtures & ComponentFixtures;

export const test = base.extend<CustomFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await use(todoPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  logger: async ({}, use, testInfo) => {
    const logger = createLogger(testInfo.title);
    logger.testStart(testInfo.title);
    await use(logger);
    logger.testEnd(testInfo.title, testInfo.status || 'passed');
  },

  waitUtils: async ({ page }, use) => {
    const waitUtils = createWaitUtils(page);
    await use(waitUtils);
  },

  assertionHelper: async ({ page }, use) => {
    const assertionHelper = createAssertionHelper(page);
    await use(assertionHelper);
  },

  browserHelper: async ({ page }, use) => {
    const browserHelper = createBrowserHelper(page);
    await use(browserHelper);
  },

  navigationComponent: async ({ page }, use) => {
    const navigation = new NavigationComponent(page);
    await use(navigation);
  },

  modalComponent: async ({ page }, use) => {
    const modal = new ModalComponent(page);
    await use(modal);
  },

  tableComponent: async ({ page }, use) => {
    const table = new TableComponent(page);
    await use(table);
  },
});

export { expect } from '@playwright/test';

/**
 * Custom test hook that runs before each test.
 * Add any global setup logic here.
 */
test.beforeEach(async ({ page, logger }) => {
  logger.info('Starting test execution');
});

/**
 * Custom test hook that runs after each test.
 * Add any cleanup or reporting logic here.
 */
test.afterEach(async ({ page, logger }, testInfo) => {
  if (testInfo.status === 'failed') {
    logger.error(`Test failed: ${testInfo.title}`, { error: testInfo.error?.message });

    const screenshotPath = `reports/screenshots/${testInfo.title.replace(/\s+/g, '_')}_failure.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    logger.info(`Screenshot saved: ${screenshotPath}`);
  }

  logger.info('Test execution completed');
});

/**
 * Helper function to create a test with automatic page navigation.
 */
export function createTestWithNavigation(pageUrl: string) {
  return test.extend({
    page: async ({ page }, use) => {
      await page.goto(pageUrl);
      await use(page);
    },
  });
}

/**
 * Test with authenticated user session.
 * Extend this for tests that require login.
 */
export const authenticatedTest = test.extend({
  page: async ({ page, browserHelper }, use) => {
    await browserHelper.setLocalStorageItem('auth_token', 'test_token');
    await browserHelper.setCookie('session_id', 'test_session');
    await use(page);
  },
});

export default test;
