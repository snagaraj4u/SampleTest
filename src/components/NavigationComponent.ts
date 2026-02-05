import { Page, Locator } from '@playwright/test';

/**
 * Reusable navigation component that can be used across multiple pages.
 */
export class NavigationComponent {
  private page: Page;

  readonly navbar: Locator;
  readonly logo: Locator;
  readonly menuItems: Locator;
  readonly hamburgerMenu: Locator;
  readonly mobileMenu: Locator;
  readonly searchToggle: Locator;
  readonly searchInput: Locator;
  readonly userDropdown: Locator;
  readonly notificationIcon: Locator;
  readonly notificationBadge: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navbar = page.locator('nav, .navbar, header');
    this.logo = page.locator('.logo, .brand, [data-testid="logo"]');
    this.menuItems = page.locator('.nav-item, .menu-item, nav a');
    this.hamburgerMenu = page.locator('.hamburger, .menu-toggle, [data-testid="hamburger"]');
    this.mobileMenu = page.locator('.mobile-menu, .nav-mobile');
    this.searchToggle = page.locator('.search-toggle, [data-testid="search-toggle"]');
    this.searchInput = page.locator('.nav-search input, [data-testid="nav-search"]');
    this.userDropdown = page.locator('.user-dropdown, [data-testid="user-dropdown"]');
    this.notificationIcon = page.locator('.notification-icon, [data-testid="notifications"]');
    this.notificationBadge = page.locator('.notification-badge, [data-testid="notification-badge"]');
    this.cartIcon = page.locator('.cart-icon, [data-testid="cart"]');
    this.cartBadge = page.locator('.cart-badge, [data-testid="cart-badge"]');
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async navigateTo(menuText: string): Promise<void> {
    const menuItem = this.menuItems.filter({ hasText: menuText });
    await menuItem.click();
  }

  async getMenuItems(): Promise<string[]> {
    return await this.menuItems.allTextContents();
  }

  async isMenuItemActive(menuText: string): Promise<boolean> {
    const menuItem = this.menuItems.filter({ hasText: menuText });
    const classAttr = await menuItem.getAttribute('class');
    return classAttr?.includes('active') || false;
  }

  async toggleHamburgerMenu(): Promise<void> {
    await this.hamburgerMenu.click();
  }

  async isMobileMenuOpen(): Promise<boolean> {
    return await this.mobileMenu.isVisible();
  }

  async openMobileMenu(): Promise<void> {
    if (!(await this.isMobileMenuOpen())) {
      await this.toggleHamburgerMenu();
    }
  }

  async closeMobileMenu(): Promise<void> {
    if (await this.isMobileMenuOpen()) {
      await this.toggleHamburgerMenu();
    }
  }

  async openSearch(): Promise<void> {
    await this.searchToggle.click();
  }

  async search(query: string): Promise<void> {
    await this.openSearch();
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async openUserDropdown(): Promise<void> {
    await this.userDropdown.click();
  }

  async getNotificationCount(): Promise<number> {
    const badgeText = await this.notificationBadge.textContent();
    return badgeText ? parseInt(badgeText, 10) : 0;
  }

  async hasNotifications(): Promise<boolean> {
    return await this.notificationBadge.isVisible();
  }

  async clickNotifications(): Promise<void> {
    await this.notificationIcon.click();
  }

  async getCartCount(): Promise<number> {
    const badgeText = await this.cartBadge.textContent();
    return badgeText ? parseInt(badgeText, 10) : 0;
  }

  async hasItemsInCart(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }

  async clickCart(): Promise<void> {
    await this.cartIcon.click();
  }

  async isNavbarVisible(): Promise<boolean> {
    return await this.navbar.isVisible();
  }

  async waitForNavbarLoad(): Promise<void> {
    await this.navbar.waitFor({ state: 'visible' });
  }
}

export function createNavigationComponent(page: Page): NavigationComponent {
  return new NavigationComponent(page);
}

export default NavigationComponent;
