# SauceDemo & ReqRes QA Automation Suite

Complete Junior QA Tester assignment repository covering manual test planning, bug reporting, Playwright UI end-to-end automation, ReqRes REST API testing, and GitHub Actions CI.

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI workflow (runs on push/PR)
├── docs/
│   ├── TEST_PLAN.md                # Part 1: Test Plan & 28 Manual Test Cases
│   └── BUG_REPORTS.md              # Part 2: 4 Detailed Bug Reports (GitHub Issue ready)
├── scripts/
│   └── capture-bug-screenshots.js  # Helper script to auto-capture bug screenshots
├── tests/
│   ├── api/
│   │   └── reqres.spec.js          # Part 4: ReqRes API automated tests
│   └── ui/
│       └── saucedemo.spec.js       # Part 3: SauceDemo Playwright UI tests (10 cases)
├── package.json
├── playwright.config.js
└── README.md
```

## Prerequisites

- **Node.js** v18+ and **npm** v9+

## Setup & Running Tests

Install dependencies (the `postinstall` script automatically installs Playwright's Chromium browser):

```bash
npm install
```

Run the **entire automated suite** (UI + API tests) with a single command:

```bash
npm test
```

Additional commands:

```bash
npm run test:ui       # Run only SauceDemo UI tests
npm run test:api      # Run only ReqRes API tests
npm run report        # Open the Playwright HTML test report
npm run capture-bugs  # Capture PNG screenshots of the documented bugs into docs/screenshots/
```

## Automated Test Coverage

### Part 3 — SauceDemo UI Automation (`tests/ui/saucedemo.spec.js`)

| Test ID | Mapped Manual TC | Description |
| :--- | :--- | :--- |
| UI-01 | TC-001 | Successful login with `standard_user` redirects to inventory |
| UI-02 | TC-002 | Locked-out user (`locked_out_user`) displays lockout error |
| UI-03 | TC-004 | Invalid password shows authentication error |
| UI-04 | TC-008 | Product sorting: Price (low to high) orders items numerically |
| UI-05 | TC-009 | Product sorting: Name (Z to A) orders items reverse-alphabetically |
| UI-06 | TC-013 | Add and remove items updates shopping cart badge accurately |
| UI-07 | TC-016 | Cart items persist across page navigation |
| UI-08 | TC-019 | Complete end-to-end checkout verifies subtotal, 8% tax, and order confirmation |
| UI-09 | TC-022 | Checkout form blocks submission when First Name or Postal Code is missing |
| UI-10 | TC-027 | Logout clears session and blocks direct access to `/inventory.html` |

### Part 4 — ReqRes API Automation (`tests/api/reqres.spec.js`)

| Test ID | Endpoint | Assertions Covered |
| :--- | :--- | :--- |
| API-01 | `GET /api/users?page=2` | Status `200`, pagination metadata types, `data` array schema (`id`, `email`, `first_name`, `last_name`, `avatar`) |
| API-02 | `GET /api/users/2` | Status `200`, exact user object shape and email format |
| API-03 | `POST /api/users` | Status `201`, echoed `name` and `job`, generated string `id`, valid ISO-8601 `createdAt` |
| API-04 | `POST /api/login` (missing password) | Status `400`, `{ error: "Missing password" }` body shape |
| API-05 | `POST /api/register` (missing password) | Status `400`, `{ error: "Missing password" }` body shape |
| API-06 | `GET /api/users/23` | Status `404`, empty JSON object `{}` response body |

## GitHub Issues & Kanban Board Setup (Part 2)

1. Push this repository to a **public** GitHub repository.
2. Run `npm run capture-bugs` locally to generate PNG screenshots in `docs/screenshots/`.
3. Open the **Issues** tab on GitHub and create 4 issues using the templates in [`docs/BUG_REPORTS.md`](docs/BUG_REPORTS.md), dragging each PNG screenshot inline into its issue description.
4. Go to **Projects** → **New Project** → **Board**, create columns **To Do**, **In Progress**, and **Done**, and link all 4 issues to the board.
5. Verify the **Actions** tab runs the CI workflow on push and copy your repo URL + Actions URL for submission.
