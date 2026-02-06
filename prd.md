# PRD: TestPulse — Test Automation Dashboard

## 1. Problem Statement

The current Selenium + TestNG automation framework produces raw HTML reports (ExtentReports) and screenshot artifacts, but lacks:
- A centralized place to view test runs and trends at a glance
- Real-time visibility into test execution progress
- An easy way to trigger test runs without CLI access
- Visual failure analysis with screenshot viewing

Test results are local files that must be opened manually. There is no trend analysis and no way to trigger or monitor runs without the terminal.

## 2. Product Overview

**TestPulse** is a local web application that serves as a dashboard and control panel on top of the existing Selenium + TestNG framework.

| Attribute | Decision |
|-----------|----------|
| **Name** | TestPulse |
| **Type** | Local web application |
| **URL** | `localhost:8080` |
| **Stack** | JavaScript — React frontend, Node.js/Express backend |
| **Storage** | In-memory (resets on server restart) |
| **Polish** | Quick prototype — functional, basic styling |
| **Theme** | Light mode only |
| **Auth** | None (local use) |
| **Notifications** | None |

## 3. Target User

Single QA engineer / developer running the tool locally to gain confidence in test results before scaling to a team.

## 4. User Flow

```
Open localhost:8080
        ↓
  Welcome Screen
  (summary cards: total runs, pass rate, last run status)
  (prominent "Run Tests" button)
        ↓
  ┌─────────────────────────────────────┐
  │  Option A: Click "Run Tests"        │
  │  → Select: full suite or class      │
  │  → Live Maven console logs stream   │
  │  →   in browser via WebSocket       │
  │  → Run completes → results appear   │
  └─────────────────────────────────────┘
  ┌─────────────────────────────────────┐
  │  Option B: View past results        │
  │  → Click a run from the run list    │
  │  → See per-test pass/fail/skip      │
  │  → Click failed test → error +      │
  │     screenshot in lightbox/modal    │
  └─────────────────────────────────────┘
  ┌─────────────────────────────────────┐
  │  Option C: View trends              │
  │  → Pass rate over time chart        │
  │  → Most failing tests chart         │
  └─────────────────────────────────────┘
```

## 5. Navigation

**Top navbar** (GitHub-style horizontal navigation):

```
┌──────────────────────────────────────────────────────────┐
│  🔬 TestPulse    Dashboard    Runs    Trends    Run Tests │
└──────────────────────────────────────────────────────────┘
```

| Tab | Content |
|-----|---------|
| **Dashboard** | Welcome / home — summary cards, latest run status, quick stats |
| **Runs** | List of all test runs with status, timestamp, pass/fail/skip counts |
| **Trends** | Charts — pass rate over time, most frequently failing tests |
| **Run Tests** | Trigger test execution with live Maven console log streaming |

## 6. Pages & Features (MVP)

### 6.1 Dashboard (Landing Page)

- Welcome message
- Summary cards:
  - Total test runs (this session)
  - Overall pass rate percentage
  - Last run status (pass/fail/mixed) with timestamp
- Prominent **"Run Tests"** button (front and center)
- Quick link to latest test run details

**Layout:** Spacious, card-based, modern, light background.

### 6.2 Runs List

- Table of all test runs (in-memory for current session)
- Columns: Run #, Timestamp, Duration, Passed, Failed, Skipped, Status badge
- Click a row → navigate to Run Detail view
- Filter by status (all / passed / failed)

### 6.3 Run Detail View

- Header: run timestamp, duration, overall status
- List of test methods with:
  - Test class name
  - Test method name
  - Status (pass/fail/skip) with color badge
  - Duration
  - Error message (for failures)
- **Failed tests:** Click to open **lightbox/modal** with:
  - Full stack trace
  - Zoomable failure screenshot
  - Close button

### 6.4 Trends Page

- **Pass rate over time** — line chart across runs
- **Most frequently failing tests** — bar chart
- Only meaningful after 2+ runs

### 6.5 Run Tests Page

- **Select execution scope:**
  - Full suite: runs `mvn clean test` (uses `testng.xml` — suite "AutomationSuite", test group "RegressionTests")
  - Specific test class: runs `mvn test -Dtest=tests.<ClassName>` (must use package-qualified name, e.g. `tests.SampleTest`)
- **Class discovery:** Parse `testng.xml` `<classes>` entries to populate the dropdown of available test classes
- **"Run" button** to trigger execution
- **Live console output** — Maven stdout/stderr streamed via WebSocket into a terminal-style panel in the browser
- Run status indicator (idle / running / completed / failed)
- When complete: auto-parse results and navigate to the Run Detail view

## 7. Technical Architecture

### Stack

```
Frontend:  React + plain CSS (light theme)
Backend:   Node.js + Express
Real-time: WebSocket (ws library) for live Maven log streaming
Storage:   In-memory JavaScript arrays/objects
Port:      8080
```

### Data Flow

```
[User clicks "Run Tests"]
        ↓
[Express API endpoint]
        ↓
[Spawn child process: mvn clean test]
  cwd: selenium-testng/        ← CRITICAL: Maven must run from this directory
        ↓ (stdout/stderr)
[WebSocket → stream to browser in real-time]
        ↓ (ONLY after process exits — report is incomplete during run)
[Parse selenium-testng/test-output/ExtentReport_*.html]
  Format: ExtentReports 5.x SparkReporter HTML
        ↓
[Store parsed results in memory]
        ↓
[REST API serves results to frontend]
        ↓
[React dashboard renders results]
```

