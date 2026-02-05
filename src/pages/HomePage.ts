import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Sample home page object that can be customized for your application.
 * Update the locators and methods to match your actual home page implementation.
 */
export class HomePage extends BasePage {
  protected readonly pageUrl = '/';
  protected readonly pageTitle = 'Home';

  // Navigation elements
  readonly navbar: Locator;
  readonly logo: Locator;
  readonly navLinks: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly userMenu: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly logoutButton: Locator;

  // Main content elements
  readonly mainContent: Locator;
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroDescription: Locator;
  readonly ctaButton: Locator;

  // Feature sections
  readonly featuresSection: Locator;
  readonly featureCards: Locator;

  // Footer elements
  readonly footer: Locator;
  readonly footerLinks: Locator;
  readonly socialLinks: Locator;
  readonly copyrightText: Locator;

  // Common UI elements
  readonly notificationBanner: Locator;
  readonly cookieConsent: Locator;
  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.navbar = page.locator('nav, .navbar, [data-testid="navbar"]');
    this.logo = page.locator('.logo, [data-testid="logo"], .brand');
    this.navLinks = page.locator('nav a, .nav-link');
    this.searchInput = page.locator('[data-testid="search-input"], .search-input, input[type="search"]');
    this.searchButton = page.locator('[data-testid="search-button"], .search-button');
    this.userMenu = page.locator('[data-testid="user-menu"], .user-menu, .dropdown-toggle');
    this.loginLink = page.locator('a[href*="login"], .login-link');
    this.signupLink = page.locator('a[href*="signup"], a[href*="register"], .signup-link');
    this.logoutButton = page.locator('[data-testid="logout"], .logout, button:has-text("Logout")');

    // Main content
    this.mainContent = page.locator('main, .main-content, [data-testid="main-content"]');
    this.heroSection = page.locator('.hero, [data-testid="hero"], .hero-section');
    this.heroTitle = page.locator('.hero h1, .hero-title');
    this.heroDescription = page.locator('.hero p, .hero-description');
    this.ctaButton = page.locator('.cta-button, [data-testid="cta"], .hero button');

    // Features
    this.featuresSection = page.locator('.features, [data-testid="features"], #features');
    this.featureCards = page.locator('.feature-card, [data-testid="feature-card"]');

    // Footer
    this.footer = page.locator('footer, .footer');
    this.footerLinks = page.locator('footer a');
    this.socialLinks = page.locator('.social-links a, [data-testid="social-link"]');
    this.copyrightText = page.locator('.copyright, footer p');

    // Common UI
    this.notificationBanner = page.locator('.notification-banner, [data-testid="notification"]');
    this.cookieConsent = page.locator('.cookie-consent, [data-testid="cookie-banner"]');
    this.acceptCookiesButton = page.locator('.accept-cookies, [data-testid="accept-cookies"]');
  }

  async clickLogo(): Promise<void> {
    await this.click(this.logo);
  }

  async navigateToSection(sectionName: string): Promise<void> {
    const link = this.navLinks.filter({ hasText: sectionName });
    await this.click(link);
  }

  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.click(this.searchButton);
  }

  async searchWithEnter(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.pressKey('Enter');
  }

  async openUserMenu(): Promise<void> {
    await this.click(this.userMenu);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginLink);
  }

  async clickSignup(): Promise<void> {
    await this.click(this.signupLink);
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.click(this.logoutButton);
  }

  async clickCTA(): Promise<void> {
    await this.click(this.ctaButton);
  }

  async getHeroTitle(): Promise<string> {
    return await this.getText(this.heroTitle);
  }

  async getHeroDescription(): Promise<string> {
    return await this.getText(this.heroDescription);
  }

  async getFeatureCount(): Promise<number> {
    return await this.getElementCount(this.featureCards);
  }

  async getFeatureCardText(index: number): Promise<string> {
    return await this.getText(this.featureCards.nth(index));
  }

  async getAllFeatureTexts(): Promise<string[]> {
    return await this.getAllTexts(this.featureCards);
  }

  async getNavigationLinks(): Promise<string[]> {
    return await this.getAllTexts(this.navLinks);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.userMenu);
  }

  async isLoginLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.loginLink);
  }

  async scrollToFeatures(): Promise<void> {
    await this.scrollToElement(this.featuresSection);
  }

  async scrollToFooter(): Promise<void> {
    await this.scrollToElement(this.footer);
  }

  async getFooterLinks(): Promise<string[]> {
    return await this.getAllTexts(this.footerLinks);
  }

  async getCopyrightText(): Promise<string> {
    return await this.getText(this.copyrightText);
  }

  async getSocialLinksCount(): Promise<number> {
    return await this.getElementCount(this.socialLinks);
  }

  async clickSocialLink(index: number): Promise<void> {
    await this.click(this.socialLinks.nth(index));
  }

  async acceptCookies(): Promise<void> {
    if (await this.isVisible(this.cookieConsent)) {
      await this.click(this.acceptCookiesButton);
    }
  }

  async dismissNotification(): Promise<void> {
    if (await this.isVisible(this.notificationBanner)) {
      const closeButton = this.notificationBanner.locator('.close, button');
      if (await closeButton.isVisible()) {
        await this.click(closeButton);
      }
    }
  }

  async isNotificationVisible(): Promise<boolean> {
    return await this.isVisible(this.notificationBanner);
  }

  async getNotificationText(): Promise<string> {
    return await this.getText(this.notificationBanner);
  }

  async isNavbarSticky(): Promise<boolean> {
    const position = await this.navbar.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });
    return position === 'fixed' || position === 'sticky';
  }

  async waitForHeroAnimation(): Promise<void> {
    await this.page.waitForTimeout(500);
    await this.waitForElement(this.heroSection);
  }
}

export default HomePage;
