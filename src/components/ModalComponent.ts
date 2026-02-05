import { Page, Locator } from '@playwright/test';

/**
 * Reusable modal/dialog component for handling popup interactions.
 */
export class ModalComponent {
  private page: Page;
  private modalSelector: string;

  readonly modal: Locator;
  readonly overlay: Locator;
  readonly header: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly body: Locator;
  readonly footer: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page, modalSelector: string = '.modal') {
    this.page = page;
    this.modalSelector = modalSelector;

    this.modal = page.locator(`${modalSelector}, [role="dialog"], .dialog`);
    this.overlay = page.locator('.modal-overlay, .modal-backdrop, .overlay');
    this.header = page.locator(`${modalSelector} .modal-header, ${modalSelector} header`);
    this.title = page.locator(`${modalSelector} .modal-title, ${modalSelector} h2, ${modalSelector} h3`);
    this.closeButton = page.locator(`${modalSelector} .close, ${modalSelector} [aria-label="Close"], ${modalSelector} .modal-close`);
    this.body = page.locator(`${modalSelector} .modal-body, ${modalSelector} .content`);
    this.footer = page.locator(`${modalSelector} .modal-footer, ${modalSelector} footer`);
    this.confirmButton = page.locator(`${modalSelector} .btn-primary, ${modalSelector} .confirm, ${modalSelector} button:has-text("OK")`);
    this.cancelButton = page.locator(`${modalSelector} .btn-secondary, ${modalSelector} .cancel, ${modalSelector} button:has-text("Cancel")`);
  }

  async waitForModal(): Promise<void> {
    await this.modal.waitFor({ state: 'visible' });
  }

  async waitForModalHidden(): Promise<void> {
    await this.modal.waitFor({ state: 'hidden' });
  }

  async isModalOpen(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) || '';
  }

  async getBodyText(): Promise<string> {
    return (await this.body.textContent()) || '';
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.waitForModalHidden();
  }

  async closeByClickingOverlay(): Promise<void> {
    await this.overlay.click({ position: { x: 10, y: 10 } });
    await this.waitForModalHidden();
  }

  async closeByPressingEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.waitForModalHidden();
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getFooterButtons(): Promise<string[]> {
    const buttons = this.footer.locator('button');
    return await buttons.allTextContents();
  }

  async clickFooterButton(buttonText: string): Promise<void> {
    const button = this.footer.locator(`button:has-text("${buttonText}")`);
    await button.click();
  }

  async fillInputInModal(selector: string, value: string): Promise<void> {
    const input = this.body.locator(selector);
    await input.fill(value);
  }

  async getInputValueInModal(selector: string): Promise<string> {
    const input = this.body.locator(selector);
    return await input.inputValue();
  }

  async selectOptionInModal(selector: string, value: string): Promise<void> {
    const select = this.body.locator(selector);
    await select.selectOption(value);
  }

  async checkCheckboxInModal(selector: string): Promise<void> {
    const checkbox = this.body.locator(selector);
    await checkbox.check();
  }

  async isConfirmButtonEnabled(): Promise<boolean> {
    return await this.confirmButton.isEnabled();
  }

  async isConfirmButtonDisabled(): Promise<boolean> {
    return await this.confirmButton.isDisabled();
  }

  async waitForConfirmButtonEnabled(): Promise<void> {
    await this.confirmButton.waitFor({ state: 'visible' });
    while (await this.confirmButton.isDisabled()) {
      await this.page.waitForTimeout(100);
    }
  }
}

export function createModalComponent(page: Page, modalSelector?: string): ModalComponent {
  return new ModalComponent(page, modalSelector);
}

export default ModalComponent;
