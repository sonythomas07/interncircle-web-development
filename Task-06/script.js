/**
 * ShopSphere — Interactive Mini E-Commerce Web App
 * InternCircle Web Development — Task 6
 * 
 * Features:
 * - Dynamic product catalog rendering with 8+ products across 3 categories
 * - Image error fallback handling
 * - Real-time category filtering and case-insensitive search
 * - Interactive cart management (Add, increment, decrement, remove, clear)
 * - Persistent cart state using browser localStorage
 * - Dynamic subtotal and total calculations in Indian Rupees (₹)
 * - Accessible checkout preview modal with order item breakdown
 * - Simulated demo order completion with non-monetary confirmation
 * - Toast notification feedback system
 * - Full keyboard accessibility and ARIA attribute synchronizations
 */

'use strict';

// ==========================================================================
// 1. Product Data Catalog (8 Realistic Products)
// ==========================================================================
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'AcousticPro ANC Wireless Headphones',
    category: 'Electronics',
    price: 6499,
    description: 'Hybrid active noise cancellation with 40-hour battery life and spatial audio driver.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular'
  },
  {
    id: 'prod-2',
    name: 'Horizon Ultra-Slim Smartwatch',
    category: 'Electronics',
    price: 4999,
    description: 'AMOLED edge-to-edge display with SpO2 health tracking and 7-day battery reserve.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    badge: 'New'
  },
  {
    id: 'prod-3',
    name: 'Nova Pro RGB Mechanical Keyboard',
    category: 'Electronics',
    price: 3799,
    description: 'Hot-swappable linear red switches with aircraft-grade aluminum top frame.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    badge: 'Trending'
  },
  {
    id: 'prod-4',
    name: 'Precision Wireless Ergonomic Mouse',
    category: 'Electronics',
    price: 1899,
    description: 'Sculpted thumb rest, dual Bluetooth/2.4GHz connectivity, and hyper-fast scroll wheel.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    badge: null
  },
  {
    id: 'prod-5',
    name: 'Urban Commuter Weatherproof Backpack',
    category: 'Accessories',
    price: 2999,
    description: 'Water-resistant ballistic nylon with dedicated 16-inch padded laptop sleeve.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller'
  },
  {
    id: 'prod-6',
    name: 'Artisan Full-Grain Leather Wallet',
    category: 'Accessories',
    price: 1299,
    description: 'Handcrafted genuine leather bifold with RFID blocking protection technology.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    badge: null
  },
  {
    id: 'prod-7',
    name: 'Classic Polarized Aviator Sunglasses',
    category: 'Accessories',
    price: 1599,
    description: 'Ultra-lightweight metal frame with 100% UV400 anti-glare protection lenses.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    badge: null
  },
  {
    id: 'prod-8',
    name: 'HydroPure Insulated Steel Bottle',
    category: 'Lifestyle',
    price: 999,
    description: 'Double-wall vacuum insulation keeps cold beverages for 24 hours and hot for 12.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    badge: 'Eco Friendly'
  },
  {
    id: 'prod-9',
    name: 'AromaTherapy Ceramic Essential Oil Diffuser',
    category: 'Lifestyle',
    price: 2199,
    description: 'Whisper-quiet ultrasonic mist technology with soothing ambient 7-color LED lights.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    badge: null
  }
];

