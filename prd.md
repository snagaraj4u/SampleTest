# PRD: Test Automation Dashboard & Management Tool

## 1. Problem Statement

The current Selenium + TestNG automation framework produces raw HTML reports (ExtentReports) and screenshot artifacts, but lacks:
- A centralized place to view historical test runs and trends
- Real-time visibility into test execution progress
- An easy way to trigger test runs without CLI access
- Visual comparison of failure screenshots across runs
- Team collaboration on test results (comments, assignments, status tracking)

Test results are local files that must be opened manually. There is no persistent history, no trend analysis, and no way for non-technical stakeholders to interact with test outcomes.

## 2. Proposed Solution

A **web application** that serves as a dashboard and management layer on top of the existing Selenium + TestNG framework. It will:
- Parse and store ExtentReport data and screenshots
- Display test run history with pass/fail trends
- Allow users to trigger test runs from the browser
- Provide failure analysis tools (screenshot viewer, log viewer, comparison)
- Support team collaboration (comments, bug linking, status updates)

## 3. Target Users

| Persona | Needs |
|---------|-------|
| **QA Engineer** | Trigger runs, view results, analyze failures, track flaky tests |
| **Developer** | See which tests broke after a commit, view failure details and screenshots |
| **QA Lead / Manager** | Trend dashboards, release readiness metrics, team workload |
| **Product Owner** | High-level pass/fail summary, release confidence |

## 4. Core Features (MVP)

### 4.1 Test Run Dashboard
- List of all test runs with timestamp, duration, pass/fail/skip counts
- Status badges (passed, failed, mixed)
- Filter and search by date range, status, test name

### 4.2 Test Run Detail View
- Expandable tree of test suites → test classes → test methods
- Per-test status, duration, and error messages
- Failure screenshots displayed inline
- Full stack trace viewer for failures

### 4.3 Trend & Analytics
- Pass rate over time (line chart)
- Most frequently failing tests (bar chart)
- Flaky test detection (tests that alternate pass/fail)
- Average test duration trends

### 4.4 Test Execution Trigger
- "Run Tests" button that triggers `mvn clean test` on the server
- Real-time log streaming during execution
- Ability to select specific test classes or the full suite
- Execution queue (prevent concurrent runs or allow parallel)

### 4.5 Screenshot Management
- Side-by-side screenshot comparison across runs
- Zoom and annotate failure screenshots
- Download original screenshots

### 4.6 Collaboration
- Comment threads on individual test failures
- Link failures to bug tracker issues (Jira, GitHub Issues)
- Assign failures to team members for investigation
- Status tracking per failure (new, investigating, known bug, fixed)

## 5. Technical Architecture (Initial Proposal)

### Option A: Full-Stack JavaScript
- **Frontend**: React (or Next.js) with Tailwind CSS
- **Backend**: Node.js + Express REST API
- **Database**: SQLite (MVP) → PostgreSQL (production)
- **Real-time**: WebSocket for live test execution logs

### Option B: Java-Native Stack
- **Frontend**: Thymeleaf or Vaadin (stays in Java ecosystem)
- **Backend**: Spring Boot REST API
- **Database**: H2 (MVP) → PostgreSQL (production)

### Option C: Python Stack
- **Frontend**: React or Vue.js
- **Backend**: FastAPI or Django
- **Database**: SQLite → PostgreSQL

### Data Flow
```
[Selenium Tests] → [ExtentReport HTML + Screenshots]
                         ↓
              [Report Parser Service]
                         ↓
                   [Database Store]
                         ↓
                  [REST API Layer]
                         ↓
                 [Web Dashboard UI]
```

## 6. Integration Points

- **Existing Framework**: Parse `test-output/ExtentReport_*.html` and `test-output/screenshots/`
- **CI/CD**: Webhook or API to ingest results from CI pipelines
- **Bug Trackers**: Jira / GitHub Issues API integration
- **Notifications**: Email or Slack alerts on test failures

## 7. Non-Functional Requirements

- Response time: Dashboard loads in < 2 seconds
- Support 1 year of test run history (storage scaling)
- Mobile-responsive dashboard
- Authentication and role-based access (viewer vs. admin)

## 8. Open Questions (To Be Resolved in Interview)

- [ ] Which tech stack does the team prefer?
- [ ] Should this be a standalone app or embedded in existing CI/CD?
- [ ] How many tests / how frequently do runs happen?
- [ ] Is multi-browser test support on the roadmap?
- [ ] What bug tracker is used (Jira, GitHub, etc.)?
- [ ] Who will host this — cloud, on-prem, local dev machine?
- [ ] Is authentication needed from day one?
- [ ] What is the priority order of features for MVP?

---

*This PRD is a starting point. The following interview will refine scope, priorities, and technical decisions.*
