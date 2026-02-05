import { Page, Locator, expect } from '@playwright/test';

/**
 * Utility class providing advanced wait mechanisms for test automation.
 */
export class WaitUtils {
  private page: Page;
  private defaultTimeout: number;

  constructor(page: Page, defaultTimeout: number = 30000) {
    this.page = page;
    this.defaultTimeout = defaultTimeout;
  }

  async waitForPageLoadComplete(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForNetworkIdle(timeout?: number): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: timeout || this.defaultTimeout });
  }

  async waitForDomContentLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForElementVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeout || this.defaultTimeout });
  }

  async waitForElementHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout: timeout || this.defaultTimeout });
  }

  async waitForElementAttached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: timeout || this.defaultTimeout });
  }

  async waitForElementDetached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'detached', timeout: timeout || this.defaultTimeout });
  }

  async waitForUrlContains(urlPart: string, timeout?: number): Promise<void> {
    await this.page.waitForURL(`**/*${urlPart}*`, { timeout: timeout || this.defaultTimeout });
  }

  async waitForUrlEquals(url: string, timeout?: number): Promise<void> {
    await this.page.waitForURL(url, { timeout: timeout || this.defaultTimeout });
  }

  async waitForUrlRegex(pattern: RegExp, timeout?: number): Promise<void> {
    await this.page.waitForURL(pattern, { timeout: timeout || this.defaultTimeout });
  }

  async waitForRequest(urlOrPredicate: string | RegExp | ((request: Request) => boolean)): Promise<void> {
    await this.page.waitForRequest(urlOrPredicate);
  }

  async waitForResponse(
    urlOrPredicate: string | RegExp | ((response: Response) => boolean),
    timeout?: number
  ): Promise<Response> {
    return await this.page.waitForResponse(urlOrPredicate, { timeout: timeout || this.defaultTimeout });
  }

  async waitForApiResponse(endpoint: string, method: string = 'GET'): Promise<Response> {
    return await this.page.waitForResponse(
      (response) => response.url().includes(endpoint) && response.request().method() === method
    );
  }

  async waitForTextVisible(text: string, timeout?: number): Promise<void> {
    await this.page.locator(`text=${text}`).waitFor({
      state: 'visible',
      timeout: timeout || this.defaultTimeout,
    });
  }

  async waitForTextHidden(text: string, timeout?: number): Promise<void> {
    await this.page.locator(`text=${text}`).waitFor({
      state: 'hidden',
      timeout: timeout || this.defaultTimeout,
    });
  }

  async waitForSelectorCount(selector: string, expectedCount: number, timeout?: number): Promise<void> {
    const locator = this.page.locator(selector);
    await expect(locator).toHaveCount(expectedCount, { timeout: timeout || this.defaultTimeout });
  }

  async waitForFunction<T>(
    fn: () => T | Promise<T>,
    expectedValue: T,
    timeout?: number
  ): Promise<void> {
    const startTime = Date.now();
    const maxTime = timeout || this.defaultTimeout;

    while (Date.now() - startTime < maxTime) {
      const result = await fn();
      if (result === expectedValue) {
        return;
      }
      await this.page.waitForTimeout(100);
    }

    throw new Error(`Condition not met within ${maxTime}ms`);
  }

  async waitForAnimation(locator: Locator, timeout?: number): Promise<void> {
    const element = locator;
    await element.waitFor({ state: 'visible', timeout: timeout || this.defaultTimeout });

    await this.page.evaluate(async (selector) => {
      const el = document.querySelector(selector);
      if (el) {
        await Promise.all(
          el.getAnimations().map((animation) => animation.finished)
        );
      }
    }, await element.evaluate((el) => {
      const id = el.id || `temp-${Math.random().toString(36).substring(7)}`;
      el.id = id;
      return `#${id}`;
    }));
  }

  async retryUntilSuccess<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          await this.page.waitForTimeout(delayMs);
        }
      }
    }

    throw lastError || new Error('Action failed after retries');
  }

  async waitForStableElement(locator: Locator, stabilityMs: number = 500): Promise<void> {
    await locator.waitFor({ state: 'visible' });

    let previousBoundingBox = await locator.boundingBox();
    let stableStartTime = Date.now();

    while (Date.now() - stableStartTime < stabilityMs) {
      await this.page.waitForTimeout(50);
      const currentBoundingBox = await locator.boundingBox();

      if (
        !previousBoundingBox ||
        !currentBoundingBox ||
        previousBoundingBox.x !== currentBoundingBox.x ||
        previousBoundingBox.y !== currentBoundingBox.y ||
        previousBoundingBox.width !== currentBoundingBox.width ||
        previousBoundingBox.height !== currentBoundingBox.height
      ) {
        stableStartTime = Date.now();
        previousBoundingBox = currentBoundingBox;
      }
    }
  }
}

export function createWaitUtils(page: Page, defaultTimeout?: number): WaitUtils {
  return new WaitUtils(page, defaultTimeout);
}

export default WaitUtils;