// Fallback SVG icon string for failed image loading
const FALLBACK_ICON_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
`;

// ==========================================================================
// 2. State & Storage Constants
// ==========================================================================
const STORAGE_KEY = 'shopsphere-cart-data';

/**
 * Cart Item Object Structure:
 * {
 *   id: string,
 *   name: string,
 *   price: number,
 *   category: string,
 *   image: string,
 *   quantity: number
 * }
 */
let cart = [];
let activeCategory = 'all';
let searchQuery = '';

// ==========================================================================
// 3. DOM Element References
// ==========================================================================
// Header & Cart Trigger
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const headerCartBadge = document.getElementById('header-cart-badge');

// Catalog Controls
const productSearch = document.getElementById('product-search');
const clearSearchBtn = document.getElementById('clear-search-btn');
const filterPills = document.querySelectorAll('.filter-pill');
const catalogCountText = document.getElementById('catalog-count-text');
const productGrid = document.getElementById('product-grid');
const catalogEmptyState = document.getElementById('catalog-empty-state');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

// Cart Drawer
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const cartCloseBtn = document.getElementById('cart-close-btn');
const drawerItemCount = document.getElementById('drawer-item-count');
const cartItemsList = document.getElementById('cart-items-list');
const cartEmptyState = document.getElementById('cart-empty-state');
const cartFooter = document.getElementById('cart-footer');
const cartSubtotalVal = document.getElementById('cart-subtotal-val');
const cartTotalVal = document.getElementById('cart-total-val');
const checkoutTriggerBtn = document.getElementById('checkout-trigger-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const startShoppingBtn = document.getElementById('start-shopping-btn');

// Checkout Preview Modal
const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
const checkoutModal = document.getElementById('checkout-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const checkoutItemsTbody = document.getElementById('checkout-items-tbody');
const checkoutSubtotalVal = document.getElementById('checkout-subtotal-val');
const checkoutTotalVal = document.getElementById('checkout-total-val');
const placeOrderBtn = document.getElementById('place-order-btn');

// Order Success Modal
const orderSuccessOverlay = document.getElementById('order-success-overlay');
const successOrderId = document.getElementById('success-order-id');
const successOrderTotal = document.getElementById('success-order-total');
const successDoneBtn = document.getElementById('success-done-btn');

// Toast Feedback Container
const toastContainer = document.getElementById('toast-container');

// ==========================================================================
// 4. Utility Functions (Formatting & Notifications)
// ==========================================================================

/**
 * Formats a number into Indian Rupee currency format (e.g. ₹6,499)
 * @param {number} amount 
 * @returns {string}
 */
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Displays a non-intrusive toast feedback alert
 * @param {string} message 
 */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');

  const iconSvg = `
    <svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
  `;

  toast.innerHTML = iconSvg;
  const textSpan = document.createElement('span');
  textSpan.textContent = message;
  toast.appendChild(textSpan);

  toastContainer.appendChild(toast);

  // Trigger smooth entrance
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove toast after 2.8s
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  }, 2800);
}

// ==========================================================================
// 5. LocalStorage Persistence
// ==========================================================================

/**
 * Loads cart data from localStorage safely with error handling
 * @returns {Array}
 */
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => (
        item &&
        typeof item.id === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
      ));
    }
    return [];
  } catch (err) {
    console.error('Failed to load cart from localStorage:', err);
    return [];
  }
}

/**
 * Saves current cart array to localStorage
 */
function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
}

// ==========================================================================
// 6. Product Catalog Rendering & Filtering
// ==========================================================================

/**
 * Filters the product catalog by category and search query
 * @returns {Array}
 */
function getFilteredProducts() {
  return PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const cleanSearch = searchQuery.trim().toLowerCase();
    const matchesSearch = !cleanSearch ||
      product.name.toLowerCase().includes(cleanSearch) ||
      product.category.toLowerCase().includes(cleanSearch) ||
      product.description.toLowerCase().includes(cleanSearch);

    return matchesCategory && matchesSearch;
  });
}

/**
 * Renders product catalog into the DOM
 */
function renderCatalog() {
  const filtered = getFilteredProducts();

  // Clear existing items
  while (productGrid.firstChild) {
    productGrid.removeChild(productGrid.firstChild);
  }

  // Update status summary text
  if (filtered.length === PRODUCTS.length) {
    catalogCountText.textContent = `Showing all ${PRODUCTS.length} products`;
  } else {
    catalogCountText.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} products`;
  }

  // Handle empty state
  if (filtered.length === 0) {
    catalogEmptyState.removeAttribute('hidden');
    productGrid.setAttribute('hidden', '');
    return;
  }

  catalogEmptyState.setAttribute('hidden', '');
  productGrid.removeAttribute('hidden');

  // Populate product cards
  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;

    // Media Wrapper
    const media = document.createElement('div');
    media.className = 'product-media';

    const img = document.createElement('img');
    img.className = 'product-image';
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';

    // Graceful Image Fallback
    img.addEventListener('error', () => {
      media.innerHTML = '';
      const fallbackBox = document.createElement('div');
      fallbackBox.className = 'product-image-fallback';
      fallbackBox.innerHTML = FALLBACK_ICON_SVG;
      const fallbackLabel = document.createElement('span');
      fallbackLabel.textContent = product.name;
      fallbackBox.appendChild(fallbackLabel);
      media.appendChild(fallbackBox);
    });

    media.appendChild(img);

    // Badge if applicable
    if (product.badge) {
      const badge = document.createElement('span');
      badge.className = 'product-badge';
      badge.textContent = product.badge;
      media.appendChild(badge);
    }

    // Content Wrapper
    const content = document.createElement('div');
    content.className = 'product-content';

    const categorySpan = document.createElement('span');
    categorySpan.className = 'product-category';
    categorySpan.textContent = product.category;

    const titleH2 = document.createElement('h3');
    titleH2.className = 'product-title';
    titleH2.textContent = product.name;

    const descP = document.createElement('p');
    descP.className = 'product-description';
    descP.textContent = product.description;

    const footer = document.createElement('div');
    footer.className = 'product-footer';

    const priceSpan = document.createElement('span');
    priceSpan.className = 'product-price';
    priceSpan.textContent = formatCurrency(product.price);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-primary';
    addBtn.setAttribute('aria-label', `Add ${product.name} to cart for ${formatCurrency(product.price)}`);
    addBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add to Cart
    `;

    addBtn.addEventListener('click', () => {
      addToCart(product.id);
    });

    footer.appendChild(priceSpan);
    footer.appendChild(addBtn);

    content.appendChild(categorySpan);
    content.appendChild(titleH2);
    content.appendChild(descP);
    content.appendChild(footer);

    card.appendChild(media);
    card.appendChild(content);

    productGrid.appendChild(card);
  });
}

// ==========================================================================
// 7. Shopping Cart Operations
// ==========================================================================

/**
 * Calculates cart metrics (total count, subtotal)
 * @returns {{ count: number, subtotal: number }}
 */
function getCartMetrics() {
  return cart.reduce((acc, item) => {
    acc.count += item.quantity;
    acc.subtotal += item.price * item.quantity;
    return acc;
  }, { count: 0, subtotal: 0 });
}

/**
 * Adds a product to the cart by ID or increments quantity if already in cart
 * @param {string} productId 
 */
function addToCart(productId) {
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
    showToast(`Updated "${cart[existingIndex].name}" quantity to ${cart[existingIndex].quantity}`);
  } else {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      quantity: 1
    });

    showToast(`Added "${product.name}" to cart`);
  }

  saveCartToStorage();
  updateCartUI();
}

/**
 * Increments quantity of an item in cart
 * @param {string} productId 
 */
function incrementQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += 1;
    saveCartToStorage();
    updateCartUI();
  }
}

/**
 * Decrements quantity or removes if quantity reaches 0
 * @param {string} productId 
 */
function decrementQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      removeFromCart(productId);
      return;
    }
    saveCartToStorage();
    updateCartUI();
  }
}

/**
 * Removes an item completely from the cart
 * @param {string} productId 
 */
function removeFromCart(productId) {
  const item = cart.find(i => i.id === productId);
  const itemName = item ? item.name : 'Item';

  cart = cart.filter(i => i.id !== productId);
  saveCartToStorage();
  updateCartUI();
  showToast(`Removed "${itemName}" from cart`);
}

/**
 * Clears the entire cart
 */
function clearEntireCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCartToStorage();
  updateCartUI();
  showToast('Shopping cart cleared');
}

/**
 * Updates the shopping cart drawer, counts, subtotal, and badge
 */
function updateCartUI() {
  const { count, subtotal } = getCartMetrics();

  // Header badge
  headerCartBadge.textContent = count;
  headerCartBadge.setAttribute('aria-label', `${count} items in cart`);

  // Drawer item count
  drawerItemCount.textContent = `(${count} item${count === 1 ? '' : 's'})`;

  // Clear existing items in list
  while (cartItemsList.firstChild) {
    cartItemsList.removeChild(cartItemsList.firstChild);
  }

  if (cart.length === 0) {
    cartEmptyState.removeAttribute('hidden');
    cartItemsList.setAttribute('hidden', '');
    cartFooter.setAttribute('hidden', '');
  } else {
    cartEmptyState.setAttribute('hidden', '');
    cartItemsList.removeAttribute('hidden');
    cartFooter.removeAttribute('hidden');

    // Populate cart items
    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.dataset.id = item.id;

      // Thumbnail
      const thumb = document.createElement('img');
      thumb.className = 'cart-item-thumb';
      thumb.src = item.image;
      thumb.alt = item.name;

      thumb.addEventListener('error', () => {
        thumb.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" fill="%23cbd5e1" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23f1f5f9"/><circle cx="12" cy="12" r="4"/></svg>';
      });

      // Details
      const details = document.createElement('div');
      details.className = 'cart-item-details';

      const title = document.createElement('h4');
      title.className = 'cart-item-title';
      title.textContent = item.name;
      title.title = item.name;

      const price = document.createElement('span');
      price.className = 'cart-item-price';
      price.textContent = `${formatCurrency(item.price)} each`;

      // Controls row
      const controls = document.createElement('div');
      controls.className = 'cart-item-controls';

      const qtyGroup = document.createElement('div');
      qtyGroup.className = 'qty-control-group';

      const decBtn = document.createElement('button');
      decBtn.type = 'button';
      decBtn.className = 'qty-btn';
      decBtn.setAttribute('aria-label', `Decrease quantity of ${item.name}`);
      decBtn.textContent = '−';
      decBtn.addEventListener('click', () => decrementQuantity(item.id));

      const qtyVal = document.createElement('span');
      qtyVal.className = 'qty-display';
      qtyVal.textContent = item.quantity;
      qtyVal.setAttribute('aria-label', `Current quantity: ${item.quantity}`);

      const incBtn = document.createElement('button');
      incBtn.type = 'button';
      incBtn.className = 'qty-btn';
      incBtn.setAttribute('aria-label', `Increase quantity of ${item.name}`);
      incBtn.textContent = '+';
      incBtn.addEventListener('click', () => incrementQuantity(item.id));

      qtyGroup.appendChild(decBtn);
      qtyGroup.appendChild(qtyVal);
      qtyGroup.appendChild(incBtn);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'item-remove-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove ${item.name} from cart`);
      removeBtn.addEventListener('click', () => removeFromCart(item.id));

      controls.appendChild(qtyGroup);
      controls.appendChild(removeBtn);

      details.appendChild(title);
      details.appendChild(price);
      details.appendChild(controls);

      itemEl.appendChild(thumb);
      itemEl.appendChild(details);

      cartItemsList.appendChild(itemEl);
    });

    // Update totals
    cartSubtotalVal.textContent = formatCurrency(subtotal);
    cartTotalVal.textContent = formatCurrency(subtotal);
  }
}

