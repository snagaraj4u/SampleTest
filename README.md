# Playwright Automation Framework

A comprehensive end-to-end testing framework built with Playwright and TypeScript. This framework follows the Page Object Model (POM) design pattern and includes reusable components, utilities, and helpers for efficient test automation.

## Project Structure

```
├── src/
│   ├── api/                    # API client and related utilities
│   ├── components/             # Reusable UI components
│   ├── fixtures/               # Test fixtures and setup
│   ├── helpers/                # Assertion and browser helpers
│   ├── pages/                  # Page Object Models
│   └── utils/                  # Utility functions and configurations
├── tests/
│   ├── e2e/                    # End-to-end tests
│   ├── integration/            # API integration tests
│   └── smoke/                  # Smoke tests
├── config/                     # Environment configurations
├── test-data/                  # Test data files
├── reports/                    # Test reports and screenshots
└── .github/workflows/          # CI/CD configurations
```

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-automation-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

1. Copy the environment template:
```bash
cp config/.env config/.env.local
```

2. Update the environment variables in `config/.env` as needed.

## Running Tests

### All Tests
```bash
npm test
```

### Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

### Specific Test Types
```bash
# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression

# API tests
npm run test:api
```

### Specific Browsers
```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

### Parallel Execution
```bash
npm run test:parallel
```

## Viewing Reports

After running tests, view the HTML report:
```bash
npm run report
```

## Code Generation

Generate test code using Playwright's codegen:
```bash
npm run codegen
```

## Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Writing Tests

### Using Page Objects

```typescript
import { test, expect } from '../src/fixtures';

test('example test', async ({ todoPage }) => {
  await todoPage.navigate();
  await todoPage.addTodo('New task');

  const count = await todoPage.getTodoCount();
  expect(count).toBe(1);
});
```

### Using Custom Fixtures

```typescript
import { test, expect } from '../src/fixtures';

test('test with fixtures', async ({
  todoPage,
  logger,
  assertionHelper,
  browserHelper
}) => {
  logger.info('Starting test');
  await todoPage.navigate();
  await assertionHelper.assertElementVisible(todoPage.newTodoInput);
});
```

### Test Tags

Use tags to categorize tests:
- `@smoke` - Critical path tests
- `@regression` - Full regression tests
- `@api` - API integration tests

```typescript
test('critical test @smoke', async ({ page }) => {
  // Test code
});
```

## Adding New Page Objects

1. Create a new file in `src/pages/`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  protected readonly pageUrl = '/new-page';
  protected readonly pageTitle = 'New Page';

  readonly someElement: Locator;

  constructor(page: Page) {
    super(page);
    this.someElement = page.locator('.some-selector');
  }

  async performAction(): Promise<void> {
    await this.click(this.someElement);
  }
}
```

2. Export from `src/pages/index.ts`

3. Add to fixtures in `src/fixtures/testFixtures.ts`

## CI/CD

The framework includes GitHub Actions workflows for:
- Running tests on push/PR
- Cross-browser testing (Chrome, Firefox, Safari)
- Smoke tests on PRs
- Report generation and archiving

## Troubleshooting

### Common Issues

1. **Tests failing to find elements**: Check if selectors have changed in the application.

2. **Timeout errors**: Increase timeout values in `playwright.config.ts` or use explicit waits.

3. **Browser installation issues**: Run `npx playwright install --with-deps`.

### Debug Tips

- Use `test:debug` for step-by-step debugging
- Enable tracing in config for detailed failure analysis
- Check screenshots in `test-results/` folder

## Contributing

1. Create a feature branch
2. Write tests for new functionality
3. Ensure all tests pass
4. Submit a pull request

## License

MIT License
