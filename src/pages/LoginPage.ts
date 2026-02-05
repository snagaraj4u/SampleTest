import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sample login page object that can be customized for your application.
 * Update the locators and methods to match your actual login page implementation.
 */
export class LoginPage extends BasePage {
  protected readonly pageUrl = '/login';
  protected readonly pageTitle = 'Login';

  // Form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  // Error and notification elements
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly fieldErrors: Locator;

  // Social login buttons
  readonly googleLoginButton: Locator;
  readonly facebookLoginButton: Locator;
  readonly githubLoginButton: Locator;

  // Loading indicators
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);

    // Update these selectors to match your application
    this.emailInput = page.locator('[data-testid="email-input"], #email, input[name="email"], input[type="email"]');
    this.passwordInput = page.locator('[data-testid="password-input"], #password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"], .login-button');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-me"], #remember-me, input[name="remember"]');
    this.forgotPasswordLink = page.locator('a[href*="forgot"], .forgot-password');
    this.signUpLink = page.locator('a[href*="signup"], a[href*="register"], .signup-link');

    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.successMessage = page.locator('[data-testid="success-message"], .success-message, .alert-success');
    this.fieldErrors = page.locator('.field-error, .validation-error');

    this.googleLoginButton = page.locator('[data-testid="google-login"], .google-login');
    this.facebookLoginButton = page.locator('[data-testid="facebook-login"], .facebook-login');
    this.githubLoginButton = page.locator('[data-testid="github-login"], .github-login');

    this.loadingSpinner = page.locator('.loading, .spinner, [data-testid="loading"]');
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.enterEmail(credentials.email);
    await this.enterPassword(credentials.password);
    await this.clickLogin();
  }

  async loginWithRememberMe(credentials: LoginCredentials): Promise<void> {
    await this.enterEmail(credentials.email);
    await this.enterPassword(credentials.password);
    await this.checkRememberMe();
    await this.clickLogin();
  }

  async enterEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  async checkRememberMe(): Promise<void> {
    const isChecked = await this.isChecked(this.rememberMeCheckbox);
    if (!isChecked) {
      await this.check(this.rememberMeCheckbox);
    }
  }

  async uncheckRememberMe(): Promise<void> {
    const isChecked = await this.isChecked(this.rememberMeCheckbox);
    if (isChecked) {
      await this.uncheck(this.rememberMeCheckbox);
    }
  }

  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  async clickSignUp(): Promise<void> {
    await this.click(this.signUpLink);
  }

  async loginWithGoogle(): Promise<void> {
    await this.click(this.googleLoginButton);
  }

  async loginWithFacebook(): Promise<void> {
    await this.click(this.facebookLoginButton);
  }

  async loginWithGithub(): Promise<void> {
    await this.click(this.githubLoginButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage);
    return await this.getText(this.successMessage);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async isSuccessDisplayed(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  async getFieldErrors(): Promise<string[]> {
    return await this.getAllTexts(this.fieldErrors);
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.loginButton);
  }

  async isLoadingVisible(): Promise<boolean> {
    return await this.isVisible(this.loadingSpinner);
  }

  async waitForLoginComplete(): Promise<void> {
    await this.waitForElementHidden(this.loadingSpinner);
  }

  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async getEmailValue(): Promise<string> {
    return await this.getInputValue(this.emailInput);
  }

  async getPasswordValue(): Promise<string> {
    return await this.getInputValue(this.passwordInput);
  }

  async submitFormWithEnter(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  async isRememberMeChecked(): Promise<boolean> {
    return await this.isChecked(this.rememberMeCheckbox);
  }

  async getEmailPlaceholder(): Promise<string | null> {
    return await this.getAttribute(this.emailInput, 'placeholder');
  }

  async getPasswordPlaceholder(): Promise<string | null> {
    return await this.getAttribute(this.passwordInput, 'placeholder');
  }
}

export default LoginPage;
