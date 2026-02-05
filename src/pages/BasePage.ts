import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page class that provides common functionality for all page objects.
 * All page objects should extend this class.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly pageUrl: string;
  protected abstract readonly pageTitle: string;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async navigateToUrl(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async verifyPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(this.pageTitle);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async verifyUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForElementHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async doubleClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.dblclick();
  }

  async rightClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click({ button: 'right' });
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  async type(locator: Locator, text: string, delay: number = 50): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.pressSequentially(text, { delay });
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) || '';
  }

  async getInputValue(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.inputValue();
  }

  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    await locator.waitFor({ state: 'visible' });
    return await locator.getAttribute(attribute);
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  async hover(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async selectByIndex(locator: Locator, index: number): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption({ index });
  }

  async selectByLabel(locator: Locator, label: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption({ label });
  }

  async check(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.check();
  }

  async uncheck(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.uncheck();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  async getAllTexts(locator: Locator): Promise<string[]> {
    return await locator.allTextContents();
  }

  async focus(locator: Locator): Promise<void> {
    await locator.focus();
  }

  async blur(locator: Locator): Promise<void> {
    await locator.blur();
  }

  async dragAndDrop(source: Locator, target: Locator): Promise<void> {
    await source.dragTo(target);
  }

  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  async acceptDialog(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  async dismissDialog(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });
  }

  async getDialogMessage(): Promise<string> {
    return new Promise((resolve) => {
      this.page.on('dialog', async (dialog) => {
        resolve(dialog.message());
        await dialog.accept();
      });
    });
  }

  async switchToFrame(frameLocator: string): Promise<void> {
    await this.page.frameLocator(frameLocator).locator('body').waitFor();
  }

  async executeScript<T>(script: string): Promise<T> {
    return await this.page.evaluate(script);
  }

  async reloadPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  async clearBrowserStorage(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  async setCookie(name: string, value: string): Promise<void> {
    await this.page.context().addCookies([
      {
        name,
        value,
        url: this.page.url(),
      },
    ]);
  }

  async getCookie(name: string): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    const cookie = cookies.find((c) => c.name === name);
    return cookie?.value;
  }

  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }
}
