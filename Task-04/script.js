/**
 * Task-04: Responsive Product Pricing Cards
 * InternCircle Web Development
 * 
 * Features:
 * - Dynamic Monthly / Yearly billing cycle toggle
 * - Smooth price updates across Starter, Professional, and Business tiers
 * - Accessible switch and keyboard-navigable label buttons
 * - Zero external dependencies
 */

'use strict';

// ==========================================================================
// Pricing Data Model
// ==========================================================================
const PRICING_DATA = {
  monthly: {
    periodText: '/ month',
    plans: {
      starter: {
        price: '9',
        subtext: 'Billed monthly'
      },
      professional: {
        price: '19',
        subtext: 'Billed monthly'
      },
      business: {
        price: '39',
        subtext: 'Billed monthly'
      }
    }
  },
  yearly: {
    periodText: '/ year',
    plans: {
      starter: {
        price: '86',
        subtext: 'Billed annually ($86/yr)'
      },
      professional: {
        price: '182',
        subtext: 'Billed annually ($182/yr)'
      },
      business: {
        price: '374',
        subtext: 'Billed annually ($374/yr)'
      }
    }
  }
};

// ==========================================================================
// DOM Element References
// ==========================================================================
const billingCheckbox = document.getElementById('billing-checkbox');
const monthlyLabelBtn = document.getElementById('monthly-label-btn');
const yearlyLabelBtn = document.getElementById('yearly-label-btn');
const pricingCards = document.querySelectorAll('.pricing-card');

// Current state
let currentCycle = 'monthly';

// ==========================================================================
// Functions
// ==========================================================================

/**
 * Updates prices, period text, and billing subtext on all pricing cards.
 * @param {'monthly' | 'yearly'} cycle 
 */
function updatePricing(cycle) {
  const data = PRICING_DATA[cycle];
  if (!data) return;

  pricingCards.forEach((card) => {
    const planKey = card.getAttribute('data-plan');
    const planData = data.plans[planKey];

    if (planData) {
      const priceAmountEl = card.querySelector('.price-amount');
      const billingPeriodEl = card.querySelector('.billing-period');
      const billingSubtextEl = card.querySelector('.billing-subtext');

      if (priceAmountEl) {
        priceAmountEl.textContent = planData.price;
      }

      if (billingPeriodEl) {
        billingPeriodEl.textContent = data.periodText;
      }

      if (billingSubtextEl) {
        billingSubtextEl.textContent = planData.subtext;
      }
    }
  });
}

/**
 * Synchronizes UI controls (toggle switch, label buttons, ARIA attributes).
 * @param {'monthly' | 'yearly'} cycle 
 */
function updateControls(cycle) {
  const isYearly = cycle === 'yearly';

  // Update checkbox state
  if (billingCheckbox) {
    billingCheckbox.checked = isYearly;
    billingCheckbox.setAttribute('aria-checked', isYearly ? 'true' : 'false');
  }

  // Update Monthly label button
  if (monthlyLabelBtn) {
    monthlyLabelBtn.classList.toggle('active', !isYearly);
    monthlyLabelBtn.setAttribute('aria-pressed', !isYearly ? 'true' : 'false');
  }

  // Update Yearly label button
  if (yearlyLabelBtn) {
    yearlyLabelBtn.classList.toggle('active', isYearly);
    yearlyLabelBtn.setAttribute('aria-pressed', isYearly ? 'true' : 'false');
  }
}

/**
 * Sets the active billing cycle and triggers UI & pricing updates.
 * @param {'monthly' | 'yearly'} cycle 
 */
function setBillingCycle(cycle) {
  currentCycle = cycle;
  updateControls(currentCycle);
  updatePricing(currentCycle);
}

// ==========================================================================
// Event Listeners & Initialization
// ==========================================================================
function initBillingToggle() {
  // Checkbox switch change
  if (billingCheckbox) {
    billingCheckbox.addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      setBillingCycle(isChecked ? 'yearly' : 'monthly');
    });
  }

  // Monthly button click
  if (monthlyLabelBtn) {
    monthlyLabelBtn.addEventListener('click', () => {
      setBillingCycle('monthly');
    });
  }

  // Yearly button click
  if (yearlyLabelBtn) {
    yearlyLabelBtn.addEventListener('click', () => {
      setBillingCycle('yearly');
    });
  }
}

/**
 * Initialize on page load
 */
function init() {
  initBillingToggle();
  // Set initial state
  setBillingCycle('monthly');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

