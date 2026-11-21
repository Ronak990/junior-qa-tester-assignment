# Test Plan — Swag Labs (SauceDemo)

**Target Application:** [https://www.saucedemo.com/](https://www.saucedemo.com/)  
**Prepared For:** Junior QA Tester Assignment  
**Date:** November 20, 2026  

---

## 1. Objective & Scope

This test plan defines the manual and automated verification strategy for the Swag Labs e-commerce web application. Testing covers four core functional areas across happy-path, negative, UI, and edge-case scenarios:

1. **Authentication (Login & Logout):** Valid/invalid credentials, locked-out accounts, session protection, and logout behavior.
2. **Product Listing & Sorting:** Inventory rendering, product image/title/price integrity, detail navigation, and sorting (`A-Z`, `Z-A`, `Price Low-High`, `Price High-Low`).
3. **Shopping Cart:** Adding/removing items, cart badge count accuracy, persistence across navigation, and empty-cart handling.
4. **Checkout Flow:** Customer information form validation, special character/boundary handling, subtotal/tax/total math verification, order completion, and browser back-button behavior post-purchase.

### Out of Scope
- Payment gateway processing (SauceDemo uses a static simulated checkout).
- Backend database persistence across browser contexts.

---

## 2. Seeded Test Accounts

| Username | Password | Expected Behavior |
| :--- | :--- | :--- |
| `standard_user` | `secret_sauce` | Baseline functional user |
| `locked_out_user` | `secret_sauce` | Blocked from login with lockout error |
| `problem_user` | `secret_sauce` | Seeded UI, cart, sorting, and checkout form defects |
| `performance_glitch_user` | `secret_sauce` | Seeded artificial login/navigation latency |

---

## 3. Test Environment & Criteria

- **Browsers:** Google Chrome / Chromium (latest stable), Desktop (`1280x720`) & Mobile (`375x812`).
- **Entry Criteria:** Target URL is reachable and seeded test credentials are active.
- **Exit Criteria:** All High-priority test cases executed; all discovered defects documented with reproducible steps and screenshots; automated regression suite passing.

---

## 4. Test Cases (28 Cases)

| ID | Title | Preconditions | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | Successful login with `standard_user` | User is on [Login page](https://www.saucedemo.com/) | 1. Enter `standard_user` in Username.<br>2. Enter `secret_sauce` in Password.<br>3. Click **Login**. | User is redirected to `/inventory.html`; "Products" heading and 6 inventory items are displayed. | High |
| **TC-002** | Login blocked for `locked_out_user` | User is on Login page | 1. Enter `locked_out_user` in Username.<br>2. Enter `secret_sauce` in Password.<br>3. Click **Login**. | Login is rejected; error banner displays: `Epic sadface: Sorry, this user has been locked out.` | High |
| **TC-003** | Login with empty username and password | User is on Login page | 1. Leave Username and Password blank.<br>2. Click **Login**. | Login is blocked; error banner displays: `Epic sadface: Username is required`. | High |
| **TC-004** | Login with invalid password | User is on Login page | 1. Enter `standard_user` in Username.<br>2. Enter `wrong_pass` in Password.<br>3. Click **Login**. | Login is rejected; error banner displays: `Epic sadface: Username and password do not match any user in this service`. | High |
| **TC-005** | Login with leading/trailing spaces in username | User is on Login page | 1. Enter ` standard_user ` (with spaces) in Username.<br>2. Enter `secret_sauce` in Password.<br>3. Click **Login**. | System rejects credentials (does not silently authenticate mismatched string) and shows credential mismatch error. | Med |
| **TC-006** | Direct URL access to `/inventory.html` without login | User is logged out (no session cookie) | 1. Navigate directly to `https://www.saucedemo.com/inventory.html`. | User is redirected to Login page with error: `Epic sadface: You can only access '/inventory.html' when you are logged in.` | High |
| **TC-007** | Inventory page UI & product image integrity | Logged in as `standard_user` | 1. Inspect all 6 product cards on `/inventory.html`.<br>2. Click a product title to open its detail page. | Each product displays a unique, matching image, title, description, price, and **Add to cart** button; detail page image matches listing. | Med |
| **TC-008** | Sort products by Price (low to high) | Logged in as `standard_user` on `/inventory.html` | 1. Open sort dropdown (`[data-test="product-sort-container"]`).<br>2. Select **Price (low to high)** (`lohi`). | Products reorder in ascending numerical price order (`$7.99` → `$49.99`). | High |
| **TC-009** | Sort products by Name (Z to A) | Logged in as `standard_user` on `/inventory.html` | 1. Open sort dropdown.<br>2. Select **Name (Z to A)** (`za`). | Products reorder reverse-alphabetically (`Test.allTheThings() T-Shirt (Red)` first, `Sauce Labs Backpack` last). | Med |
| **TC-010** | Sort products by Price (high to low) | Logged in as `standard_user` on `/inventory.html` | 1. Open sort dropdown.<br>2. Select **Price (high to low)** (`hilo`). | Products reorder in descending numerical price order (`$49.99` → `$7.99`). | Med |
| **TC-011** | Performance benchmark for `performance_glitch_user` | User is on Login page | 1. Enter `performance_glitch_user` and `secret_sauce`.<br>2. Measure time from clicking **Login** until `/inventory.html` renders. | Page loads within acceptable SLA (< 2s); any multi-second artificial delay is flagged as a performance defect. | Med |
| **TC-012** | Product image & button behavior for `problem_user` | User is on Login page | 1. Log in as `problem_user`.<br>2. Inspect product images and click **Add to cart** on all 6 items. | All 6 products should show distinct images and allow adding to cart (exposes seeded `problem_user` defects). | Med |
| **TC-013** | Add and remove item updates cart badge | Logged in as `standard_user` on `/inventory.html` | 1. Click **Add to cart** on Sauce Labs Backpack.<br>2. Verify badge shows `1`.<br>3. Click **Remove**. | Badge increments to `1`, button toggles to **Remove**; after removing, badge disappears and button reverts to **Add to cart**. | High |
| **TC-014** | Add multiple items and verify cart contents | Logged in as `standard_user` | 1. Add Sauce Labs Backpack (`$29.99`) and Bike Light (`$9.99`).<br>2. Click the shopping cart icon. | Cart badge shows `2`; `/cart.html` lists both items with exact titles, prices, and quantity `1`. | High |
| **TC-015** | Remove item from inside Cart page | 2 items in cart; user on `/cart.html` | 1. Click **Remove** on one item.<br>2. Observe cart list and badge. | Removed item disappears from `/cart.html`; cart badge decrements from `2` to `1`. | High |
| **TC-016** | Cart state persists across page navigation | 1 item added to cart as `standard_user` | 1. Click a product title to open `/inventory-item.html`.<br>2. Click **Back to products**.<br>3. Reload the page. | Cart badge remains `1` and item stays in cart across navigation and page reload. | High |
| **TC-017** | Continue Shopping button returns to Inventory | User is on `/cart.html` | 1. Click **Continue Shopping** (`[data-test="continue-shopping"]`). | User is navigated back to `/inventory.html` with existing cart items intact. | Low |
| **TC-018** | Edge case: Checkout with an empty cart | Logged in as `standard_user`; cart is empty (`0` items) | 1. Click shopping cart icon.<br>2. Click **Checkout** (`[data-test="checkout"]`). | Documented edge case: SauceDemo allows navigating to `/checkout-step-one.html` with 0 items (ideally Checkout should be disabled or warn on empty cart). | Med |
| **TC-019** | End-to-end happy-path checkout & tax math | 1 item (Sauce Labs Backpack, `$29.99`) in cart | 1. Click **Checkout**.<br>2. Fill First Name, Last Name, Postal Code.<br>3. Click **Continue**.<br>4. Verify Item total (`$29.99`), Tax (`$2.40`, 8%), Total (`$32.39`).<br>5. Click **Finish**. | Redirects to `/checkout-complete.html` displaying `Thank you for your order!` and clears cart badge. | High |
| **TC-020** | Checkout Step 1: Missing First Name | User is on `/checkout-step-one.html` | 1. Leave First Name blank; fill Last Name and Postal Code.<br>2. Click **Continue**. | Form blocks progression and shows error: `Error: First Name is required`. | High |
| **TC-021** | Checkout Step 1: Missing Last Name | User is on `/checkout-step-one.html` | 1. Fill First Name and Postal Code; leave Last Name blank.<br>2. Click **Continue**. | Form blocks progression and shows error: `Error: Last Name is required`. | High |
| **TC-022** | Checkout Step 1: Missing Postal Code | User is on `/checkout-step-one.html` | 1. Fill First Name and Last Name; leave Postal Code blank.<br>2. Click **Continue**. | Form blocks progression and shows error: `Error: Postal Code is required`. | High |
| **TC-023** | Edge case: Special characters & XSS-like strings in checkout fields | User is on `/checkout-step-one.html` | 1. Enter `<script>alert(1)</script>` or `@#$%^&*!` in First Name, Last Name, and Postal Code.<br>2. Click **Continue**. | No script executes (XSS-safe); input is either sanitized/rejected with validation error or safely escaped on overview. | Med |
| **TC-024** | Edge case: Whitespace-only input in checkout fields | User is on `/checkout-step-one.html` | 1. Enter `"   "` (spaces only) in First Name, Last Name, and Postal Code.<br>2. Click **Continue**. | Validation should reject whitespace-only strings as empty required fields. | Low |
| **TC-025** | Cancel checkout from Step 1 and Step 2 | User has items in cart and is on Checkout Step 1 or Step 2 | 1. Click **Cancel** on Step 1 (returns to `/cart.html`) or Step 2 (returns to `/inventory.html`). | Checkout is aborted without placing an order; cart items remain preserved. | Med |
| **TC-026** | Edge case: Browser Back button after order completion | User completed checkout on `/checkout-complete.html` | 1. Click browser **Back** button from `/checkout-complete.html`. | User cannot resubmit duplicate order; cart remains empty (`0` items). | Med |
| **TC-027** | Logout clears session & blocks protected routes | Logged in as `standard_user` | 1. Open hamburger menu (`#react-burger-menu-btn`).<br>2. Click **Logout**.<br>3. Attempt to navigate to `/inventory.html`. | User is returned to Login page; direct access to `/inventory.html` is denied. | High |
| **TC-028** | Responsive UI layout on mobile viewport (`375x812`) | User logs in on mobile viewport (`375x812`) | 1. Inspect Login, Inventory, Cart, and Checkout pages at `375px` width. | No horizontal overflow; buttons, prices, and hamburger menu remain clickable and legible. | Low |