**Important timing note:** `BaseTest.tearDown()` calls `extent.flush()` after each test method, which progressively writes to the HTML report. However, parsing must only occur **after the Maven process fully exits** to ensure complete data.

### Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/runs` | List all test runs |
| GET | `/api/runs/:id` | Get single run detail with test results |
| GET | `/api/trends` | Get trend data (pass rates, failure counts) |
| POST | `/api/run` | Trigger a new test execution |
| WS | `/ws/logs` | WebSocket for live Maven log streaming |
| GET | `/api/screenshots/:filename` | Serve failure screenshot files |

### Report Parsing

Parse the ExtentReport HTML files from `selenium-testng/test-output/` after each run:
- **Format:** ExtentReports 5.x SparkReporter HTML (`ExtentSparkReporter`)
- **Filename pattern:** `ExtentReport_yyyyMMdd_HHmmss.html` (timestamp set by `ExtentReportManager`)
- Extract: test names, statuses, durations, error messages, screenshot paths
- Store in memory as structured objects
- Serve via REST API
- **Parse only after Maven process exits** — the report is written progressively via `extent.flush()` in `BaseTest.tearDown()` after each test method

### Screenshot Serving

- `ScreenshotUtil` saves screenshots using absolute paths via `System.getProperty("user.dir")`
- Actual location: `selenium-testng/test-output/screenshots/<testname>.png`
- The `/api/screenshots/:filename` endpoint must resolve files from the absolute path `selenium-testng/test-output/screenshots/`, not just a filename lookup

### In-Memory Data Model

```javascript
// Test Run
{
  id: 1,
  timestamp: "2026-02-06T10:30:00Z",
  duration: 12500,           // ms
  status: "failed",          // passed | failed | mixed
  suiteName: "AutomationSuite",   // from testng.xml <suite name="">
  testGroupName: "RegressionTests", // from testng.xml <test name="">
  passed: 8,
  failed: 2,
  skipped: 1,
  tests: [
    {
      className: "tests.SampleTest",
      methodName: "verifyGoogleTitle",
      status: "passed",
      duration: 3200,
      error: null,
      stackTrace: null,
      screenshot: null
    },
    {
      className: "tests.SampleTest",
      methodName: "verifySearchResults",
      status: "failed",
      duration: 5100,
      error: "Expected title to contain 'Results' but was 'Google'",
      stackTrace: "org.testng.Assert...",
      screenshot: "verifySearchResults.png"  // filename only; resolve via selenium-testng/test-output/screenshots/
    }
  ]
}
```

## 8. UI Specifications

| Aspect | Decision |
|--------|----------|
| **Theme** | Light mode only |
| **Layout** | Spacious, card-based, modern |
| **Navigation** | Top navbar (horizontal) |
| **Typography** | System font stack, clean sans-serif |
| **Colors** | Green for pass, red for fail, amber for skip, blue for primary actions |
| **Screenshots** | Lightbox/modal with zoom on click |
| **Console logs** | Dark terminal-style panel (monospace font, dark background) |
| **Responsiveness** | Desktop-first (local use), basic mobile support |

## 9. Test Suite Assumptions

- **Suite size:** Small (under 20 tests)
- **Run frequency:** On-demand from the dashboard
- **Framework location:** `selenium-testng/` directory relative to project root
- **Entry point:** `mvn clean test` from `selenium-testng/` directory (or `mvn test -Dtest=tests.<ClassName>` for single class)
- **Report output:** `selenium-testng/test-output/ExtentReport_yyyyMMdd_HHmmss.html`
- **Screenshots:** `selenium-testng/test-output/screenshots/<testname>.png` (absolute paths stored by `ScreenshotUtil` via `System.getProperty("user.dir")`)
- **Report format:** ExtentReports 5.1.1 SparkReporter HTML
- **Suite config:** `testng.xml` defines suite "AutomationSuite" with test group "RegressionTests"
- **Test pattern:** All test classes extend `base.BaseTest` and live in `tests` package; BaseTest provides `driver` (WebDriver) and `test` (ExtentTest) fields
- **Known flakiness risk:** No explicit waits configured in the framework — tests may produce inconsistent results on slow networks. TestPulse should not retry or mask these; display results as-is

## 10. Out of Scope (v1)

- Authentication / login
- Persistent storage (database)
- Team collaboration (comments, assignments)
- Bug tracker integrations (Jira, GitHub Issues)
- Email / Slack notifications
- CI/CD integration
- Multi-browser support configuration (ChromeDriver is hardcoded in BaseTest)
- Side-by-side screenshot comparison
- Mobile-optimized layout
- Automatic test retry or flaky test suppression
- External config file for test URLs or test data

## 11. Future Enhancements (v2+)

- SQLite persistence for run history across restarts
- Team collaboration features (comments, assignments)
- CI/CD webhook integration
- Jira / GitHub Issues linking
- Multi-browser test configuration from UI
- Screenshot comparison across runs
- Authentication and role-based access
- Cloud deployment option

---

*Interview completed. This PRD reflects all decisions made. Ready for implementation.*
