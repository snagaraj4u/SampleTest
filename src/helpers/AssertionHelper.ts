import { Page, Locator, expect } from '@playwright/test';

/**
 * Custom assertion helper class with extended validation methods.
 */
export class AssertionHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertElementVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  async assertElementHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden();
  }

  async assertElementEnabled(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeEnabled();
  }

  async assertElementDisabled(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeDisabled();
  }

  async assertElementText(locator: Locator, expectedText: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveText(expectedText);
  }

  async assertElementContainsText(locator: Locator, expectedText: string, message?: string): Promise<void> {
    await expect(locator, message).toContainText(expectedText);
  }

  async assertElementValue(locator: Locator, expectedValue: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveValue(expectedValue);
  }

  async assertElementAttribute(
    locator: Locator,
    attribute: string,
    expectedValue: string | RegExp,
    message?: string
  ): Promise<void> {
    await expect(locator, message).toHaveAttribute(attribute, expectedValue);
  }

  async assertElementClass(locator: Locator, expectedClass: string | RegExp, message?: string): Promise<void> {
    await expect(locator, message).toHaveClass(expectedClass);
  }

  async assertElementCount(locator: Locator, expectedCount: number, message?: string): Promise<void> {
    await expect(locator, message).toHaveCount(expectedCount);
  }

  async assertElementChecked(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeChecked();
  }

  async assertElementNotChecked(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).not.toBeChecked();
  }

  async assertPageTitle(expectedTitle: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveTitle(expectedTitle);
  }

  async assertPageUrl(expectedUrl: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(expectedUrl);
  }

  async assertUrlContains(urlPart: string, message?: string): Promise<void> {
    const currentUrl = this.page.url();
    expect(currentUrl, message).toContain(urlPart);
  }

  async assertElementFocused(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeFocused();
  }

  async assertElementEmpty(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeEmpty();
  }

  async assertElementsTextArray(locator: Locator, expectedTexts: string[], message?: string): Promise<void> {
    await expect(locator, message).toHaveText(expectedTexts);
  }

  async assertElementCssProperty(
    locator: Locator,
    property: string,
    expectedValue: string,
    message?: string
  ): Promise<void> {
    await expect(locator, message).toHaveCSS(property, expectedValue);
  }

  async assertElementEditable(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeEditable();
  }

  async assertInputPlaceholder(locator: Locator, expectedPlaceholder: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveAttribute('placeholder', expectedPlaceholder);
  }

  async assertElementInViewport(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeInViewport();
  }

  async assertElementNotInViewport(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).not.toBeInViewport();
  }

  async assertScreenshot(
    locator: Locator,
    name: string,
    options?: { maxDiffPixels?: number; threshold?: number }
  ): Promise<void> {
    await expect(locator).toHaveScreenshot(name, options);
  }

  async assertPageScreenshot(
    name: string,
    options?: { maxDiffPixels?: number; threshold?: number }
  ): Promise<void> {
    await expect(this.page).toHaveScreenshot(name, options);
  }

  async softAssertElementVisible(locator: Locator): Promise<boolean> {
    try {
      await expect(locator).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async softAssertElementText(locator: Locator, expectedText: string): Promise<boolean> {
    try {
      await expect(locator).toHaveText(expectedText, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

export function createAssertionHelper(page: Page): AssertionHelper {
  return new AssertionHelper(page);
}

export default AssertionHelper;
