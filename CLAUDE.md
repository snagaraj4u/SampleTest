# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Selenium + TestNG test automation framework using the Page Object Model pattern. Java 20, Maven build system, ExtentReports for HTML reporting with screenshots.

## Build and Test Commands

All commands run from `selenium-testng/` directory:

```bash
# Compile
mvn clean compile

# Run all tests (uses testng.xml suite)
mvn clean test

# Run a specific test class
mvn test -Dtest=tests.SampleTest

# Package
mvn clean package
```

## Architecture

```
selenium-testng/
├── src/main/java/
│   ├── base/BaseTest.java          # WebDriver lifecycle, ExtentReports integration, screenshot-on-failure
│   ├── pages/SamplePage.java       # Page Object for Google (pattern to follow for new pages)
│   └── utils/
│       ├── ExtentReportManager.java # Singleton HTML report generator
│       └── ScreenshotUtil.java      # Captures screenshots to test-output/screenshots/
├── src/test/java/tests/
│   └── SampleTest.java             # Test class extending BaseTest
├── pom.xml                         # Maven config (Selenium 4.21.0, TestNG 7.9.0, ExtentReports 5.1.1)
└── testng.xml                      # Suite definition — add new test classes here
```

### Test execution flow

`testng.xml` → TestNG discovers test classes → `BaseTest.setup()` (creates ChromeDriver + ExtentReports test entry) → test method runs → `BaseTest.tearDown()` (captures screenshot on failure, logs result, quits driver).

### Adding new tests

1. Create a Page Object in `src/main/java/pages/` — accept `WebDriver` in constructor, expose action methods.
2. Create a test class in `src/test/java/tests/` — extend `BaseTest`, use `driver` and `test` (ExtentTest) fields from the base class.
3. Register the test class in `testng.xml` under `<classes>`.

### Test output

- HTML reports: `test-output/ExtentReport_<timestamp>.html`
- Failure screenshots: `test-output/screenshots/<testname>.png`

## Key Dependencies (pom.xml)

| Dependency | Version |
|---|---|
| Selenium WebDriver | 4.21.0 |
| TestNG | 7.9.0 |
| ExtentReports | 5.1.1 |

## Current Limitations

- ChromeDriver is hardcoded in BaseTest (no cross-browser support).
- No explicit waits configured — tests may be flaky on slow networks.
- No external config file for URLs or test data.
