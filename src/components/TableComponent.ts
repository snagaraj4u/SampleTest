import { Page, Locator } from '@playwright/test';

export interface TableRow {
  [key: string]: string;
}

/**
 * Reusable table component for handling data tables.
 */
export class TableComponent {
  private page: Page;
  private tableSelector: string;

  readonly table: Locator;
  readonly headers: Locator;
  readonly rows: Locator;
  readonly cells: Locator;
  readonly pagination: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly pageNumbers: Locator;
  readonly sortButtons: Locator;
  readonly searchInput: Locator;
  readonly emptyMessage: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page, tableSelector: string = 'table') {
    this.page = page;
    this.tableSelector = tableSelector;

    this.table = page.locator(tableSelector);
    this.headers = page.locator(`${tableSelector} th, ${tableSelector} thead td`);
    this.rows = page.locator(`${tableSelector} tbody tr`);
    this.cells = page.locator(`${tableSelector} tbody td`);
    this.pagination = page.locator('.pagination, [data-testid="pagination"]');
    this.previousButton = page.locator('.pagination .prev, .pagination [aria-label="Previous"]');
    this.nextButton = page.locator('.pagination .next, .pagination [aria-label="Next"]');
    this.pageNumbers = page.locator('.pagination .page-number, .pagination li');
    this.sortButtons = page.locator(`${tableSelector} th button, ${tableSelector} .sortable`);
    this.searchInput = page.locator('.table-search, [data-testid="table-search"]');
    this.emptyMessage = page.locator('.empty-table, .no-data, [data-testid="empty-message"]');
    this.loadingIndicator = page.locator('.table-loading, [data-testid="table-loading"]');
  }

  async waitForTableLoad(): Promise<void> {
    await this.table.waitFor({ state: 'visible' });
    if (await this.loadingIndicator.isVisible()) {
      await this.loadingIndicator.waitFor({ state: 'hidden' });
    }
  }

  async getHeaderTexts(): Promise<string[]> {
    return await this.headers.allTextContents();
  }

  async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  async getColumnCount(): Promise<number> {
    return await this.headers.count();
  }

  async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
    const row = this.rows.nth(rowIndex);
    const cell = row.locator('td').nth(columnIndex);
    return (await cell.textContent()) || '';
  }

  async getCellTextByHeader(rowIndex: number, headerText: string): Promise<string> {
    const headers = await this.getHeaderTexts();
    const columnIndex = headers.findIndex(
      (h) => h.toLowerCase().trim() === headerText.toLowerCase().trim()
    );

    if (columnIndex === -1) {
      throw new Error(`Header "${headerText}" not found in table`);
    }

    return await this.getCellText(rowIndex, columnIndex);
  }

  async getRowData(rowIndex: number): Promise<string[]> {
    const row = this.rows.nth(rowIndex);
    const cells = row.locator('td');
    return await cells.allTextContents();
  }

  async getRowAsObject(rowIndex: number): Promise<TableRow> {
    const headers = await this.getHeaderTexts();
    const rowData = await this.getRowData(rowIndex);

    const result: TableRow = {};
    headers.forEach((header, index) => {
      result[header.trim()] = rowData[index]?.trim() || '';
    });

    return result;
  }

  async getAllRowsData(): Promise<string[][]> {
    const rowCount = await this.getRowCount();
    const allRows: string[][] = [];

    for (let i = 0; i < rowCount; i++) {
      allRows.push(await this.getRowData(i));
    }

    return allRows;
  }

  async getAllRowsAsObjects(): Promise<TableRow[]> {
    const rowCount = await this.getRowCount();
    const allRows: TableRow[] = [];

    for (let i = 0; i < rowCount; i++) {
      allRows.push(await this.getRowAsObject(i));
    }

    return allRows;
  }

  async getColumnData(columnIndex: number): Promise<string[]> {
    const rowCount = await this.getRowCount();
    const columnData: string[] = [];

    for (let i = 0; i < rowCount; i++) {
      columnData.push(await this.getCellText(i, columnIndex));
    }

    return columnData;
  }

  async getColumnDataByHeader(headerText: string): Promise<string[]> {
    const headers = await this.getHeaderTexts();
    const columnIndex = headers.findIndex(
      (h) => h.toLowerCase().trim() === headerText.toLowerCase().trim()
    );

    if (columnIndex === -1) {
      throw new Error(`Header "${headerText}" not found in table`);
    }

    return await this.getColumnData(columnIndex);
  }

  async clickRow(rowIndex: number): Promise<void> {
    await this.rows.nth(rowIndex).click();
  }

  async clickCell(rowIndex: number, columnIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    const cell = row.locator('td').nth(columnIndex);
    await cell.click();
  }

  async clickCellLink(rowIndex: number, columnIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    const cell = row.locator('td').nth(columnIndex);
    const link = cell.locator('a');
    await link.click();
  }

  async clickCellButton(rowIndex: number, columnIndex: number, buttonText?: string): Promise<void> {
    const row = this.rows.nth(rowIndex);
    const cell = row.locator('td').nth(columnIndex);
    const button = buttonText
      ? cell.locator(`button:has-text("${buttonText}")`)
      : cell.locator('button').first();
    await button.click();
  }

  async sortByColumn(headerText: string): Promise<void> {
    const header = this.headers.filter({ hasText: headerText });
    const sortButton = header.locator('button').or(header);
    await sortButton.click();
  }

  async isColumnSorted(headerText: string, direction: 'asc' | 'desc'): Promise<boolean> {
    const header = this.headers.filter({ hasText: headerText });
    const classAttr = await header.getAttribute('class');
    const ariaSort = await header.getAttribute('aria-sort');

    return (
      classAttr?.includes(direction) ||
      ariaSort === (direction === 'asc' ? 'ascending' : 'descending') ||
      false
    );
  }

  async searchTable(searchText: string): Promise<void> {
    await this.searchInput.fill(searchText);
    await this.waitForTableLoad();
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.waitForTableLoad();
  }

  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
    await this.waitForTableLoad();
  }

  async goToPreviousPage(): Promise<void> {
    await this.previousButton.click();
    await this.waitForTableLoad();
  }

  async goToPage(pageNumber: number): Promise<void> {
    const pageButton = this.pageNumbers.filter({ hasText: String(pageNumber) });
    await pageButton.click();
    await this.waitForTableLoad();
  }

  async isTableEmpty(): Promise<boolean> {
    const rowCount = await this.getRowCount();
    return rowCount === 0 || (await this.emptyMessage.isVisible());
  }

  async getEmptyMessage(): Promise<string> {
    return (await this.emptyMessage.textContent()) || '';
  }

  async findRowByColumnValue(columnHeader: string, value: string): Promise<number> {
    const columnData = await this.getColumnDataByHeader(columnHeader);
    return columnData.findIndex((cell) => cell.trim() === value.trim());
  }

  async selectRow(rowIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    const checkbox = row.locator('input[type="checkbox"]');
    await checkbox.check();
  }

  async deselectRow(rowIndex: number): Promise<void> {
    const row = this.rows.nth(rowIndex);
    const checkbox = row.locator('input[type="checkbox"]');
    await checkbox.uncheck();
  }

  async selectAllRows(): Promise<void> {
    const headerCheckbox = this.headers.locator('input[type="checkbox"]').first();
    await headerCheckbox.check();
  }

  async deselectAllRows(): Promise<void> {
    const headerCheckbox = this.headers.locator('input[type="checkbox"]').first();
    await headerCheckbox.uncheck();
  }

  async getSelectedRowsCount(): Promise<number> {
    const checkedBoxes = this.rows.locator('input[type="checkbox"]:checked');
    return await checkedBoxes.count();
  }
}

export function createTableComponent(page: Page, tableSelector?: string): TableComponent {
  return new TableComponent(page, tableSelector);
}

export default TableComponent;
