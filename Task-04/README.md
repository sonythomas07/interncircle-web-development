# Responsive Product Pricing Cards

## Overview

This project demonstrates a modern, commercial-grade SaaS pricing page component built with pure HTML5, CSS3, and vanilla JavaScript. It features three structured subscription tiers (Starter, Professional, Business), an interactive Monthly/Yearly billing cycle toggle with dynamic price calculation, CSS transform hover effects, distinct badge ribbons, and a fully responsive grid system.

## Features

- **Three Pricing Plans**: Structured tiers tailored for individuals, growing teams, and enterprise use (Starter, Professional, Business).
- **Monthly / Yearly Billing Toggle**: Seamless switching between monthly and annual billing cycles without page reload.
- **Dynamic JavaScript Price Updates**: Instant recalculation of rates, billing intervals, and subtext labels.
- **Popular Badge**: Highlighted badge ribbon accenting the most popular tier (Professional).
- **Best Value Badge**: Highlighted badge ribbon marking the highest-value tier (Business).
- **CSS Hover Transitions**: Smooth, non-distracting CSS transitions applied to borders, shadows, and positioning.
- **CSS Transform Effects**: Controlled `translateY(-6px)` transform effect on card hover for enhanced depth and interactivity.
- **Responsive Layout**: Fluid CSS Grid and Flexbox layout scaling naturally from 320px mobile screens to 1440px+ ultra-wide displays.
- **Accessible Controls**: Accessible custom switch with `role="switch"`, `aria-checked`, `aria-pressed`, and visible `:focus-visible` keyboard focus indicators.

## Technologies

- **HTML5**: Semantic document layout using `<header>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, media queries, CSS transitions, and transform effects.
- **Vanilla JavaScript**: Clean DOM manipulation using `document.querySelector()`, `addEventListener()`, `textContent`, and `classList` with zero dependencies.

## How It Works

1. **HTML Plan Definitions**: Pricing cards, feature lists, and badges are structured semantically inside `<article class="pricing-card">` components with custom data attributes (`data-plan`).
2. **Responsive CSS Architecture**: A 3-column CSS Grid displays cards side-by-side on desktop viewports and gracefully adapts to a single-column vertical stack on mobile screens.
3. **Billing Cycle Controller**: JavaScript listens for toggle and button interactions, updating the application's active billing state (`monthly` or `yearly`).
4. **Dynamic Price Updates**: Upon toggle state changes, prices, period notations, and annual billing subtexts update instantly in the DOM.
5. **Interactive Transitions**: CSS transitions and transforms provide interactive hover states that communicate focus and interactivity.

## Responsive Behavior

- **Desktop (1025px – 1440px+)**: Displays the three pricing cards in a balanced 3-column horizontal grid with aligned headers, price blocks, and call-to-action buttons.
- **Tablet (769px – 1024px)**: Tightens grid gaps and card padding while preserving equal heights and alignment.
- **Mobile (320px – 768px)**: Stacks the pricing cards vertically in a centered, clean layout preventing horizontal scroll, text clipping, or overlapping badges.

## How to Run

### Direct File Execution
Open `index.html` directly in any modern browser:
- Double-click `Task-04/index.html`, or
- Right-click `index.html` and choose **Open with** &rarr; **Google Chrome** / **Mozilla Firefox** / **Microsoft Edge**.

### Local Server (Optional)
Serve the directory using Python or Node:

**Using Python:**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000/Task-04/` in your browser.

**Using Node.js:**
```bash
npx serve .
```

## InternCircle Task 4 Requirements

This implementation explicitly fulfills all requirements set forth in Task 4:

- **CSS Transitions**: Implemented via `transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;`.
- **CSS Transform Hover Effects**: Visible lift effect using `transform: translateY(-6px);`.
- **JavaScript Billing Toggle**: Interactive toggle switching between monthly and discounted yearly rates without reloading.
- **Responsive Pricing Cards**: Multi-column desktop grid collapsing into an accessible single-column mobile layout.
- **Badge Ribbons**: HTML badge ribbons for "POPULAR" and "BEST VALUE" positioned without clipping or text overlap.
- **Interactive UI**: Clean, modern SaaS presentation with focus indicators, accessible buttons, and clear pricing hierarchy.

