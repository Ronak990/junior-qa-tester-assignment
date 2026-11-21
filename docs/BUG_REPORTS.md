# Bug Reports — Swag Labs (SauceDemo)

Each bug below is formatted for direct creation as a **GitHub Issue** (one issue per bug) and linked to a **GitHub Project Kanban Board** (`To Do` / `In Progress` / `Done`).

> **Tip:** Run `npm run capture-bugs` to automatically generate PNG screenshots for Bugs 1–4 in `docs/screenshots/`, then drag-and-drop each screenshot inline when creating the GitHub Issues.

---

## BUG-01: All product images render as identical placeholder dog image for `problem_user`

- **Title:** `[UI] All inventory product images display identical incorrect dog image for problem_user`
- **Severity:** Major
- **Priority:** High
- **Environment:** Chrome / Chromium (Desktop `1280x720`), `https://www.saucedemo.com/inventory.html`
- **Affected Account:** `problem_user` / `secret_sauce`

### Steps to Reproduce
1. Navigate to `https://www.saucedemo.com/`.
2. Enter username `problem_user` and password `secret_sauce`.
3. Click **Login**.
4. Observe the product thumbnails on `/inventory.html` and click any product (e.g., *Sauce Labs Backpack*) to view its detail page.

### Expected Result
Each of the 6 products displays its own distinct, accurate product photograph matching its product detail page.

### Actual Result
All 6 product cards on `/inventory.html` display the exact same dog image (`/static/media/sl-404.168b1cce.jpg`), which does not match the actual product or the product detail page.

### Screenshot
`![BUG-01 Incorrect Product Images](screenshots/bug-01-problem-user-images.png)`

---

## BUG-02: Last Name input overwrites First Name and blocks checkout for `problem_user`

- **Title:** `[Functional][Blocker] Checkout Last Name field cannot be populated for problem_user, blocking purchase`
- **Severity:** Critical (Blocker)
- **Priority:** High
- **Environment:** Chrome / Chromium (Desktop `1280x720`), `https://www.saucedemo.com/checkout-step-one.html`
- **Affected Account:** `problem_user` / `secret_sauce`

### Steps to Reproduce
1. Log in as `problem_user` / `secret_sauce`.
2. Add *Sauce Labs Backpack* to the cart and navigate to `/cart.html`.
3. Click **Checkout** to open `/checkout-step-one.html`.
4. Type `Ronak` into **First Name** (`[data-test="firstName"]`).
5. Type `Oza` into **Last Name** (`[data-test="lastName"]`), enter `400016` in **Postal Code**, and click **Continue**.

### Expected Result
**Last Name** retains `Oza` and clicking **Continue** advances to `/checkout-step-two.html` (Checkout: Overview).

### Actual Result
Typing into **Last Name** overwrites the **First Name** field instead, leaving **Last Name** empty. Clicking **Continue** fails with `Error: Last Name is required`, completely blocking checkout.

### Screenshot
`![BUG-02 Last Name Blocked](screenshots/bug-02-problem-user-checkout.png)`

---

## BUG-03: Three of six inventory items cannot be added to cart for `problem_user`

- **Title:** `[Functional] Add to cart button is unresponsive for 3 out of 6 products on problem_user`
- **Severity:** Major
- **Priority:** High
- **Environment:** Chrome / Chromium (Desktop `1280x720`), `https://www.saucedemo.com/inventory.html`
- **Affected Account:** `problem_user` / `secret_sauce`

### Steps to Reproduce
1. Log in as `problem_user` / `secret_sauce`.
2. Click **Add to cart** on *Sauce Labs Bolt T-Shirt*, *Sauce Labs Fleece Jacket*, and *Test.allTheThings() T-Shirt (Red)*.
3. Observe the button state and the shopping cart badge.

### Expected Result
Each clicked item's button changes to **Remove** and the shopping cart badge increments by 1 for each item added.

### Actual Result
Clicking **Add to cart** on *Sauce Labs Bolt T-Shirt*, *Sauce Labs Fleece Jacket*, and *Test.allTheThings() T-Shirt (Red)* has no effect — buttons remain **Add to cart** and the cart badge does not increment.

### Screenshot
`![BUG-03 Add to Cart Broken](screenshots/bug-03-problem-user-cart.png)`

---

## BUG-04: Severe login latency (~5+ seconds) for `performance_glitch_user`

- **Title:** `[Performance] Login to inventory page takes 5+ seconds for performance_glitch_user`
- **Severity:** Major
- **Priority:** Medium
- **Environment:** Chrome / Chromium (Desktop `1280x720`), `https://www.saucedemo.com/`
- **Affected Account:** `performance_glitch_user` / `secret_sauce`

### Steps to Reproduce
1. Navigate to `https://www.saucedemo.com/`.
2. Open Browser DevTools → **Network / Performance** tab (or measure elapsed time).
3. Enter `performance_glitch_user` / `secret_sauce` and click **Login**.
4. Compare transition time against `standard_user`.

### Expected Result
Login completes and `/inventory.html` renders in under 2 seconds (matching `standard_user` baseline of < 500 ms).

### Actual Result
The UI freezes on the login page for ~5+ seconds before transitioning to `/inventory.html`, degrading user experience and risking client timeouts.

### Screenshot
`![BUG-04 Performance Glitch Latency](screenshots/bug-04-performance-glitch.png)`
