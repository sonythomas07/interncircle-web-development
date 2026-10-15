# ShopSphere — Interactive Mini E-Commerce Store

## Overview

ShopSphere is a modern, responsive, and accessible mini e-commerce web application developed with pure HTML5, CSS3, and vanilla JavaScript (ES6+). It offers a realistic storefront experience complete with a multi-category product catalog, real-time instant search, category filtering, an interactive shopping cart with browser `localStorage` persistence, and a complete checkout preview with simulated order confirmation.

## Features

### 1. Dynamic Product Catalog
- **9 Realistic Products**: Spanning **Electronics**, **Accessories**, and **Lifestyle** categories.
- **Rich Card Attributes**: Title, high-resolution imagery, descriptive copy, category badges, INR (₹) pricing, and "Add to Cart" triggers.
- **Image Fallback Mechanism**: Gracefully displays a clean SVG icon and product label if an image fails to load or the network drops.
- **Search & Category Filtering**: Combined real-time text search and pill-based category filters with dynamic item counts.
- **Empty Search State**: Dedicated empty state view with a one-click "Reset Filters" action.

### 2. Interactive Shopping Cart
- **Add to Cart & Increments**: Adding an existing item increases its quantity automatically.
- **Live Badge Counter**: The header button reports the total number of items in real time.
- **Quantity Controls**: `+` and `−` buttons with auto-removal when quantity drops below 1.
- **Individual & Full Removal**: Remove specific items or clear the entire cart in one click.
- **Accurate Currency Calculations**: Formatted in Indian Rupees (`₹`) with subtotal, free shipping indicator, and estimated total.
- **LocalStorage Persistence**: Cart state is serialized as JSON under `shopsphere-cart-data` and automatically restored across page refreshes and browser sessions.
- **Empty Cart State**: Shows an inviting message and a "Start Shopping" button when no items exist.

### 3. Checkout Preview & Demo Confirmation
- **Modal Preview**: Accessible dialog displaying an order summary table (Item, Qty, Unit Price, Line Subtotal).
- **Cart Validation**: Prevents checkout if the cart is empty.
- **Demonstration Notice**: Explicitly highlights that no real payments or transactions occur.
- **Demo Order Completion**: Generates a simulated order ID (`#SPH-XXXX`) and clears the cart only after successful order confirmation.

### 4. UI / UX & Accessibility
- **Design Tokens**: Restrained slate and indigo color palette using CSS Custom Properties.
- **Responsive Layout**: Fluid CSS Grid and Flexbox layouts tested across 320px to 1440px+.
- **Accessibility**: Full semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`), ARIA attributes (`role="dialog"`, `aria-modal`, `aria-live`, `aria-pressed`), high-contrast focus rings, and `prefers-reduced-motion` compliance.
- **Toast Notifications**: Non-intrusive visual feedback for add, update, and remove actions.

## Technologies

- **HTML5**: Semantic tags, accessible attributes, and responsive viewport configuration.
- **CSS3**: CSS Custom Properties, Flexbox, CSS Grid, media queries, and smooth drawer/modal transitions.
- **Vanilla JavaScript (ES6+)**: Modular state-driven architecture, event delegation, safe DOM manipulation via `textContent`, and browser `localStorage`.

## Project Structure

```
Task-06/
├── index.html     # Semantic structure & accessible dialogs
├── style.css      # Design system, grid, drawer, modal, and responsive styles
├── script.js      # Product catalog, cart state, localStorage, and event handlers
└── README.md      # Documentation and testing details
```

## How to Run

### Direct Browser Opening
Open `Task-06/index.html` directly in any modern browser:
- Double-click `Task-06/index.html`, or
- Right-click `index.html` &rarr; **Open with** &rarr; **Google Chrome** / **Microsoft Edge** / **Mozilla Firefox**.

### Local Server (Optional)
Using Python:
```bash
# Inside Task-06 directory:
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

## Testing Performed

| Test Case | Scenario / Procedure | Result |
| :--- | :--- | :--- |
| **JavaScript Syntax Check** | Ran `node -c Task-06/script.js` | **Passed**: 0 syntax errors or warnings. |
| **Catalog Rendering** | Loaded 9 items across 3 categories with prices and images | **Passed**: Rendered with proper INR formatting. |
| **Category Filter** | Clicked "Electronics", "Accessories", "Lifestyle", and "All Products" | **Passed**: Filtered list and count indicator updated accurately. |
| **Search Functionality** | Searched by keyword (e.g. "mouse", "wireless", "leather") | **Passed**: Real-time filtering matched names and descriptions. |
| **Empty Search State** | Searched for non-existent product "xyz999" | **Passed**: Displayed empty state; "Reset Filters" restored catalog. |
| **Add to Cart** | Added items to cart | **Passed**: Drawer badge updated, toast shown, item inserted. |
| **Duplicate Addition** | Clicked "Add to Cart" on the same item multiple times | **Passed**: Incremented quantity without creating duplicate rows. |
| **Quantity Increment/Decrement** | Used `+` and `−` buttons in cart | **Passed**: Quantities and total sums recalculated instantly. |
| **Item Removal** | Clicked "Remove" on a cart item | **Passed**: Item deleted, subtotal recalculated, toast feedback shown. |
| **Clear Cart** | Clicked "Clear Entire Cart" | **Passed**: Emptied cart and displayed empty-cart state. |
| **LocalStorage Persistence** | Added items, modified quantities, refreshed browser | **Passed**: Complete cart state accurately restored. |
| **Checkout Validation** | Attempted checkout with an empty cart | **Passed**: Blocked with alert toast; checkout allowed only with items. |
| **Checkout Preview Modal** | Opened checkout modal with items in cart | **Passed**: Tabulated breakdown with subtotal, complimentary shipping, and total displayed. |
| **Demo Order Completion** | Clicked "Place Demo Order" | **Passed**: Success dialog opened with order number; cart cleared upon confirmation. |
| **Keyboard Accessibility** | Navigated with Tab, Enter, Space, and Esc keys | **Passed**: Visible focus rings, dialogs dismissible via `Escape`. |
| **Responsive Design** | Inspected at 320px, 375px, 425px, 768px, 1024px, 1280px, and 1440px | **Passed**: Mobile drawer and single-column grid scale without overflow. |

