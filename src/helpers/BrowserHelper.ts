import { Page, BrowserContext, Cookie } from '@playwright/test';

/**
 * Helper class for browser-level operations.
 */
export class BrowserHelper {
  private page: Page;
  private context: BrowserContext;

  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
  }

  async openNewTab(url?: string): Promise<Page> {
    const newPage = await this.context.newPage();
    if (url) {
      await newPage.goto(url);
    }
    return newPage;
  }

  async closeCurrentTab(): Promise<void> {
    await this.page.close();
  }

  async switchToTab(index: number): Promise<Page> {
    const pages = this.context.pages();
    if (index < 0 || index >= pages.length) {
      throw new Error(`Tab index ${index} is out of range. Available tabs: ${pages.length}`);
    }
    return pages[index];
  }

  async getTabCount(): Promise<number> {
    return this.context.pages().length;
  }

  async getAllTabUrls(): Promise<string[]> {
    return this.context.pages().map((page) => page.url());
  }

  async closeAllTabsExceptCurrent(): Promise<void> {
    const pages = this.context.pages();
    for (const page of pages) {
      if (page !== this.page) {
        await page.close();
      }
    }
  }

  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  async getViewportSize(): Promise<{ width: number; height: number } | null> {
    return this.page.viewportSize();
  }

  async setGeolocation(latitude: number, longitude: number): Promise<void> {
    await this.context.setGeolocation({ latitude, longitude });
  }

  async setTimezone(timezone: string): Promise<void> {
    await this.context.close();
    throw new Error('Timezone must be set when creating the browser context');
  }

  async setOfflineMode(offline: boolean): Promise<void> {
    await this.context.setOffline(offline);
  }

  async getCookies(urls?: string[]): Promise<Cookie[]> {
    return await this.context.cookies(urls);
  }

  async getCookie(name: string, url?: string): Promise<Cookie | undefined> {
    const cookies = await this.getCookies(url ? [url] : undefined);
    return cookies.find((cookie) => cookie.name === name);
  }

  async setCookies(cookies: Cookie[]): Promise<void> {
    await this.context.addCookies(cookies);
  }

  async setCookie(
    name: string,
    value: string,
    options?: Partial<Omit<Cookie, 'name' | 'value'>>
  ): Promise<void> {
    const cookie: Cookie = {
      name,
      value,
      domain: options?.domain || new URL(this.page.url()).hostname,
      path: options?.path || '/',
      ...options,
    };
    await this.context.addCookies([cookie]);
  }

  async clearCookies(): Promise<void> {
    await this.context.clearCookies();
  }

  async deleteCookie(name: string): Promise<void> {
    const cookies = await this.getCookies();
    const cookieToDelete = cookies.find((c) => c.name === name);
    if (cookieToDelete) {
      await this.context.clearCookies();
      const remainingCookies = cookies.filter((c) => c.name !== name);
      if (remainingCookies.length > 0) {
        await this.setCookies(remainingCookies);
      }
    }
  }

  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
  }

  async removeLocalStorageItem(key: string): Promise<void> {
    await this.page.evaluate((k) => localStorage.removeItem(k), key);
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  async getAllLocalStorageItems(): Promise<Record<string, string>> {
    return await this.page.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = localStorage.getItem(key) || '';
        }
      }
      return items;
    });
  }

  async getSessionStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  }

  async setSessionStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ k, v }) => sessionStorage.setItem(k, v), { k: key, v: value });
  }

  async clearSessionStorage(): Promise<void> {
    await this.page.evaluate(() => sessionStorage.clear());
  }

  async clearAllBrowserData(): Promise<void> {
    await this.clearCookies();
    await this.clearLocalStorage();
    await this.clearSessionStorage();
  }

  async emulateDevice(deviceName: string): Promise<void> {
    throw new Error(`Device emulation for ${deviceName} must be configured in playwright.config.ts`);
  }

  async setUserAgent(userAgent: string): Promise<void> {
    throw new Error('User agent must be set when creating the browser context');
  }

  async injectScript(script: string): Promise<void> {
    await this.page.addScriptTag({ content: script });
  }

  async injectStylesheet(css: string): Promise<void> {
    await this.page.addStyleTag({ content: css });
  }

  async blockRequests(urlPatterns: string[]): Promise<void> {
    await this.page.route(urlPatterns.map((p) => `**/${p}**`).join('|'), (route) => route.abort());
  }

  async mockRequest(url: string, response: { status?: number; body?: string; contentType?: string }): Promise<void> {
    await this.page.route(url, (route) =>
      route.fulfill({
        status: response.status || 200,
        body: response.body || '',
        contentType: response.contentType || 'application/json',
      })
    );
  }

  async captureConsoleMessages(): Promise<string[]> {
    const messages: string[] = [];
    this.page.on('console', (msg) => {
      messages.push(`[${msg.type()}] ${msg.text()}`);
    });
    return messages;
  }

  async getNetworkRequests(): Promise<Array<{ url: string; method: string; status: number }>> {
    const requests: Array<{ url: string; method: string; status: number }> = [];

    this.page.on('response', (response) => {
      requests.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
      });
    });

    return requests;
  }
}

export function createBrowserHelper(page: Page): BrowserHelper {
  return new BrowserHelper(page);
}

export default BrowserHelper;