// ==========================================================================
// 8. Drawer & Modal Dialog Management (Accessibility)
// ==========================================================================

/**
 * Opens shopping cart drawer
 */
function openCartDrawer() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.setAttribute('aria-hidden', 'false');
  cartToggleBtn.setAttribute('aria-expanded', 'true');
  cartCloseBtn.focus();
  document.body.style.overflow = 'hidden';
}

/**
 * Closes shopping cart drawer
 */
function closeCartDrawer() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.setAttribute('aria-hidden', 'true');
  cartToggleBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/**
 * Opens checkout preview modal and populates order summary
 */
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty. Add products before checking out.');
    return;
  }

  // Close drawer
  closeCartDrawer();

  const { subtotal } = getCartMetrics();

  // Clear tbody
  while (checkoutItemsTbody.firstChild) {
    checkoutItemsTbody.removeChild(checkoutItemsTbody.firstChild);
  }

  // Populate checkout table rows
  cart.forEach(item => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = item.name;

    const tdQty = document.createElement('td');
    tdQty.className = 'text-center';
    tdQty.textContent = item.quantity;

    const tdPrice = document.createElement('td');
    tdPrice.className = 'text-right';
    tdPrice.textContent = formatCurrency(item.price);

    const tdSubtotal = document.createElement('td');
    tdSubtotal.className = 'text-right font-semibold';
    tdSubtotal.textContent = formatCurrency(item.price * item.quantity);

    tr.appendChild(tdName);
    tr.appendChild(tdQty);
    tr.appendChild(tdPrice);
    tr.appendChild(tdSubtotal);

    checkoutItemsTbody.appendChild(tr);
  });

  checkoutSubtotalVal.textContent = formatCurrency(subtotal);
  checkoutTotalVal.textContent = formatCurrency(subtotal);

  checkoutModalOverlay.removeAttribute('hidden');
  checkoutModalOverlay.setAttribute('aria-hidden', 'false');
  modalCloseBtn.focus();
  document.body.style.overflow = 'hidden';
}

/**
 * Closes checkout preview modal
 */
function closeCheckoutModal() {
  checkoutModalOverlay.setAttribute('hidden', '');
  checkoutModalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Completes the simulated demo order
 */
function placeDemoOrder() {
  if (cart.length === 0) {
    closeCheckoutModal();
    return;
  }

  const { subtotal } = getCartMetrics();
  const randomOrderNum = Math.floor(1000 + Math.random() * 9000);

  // Close checkout preview
  closeCheckoutModal();

  // Populate and open success modal
  successOrderId.textContent = `#SPH-${randomOrderNum}`;
  successOrderTotal.textContent = formatCurrency(subtotal);

  orderSuccessOverlay.removeAttribute('hidden');
  orderSuccessOverlay.setAttribute('aria-hidden', 'false');
  successDoneBtn.focus();
  document.body.style.overflow = 'hidden';

  // Clear cart only after successful order placement
  cart = [];
  saveCartToStorage();
  updateCartUI();
  showToast('Demo order placed successfully!');
}

/**
 * Closes order success dialog
 */
function closeSuccessModal() {
  orderSuccessOverlay.setAttribute('hidden', '');
  orderSuccessOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ==========================================================================
// 9. Event Listeners & Initialization
// ==========================================================================

function initEventListeners() {
  // Cart Drawer open/close
  cartToggleBtn.addEventListener('click', openCartDrawer);
  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  startShoppingBtn.addEventListener('click', () => {
    closeCartDrawer();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  });

  clearCartBtn.addEventListener('click', clearEntireCart);

  // Checkout modal triggers
  checkoutTriggerBtn.addEventListener('click', openCheckoutModal);
  modalCloseBtn.addEventListener('click', closeCheckoutModal);
  modalCancelBtn.addEventListener('click', () => {
    closeCheckoutModal();
    openCartDrawer();
  });

  checkoutModalOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutModalOverlay) {
      closeCheckoutModal();
    }
  });

  placeOrderBtn.addEventListener('click', placeDemoOrder);

  // Success modal triggers
  successDoneBtn.addEventListener('click', closeSuccessModal);
  orderSuccessOverlay.addEventListener('click', (e) => {
    if (e.target === orderSuccessOverlay) {
      closeSuccessModal();
    }
  });

  // Category filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-pressed', 'false');
      });

      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      activeCategory = pill.dataset.category || 'all';
      renderCatalog();
    });
  });

  // Search input handling
  productSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery.trim().length > 0) {
      clearSearchBtn.removeAttribute('hidden');
    } else {
      clearSearchBtn.setAttribute('hidden', '');
    }
    renderCatalog();
  });

  clearSearchBtn.addEventListener('click', () => {
    productSearch.value = '';
    searchQuery = '';
    clearSearchBtn.setAttribute('hidden', '');
    productSearch.focus();
    renderCatalog();
  });

  // Reset filters button in empty catalog state
  resetFiltersBtn.addEventListener('click', () => {
    productSearch.value = '';
    searchQuery = '';
    clearSearchBtn.setAttribute('hidden', '');
    activeCategory = 'all';

    filterPills.forEach(pill => {
      const isAll = pill.dataset.category === 'all';
      pill.classList.toggle('active', isAll);
      pill.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });

    renderCatalog();
  });

  // Global Escape Key to close drawers & modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!orderSuccessOverlay.hasAttribute('hidden')) {
        closeSuccessModal();
      } else if (!checkoutModalOverlay.hasAttribute('hidden')) {
        closeCheckoutModal();
      } else if (cartDrawer.classList.contains('active')) {
        closeCartDrawer();
      }
    }
  });
}

/**
 * Initialize application on page load
 */
function init() {
  cart = loadCartFromStorage();
  initEventListeners();
  renderCatalog();
  updateCartUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

