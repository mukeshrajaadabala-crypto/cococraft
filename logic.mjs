// Konaseema CocoCraft - Core Storefront Logic

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Feature Flags & Config
const ENABLE_SEASONAL_PROMO = true; // Controls Raksha Bandhan banner visibility & coupon text
const SHIPPING_FEE = 100; // Standard Flat Shipping Fee across India
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhSPSEFz44FcxDVNsLqgHeKqR6BQyfBJE9lty_dqJc_4sjOPJvhcJ1jYk-_6mp8sSJ3g/exec';

// Local Mock API Mode (automatically active in local/preview environments or when server unavailable)
const isLocalEnv = window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.protocol === 'file:' ||
  window.location.hostname.endsWith('.local');

let USE_MOCK_API = isLocalEnv; // Set to false when testing against live Google Apps Script endpoint

// In-Memory Mock Store for Idempotency
const mockOrderDatabase = new Map();
let mockOrderSeq = 1001;

// Verified Product Catalog
const productData = [
  {
    id: 'WR001',
    name: 'Wooden Rakhi-Packof 1 (WR001)',
    mrp: 99,
    price: 80,
    category: 'Rakhis',
    subcategory: 'Wooden rakhis',
    tag: 'Eco-Friendly Wooden Rakhi (Packof 1)',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785352016/Wooden_Rakhis_pack_of_1_je8b6n.png',
    alt: 'Wooden Rakhi-Packof 1 (WR001)',
    description: 'This single-piece eco-friendly Wooden Rakhi is crafted with high-precision laser carving from natural wood. It features traditional geometric and floral designs, dyed with organic non-toxic colors, and bound with a soft cotton thread. Perfectly biodegradable and skin-safe.'
  },
  {
    id: 'WR002',
    name: 'Wooden Rakhi-Packof 3 (WR002)',
    mrp: 297,
    price: 198,
    category: 'Rakhis',
    subcategory: 'Wooden rakhis',
    tag: 'Eco-Friendly Wooden Rakhi (Packof 3)',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785351521/Wooden_Rakhis_Combo_jhlbmz.png',
    alt: 'Wooden Rakhi-Packof 3 (WR002)',
    description: 'A beautiful combo set of three unique eco-friendly wooden rakhis. Each piece showcases distinct traditional patterns, meticulously engraved on natural wood. Ideal for families celebrating sustainable bonds.'
  },
  {
    id: 'CCS001',
    name: 'Coconut Shell Rakhi-Packof 1 (CCS001)',
    mrp: 149,
    price: 99,
    category: 'Rakhis',
    subcategory: 'Coconut shell rakhis',
    tag: 'Eco-Friendly Coconut Shell Rakhi (Packof 1)',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785931822/CCS001_biiqcs.jpg',
    alt: 'Eco-Friendly Coconut Shell Rakhi Packof 1 (CCS001)',
    description: 'Transformed from a real discarded coconut shell, this handmade eco-friendly rakhi features a polished round shell emblem with hand-carved floral detailing. A perfect combination of traditional art and sustainable design.'
  },
  {
    id: 'CCS002',
    name: 'Coconut Shell Rakhi-Packof 1 (CCS002)',
    mrp: 149,
    price: 99,
    category: 'Rakhis',
    subcategory: 'Coconut shell rakhis',
    tag: 'Eco-Friendly Coconut Shell Rakhi (Packof 1)',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785931837/CCS002_pytuoa.jpg',
    alt: 'Eco-Friendly Coconut Shell Rakhi Packof 1 (CCS002)',
    description: 'Features a unique hand-carved pattern on natural coconut shell. Lightweight, durable, and completely biodegradable, this rakhi is a beautiful testament to Konaseema\'s local craftsmanship.'
  },
  {
    id: 'KC001',
    name: 'Govinda Blessings Keychain-Packof 1 (KC001)',
    mrp: 120,
    price: 65,
    category: 'KeyChains',
    subcategory: '',
    tag: 'Handcrafted Keychain (Packof 1)',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106455/KC001_mboqsm.jpg',
    images: [
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106455/KC001_mboqsm.jpg',
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106461/KC001.1_bsqzxp.jpg'
    ],
    alt: 'Govinda Blessings Keychain (KC001)',
    description: 'A premium handcrafted keychain made from natural, polished coconut shells featuring the sacred Govinda blessings engraving. Sturdy, lightweight, and showcasing rustic beauty. Features a durable steel key ring.'
  },
  // {
  //   id: 'ER001',
  //   name: 'Coconut Shell Handpainted Earrings (ER001)',
  //   mrp: 199,
  //   price: 120,
  //   category: 'EarRings',
  //   subcategory: '',
  //   tag: 'Traditional Handpainted Earrings',
  //   image: 'earrings_mockup.png',
  //   alt: 'Coconut Shell Handpainted Earrings (ER001)',
  //   description: 'Delicate and lightweight drop earrings, hand-cut from coconut shells and painted with vibrant traditional Indian art. Features allergy-safe hypoallergenic metal hooks.'
  // },
  {
    id: 'WR003',
    name: 'Wooden Rakhi-Packof 1 (WR003)',
    mrp: 199,
    price: 99,
    category: 'Rakhis',
    subcategory: 'Wooden rakhis',
    tag: 'Eco-Friendly Hand-Carved Wooden Rakhi',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106432/CCS007_yugwvc.jpg',
    images: [
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106432/CCS007_yugwvc.jpg',
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106440/CCS007.1_ize7u7.jpg',
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106446/CCS7.2_f4nk1s.jpg'
    ],
    alt: 'Wooden Rakhi-Packof 1 (WR003)',
    description: 'A premium hand-crafted Wooden rakhi featuring fine geometric shapes and detailed concentric circle carving. Sustainable, skin-safe, biodegradable, and bound with high-quality organic threads.'
  }
];

// Coupon Rules System
const VALID_COUPONS = {
  // 'RAKHI5': {
  //   minSubtotal: 100, // Strictly above 100
  //   discount: 0.05,
  //   maxDiscount: 150,
  //   description: '5% discount on product subtotal strictly above ₹100 (Max discount ₹150).'
  // },
  'RUDRANI5': {
    minSubtotal: 200,
    discount: 0.05,
    maxDiscount: Infinity,
    description: '5% discount on product subtotal above ₹200.'
  },
  'RUDRANI10': {
    minSubtotal: 1000,
    discount: 0.10,
    maxDiscount: Infinity,
    description: '10% discount on product subtotal above ₹1000.'
  }
};

// DOM References
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const cartCount = document.querySelector('.cart-count');
const productsGrid = document.querySelector('#products-grid');
const cartItemsRoot = document.querySelector('.cart-items');
const cartSummaryRoot = document.querySelector('.cart-summary');
const checkoutSummaryList = document.querySelector('#checkout-summary-list');
const checkoutSummaryTotals = document.querySelector('#checkout-summary-totals');
const checkoutForm = document.querySelector('#checkout-form');
const checkoutName = document.querySelector('#checkout-name');
const checkoutPhone = document.querySelector('#checkout-phone');
const checkoutAddress = document.querySelector('#checkout-address');
const checkoutState = document.querySelector('#checkout-state');
const checkoutPincode = document.querySelector('#checkout-pincode');
const checkoutSubmitBtn = document.querySelector('#checkout-submit-btn');
const checkoutErrorBanner = document.querySelector('#checkout-error-banner');
const orderConfirmationRoot = document.querySelector('#order-confirmation-root');
const seasonalPromoSection = document.querySelector('#seasonal-promo-section');

// Navigation Toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// Seasonal Promo Setup
if (seasonalPromoSection) {
  if (ENABLE_SEASONAL_PROMO) {
    seasonalPromoSection.style.display = 'block';
  } else {
    seasonalPromoSection.style.display = 'none';
  }
}

// Cart Storage Functions
const CART_KEY = 'kc_cart';
const IDEMPOTENCY_KEY_STORAGE = 'kc_checkout_idempotency_key';

const loadCart = () => {
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveCart = cart => {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const getCartCount = cart => {
  return cart.reduce((total, item) => total + item.qty, 0);
};

const updateCartCount = cart => {
  if (!cartCount) return;
  cartCount.textContent = getCartCount(cart).toString();
};

const addToCart = productId => {
  const cart = loadCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  updateCartCount(cart);
};

// Idempotency Key Session Management
const getIdempotencyKey = () => {
  let key = window.sessionStorage.getItem(IDEMPOTENCY_KEY_STORAGE);
  if (!key) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      key = crypto.randomUUID();
    } else {
      key = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    }
    window.sessionStorage.setItem(IDEMPOTENCY_KEY_STORAGE, key);
  }
  return key;
};

const clearIdempotencyKey = () => {
  window.sessionStorage.removeItem(IDEMPOTENCY_KEY_STORAGE);
};

// Category Filtering
let activeCategory = 'all';
let activeSubcategory = 'all';

const renderProducts = () => {
  if (!productsGrid) return;

  const cart = loadCart();
  const cartIds = new Set(cart.map(item => item.id));

  const filteredProducts = productData
    .filter(product => {
      if (activeCategory !== 'all') {
        if (product.category !== activeCategory) {
          return false;
        }
        if (activeCategory === 'Rakhis' && activeSubcategory !== 'all') {
          if (product.subcategory !== activeSubcategory) {
            return false;
          }
        }
      }
      return true;
    })
    .sort((a, b) => {
      const isRakhiA = a.category === 'Rakhis' ? 1 : 0;
      const isRakhiB = b.category === 'Rakhis' ? 1 : 0;
      if (isRakhiA !== isRakhiB) {
        return isRakhiA - isRakhiB; // Non-Rakhi products first
      }
      return b.price - a.price;
    });

  if (filteredProducts.length === 0) {
    let categoryLabel = activeCategory;
    if (categoryLabel === 'KeyChains') categoryLabel = 'Keychains';
    if (categoryLabel === 'EarRings') categoryLabel = 'Earrings';

    productsGrid.innerHTML = `
      <div class="coming-soon-card">
        <div class="coming-soon-icon">🌴✨</div>
        <h3>Crafting in Progress...</h3>
        <p>Our Konaseema artisans are hand-carving new, eco-friendly ${categoryLabel.toLowerCase()} from natural coconut shells. Check back soon for our next launch!</p>
        <button type="button" class="btn btn-primary" onclick="document.querySelector('.category-tab[data-category=\\'all\\']').click()">Browse All Products</button>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filteredProducts
    .map(product => {
      const inCart = cartIds.has(product.id);
      const buttonLabel = inCart ? 'Go to Cart' : 'Add to Cart';
      const buttonClass = `product-btn${inCart ? ' is-in-cart' : ''}`;
      const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <span class="discount-badge">${discount}% OFF</span>
            <img src="${product.image}" alt="${product.alt}" loading="lazy" decoding="async" />
          </div>
          <div class="product-body">
            <h3>${product.name}</h3>
            <div class="product-meta">
              <span>${product.tag}</span>
              <div class="product-pricing">
                <span class="product-mrp">₹${product.mrp}</span>
                <span class="product-price">₹${product.price}</span>
              </div>
            </div>
            <button class="${buttonClass}" type="button" data-in-cart="${inCart}">${buttonLabel}</button>
          </div>
        </article>
      `;
    })
    .join('');
};

const setupCategoryFilters = () => {
  const categoryTabsContainer = document.querySelector('.category-tabs');
  const subcategoryTabsContainer = document.querySelector('.subcategory-tabs');

  if (!categoryTabsContainer) return;

  categoryTabsContainer.addEventListener('click', event => {
    const tab = event.target.closest('.category-tab');
    if (!tab) return;

    categoryTabsContainer.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    activeCategory = tab.getAttribute('data-category');
    activeSubcategory = 'all';

    if (subcategoryTabsContainer) {
      subcategoryTabsContainer.querySelectorAll('.subcategory-tab').forEach(t => t.classList.remove('active'));
      const allSubTab = subcategoryTabsContainer.querySelector('[data-subcategory="all"]');
      if (allSubTab) allSubTab.classList.add('active');

      if (activeCategory === 'Rakhis') {
        subcategoryTabsContainer.style.display = 'flex';
      } else {
        subcategoryTabsContainer.style.display = 'none';
      }
    }

    renderProducts();
  });

  if (subcategoryTabsContainer) {
    subcategoryTabsContainer.addEventListener('click', event => {
      const tab = event.target.closest('.subcategory-tab');
      if (!tab) return;

      subcategoryTabsContainer.querySelectorAll('.subcategory-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeSubcategory = tab.getAttribute('data-subcategory');
      renderProducts();
    });
  }
};

// Product Modal
const openProductModal = productId => {
  const product = productData.find(p => p.id === productId);
  if (!product) return;

  const modalRoot = document.querySelector('#product-modal-root');
  if (!modalRoot) return;

  const cart = loadCart();
  const inCart = cart.some(item => item.id === productId);
  const buttonLabel = inCart ? 'Go to Cart' : 'Add to Cart';
  const buttonClass = `product-btn${inCart ? ' is-in-cart' : ''}`;
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  let imageWrapperContent = `<img src="${product.image}" alt="${product.alt}" />`;
  if (product.images && product.images.length > 0) {
    imageWrapperContent = `
      <div class="swiper modal-swiper">
        <div class="swiper-wrapper">
          ${product.images.map(img => `
            <div class="swiper-slide">
              <img src="${img}" alt="${product.alt}" />
            </div>
          `).join('')}
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    `;
  }

  modalRoot.innerHTML = `
    <div class="product-modal" id="product-details-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="product-modal-content">
        <button class="modal-close" type="button" aria-label="Close details">✕</button>
        <div class="modal-image-wrapper">
          ${imageWrapperContent}
        </div>
        <div class="modal-info">
          <span class="modal-tag">${product.tag}</span>
          <h2 id="modal-title">${product.name}</h2>
          <div class="modal-pricing">
            <span class="modal-mrp">₹${product.mrp}</span>
            <span class="modal-price">₹${product.price}</span>
            <span class="modal-discount">${discount}% OFF</span>
          </div>
          <p class="modal-shipping-note">🚚 <strong>Shipping Info:</strong> Shipping charges vary based on distance and weight (confirmed via WhatsApp before dispatch).</p>
          <p class="modal-description">${product.description || ''}</p>
          <div class="modal-action">
            <button class="btn btn-primary ${buttonClass}" type="button" data-product-id="${product.id}" data-in-cart="${inCart}">${buttonLabel}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const modal = modalRoot.querySelector('#product-details-modal');
  setTimeout(() => {
    modal.classList.add('is-open');
    if (product.images && product.images.length > 0 && typeof Swiper !== 'undefined') {
      new Swiper('.modal-swiper', {
        loop: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
      });
    }
  }, 10);

  const closeBtn = modal.querySelector('.modal-close');
  const closeModal = () => {
    modal.classList.remove('is-open');
    setTimeout(() => { modalRoot.innerHTML = ''; }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  const actionBtn = modal.querySelector('.modal-action .product-btn');
  actionBtn.addEventListener('click', () => {
    if (actionBtn.getAttribute('data-in-cart') === 'true') {
      window.location.href = 'cart.html';
      return;
    }

    addToCart(productId);
    actionBtn.setAttribute('data-in-cart', 'true');
    actionBtn.textContent = 'Go to Cart';
    actionBtn.classList.add('is-in-cart');

    const gridBtn = document.querySelector(`.product-card[data-product-id="${productId}"] .product-btn`);
    if (gridBtn) {
      gridBtn.setAttribute('data-in-cart', 'true');
      gridBtn.textContent = 'Go to Cart';
      gridBtn.classList.add('is-in-cart');
    }
  });
};

renderProducts();
updateCartCount(loadCart());
setupCategoryFilters();

const filterRakhisBtn = document.querySelector('.filter-rakhis-btn');
if (filterRakhisBtn) {
  filterRakhisBtn.addEventListener('click', () => {
    const rakhisTab = document.querySelector('.category-tab[data-category="Rakhis"]');
    if (rakhisTab) rakhisTab.click();
    const productsSec = document.querySelector('#products');
    if (productsSec) productsSec.scrollIntoView({ behavior: 'smooth' });
  });
}

if (productsGrid) {
  productsGrid.addEventListener('click', event => {
    const imageEl = event.target.closest('.product-image');
    if (imageEl) {
      const card = imageEl.closest('.product-card');
      if (card) {
        const productId = card.getAttribute('data-product-id');
        openProductModal(productId);
      }
      return;
    }

    const button = event.target.closest('.product-btn');
    if (!button) return;

    event.preventDefault();

    if (button.getAttribute('data-in-cart') === 'true') {
      window.location.href = 'cart.html';
      return;
    }

    const card = button.closest('.product-card');
    if (card) {
      const productId = card.getAttribute('data-product-id');
      if (productId) addToCart(productId);
    }

    button.setAttribute('data-in-cart', 'true');
    button.textContent = 'Go to Cart';
    button.classList.add('is-added', 'is-in-cart');

    setTimeout(() => { button.classList.remove('is-added'); }, 600);
  });
}

const formatCurrency = value => `₹${value.toLocaleString('en-IN')}`;

const buildCartItems = cart => {
  return cart
    .map(item => {
      const product = productData.find(entry => entry.id === item.id);
      if (!product) return null;
      return {
        ...product,
        qty: item.qty,
        subtotal: product.price * item.qty
      };
    })
    .filter(Boolean);
};

// Render Cart Screen (cart.html)
const renderCart = () => {
  if (!cartItemsRoot || !cartSummaryRoot) return;

  const cart = loadCart();
  const items = buildCartItems(cart);

  if (items.length === 0) {
    cartItemsRoot.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is currently empty.</h3>
        <p>Add artisan pieces to bring Konaseema CocoCraft to your home.</p>
        <a class="btn btn-primary" href="index.html#products">Start Shopping</a>
      </div>
    `;
    cartSummaryRoot.innerHTML = `
      <div class="summary-row">
        <span>Total Items</span>
        <strong>0</strong>
      </div>
      <div class="summary-row">
        <span>Subtotal</span>
        <strong>${formatCurrency(0)}</strong>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${formatCurrency(0)} (Cart Empty)</span>
      </div>
      <div class="summary-row summary-grand">
        <span>Total</span>
        <strong>${formatCurrency(0)}</strong>
      </div>
      <button class="btn btn-primary disabled" type="button" disabled style="opacity: 0.6; cursor: not-allowed; width: 100%;">Checkout (Cart Empty)</button>
      <a class="btn btn-ghost" href="index.html#products" style="text-align: center; margin-top: 10px;">Continue Shopping</a>
    `;
    updateCartCount(cart);
    return;
  }

  cartItemsRoot.innerHTML = items
    .map(item => `
      <article class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-media">
          <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async" />
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-pricing">
            <span class="cart-item-mrp">${formatCurrency(item.mrp)}</span>
            <span class="cart-item-price">${formatCurrency(item.price)}</span>
          </div>
          <div class="cart-qty">
            <button class="qty-btn" type="button" data-action="decrease" aria-label="Decrease quantity">-</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" type="button" data-action="increase" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item-meta">
          <button class="remove-btn" type="button" data-action="remove" aria-label="Remove item">✕</button>
          <span class="cart-item-subtotal">${formatCurrency(item.subtotal)}</span>
        </div>
      </article>
    `)
    .join('');

  const totals = items.reduce(
    (acc, item) => {
      acc.items += item.qty;
      acc.subtotal += item.subtotal;
      return acc;
    },
    { items: 0, subtotal: 0 }
  );

  const grandTotal = totals.subtotal + SHIPPING_FEE;

  cartSummaryRoot.innerHTML = `
    <div class="summary-row">
      <span>Total Items</span>
      <strong>${totals.items}</strong>
    </div>
    <div class="summary-row">
      <span>Subtotal</span>
      <strong>${formatCurrency(totals.subtotal)}</strong>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>${formatCurrency(SHIPPING_FEE)}</span>
    </div>
    <div class="summary-row summary-grand">
      <span>Total</span>
      <strong>${formatCurrency(grandTotal)}</strong>
    </div>
    <a class="btn btn-primary" href="checkout.html" style="text-align: center;">Proceed to Checkout</a>
    <a class="btn btn-ghost" href="index.html#products" style="text-align: center; margin-top: 10px;">Continue Shopping</a>
  `;

  updateCartCount(cart);
};

const updateCartItem = (productId, action) => {
  const cart = loadCart();
  const target = cart.find(item => item.id === productId);

  if (!target) return;

  if (action === 'increase') {
    target.qty += 1;
  } else if (action === 'decrease') {
    target.qty = Math.max(1, target.qty - 1);
  } else if (action === 'remove') {
    const nextCart = cart.filter(item => item.id !== productId);
    saveCart(nextCart);
    renderCart();
    return;
  }

  saveCart(cart);
  renderCart();
};

if (cartItemsRoot) {
  cartItemsRoot.addEventListener('click', event => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const cartItem = actionButton.closest('.cart-item');
    if (!cartItem) return;
    const productId = cartItem.getAttribute('data-product-id');
    const action = actionButton.getAttribute('data-action');
    if (productId && action) updateCartItem(productId, action);
  });
}

renderCart();

// Coupon Management
let appliedCouponCode = '';
let discountPercent = 0;

const renderCheckout = () => {
  if (!checkoutSummaryList || !checkoutSummaryTotals) return;

  const cart = loadCart();
  const items = buildCartItems(cart);

  if (items.length === 0) {
    checkoutSummaryList.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty.</h3>
        <p>Add artisan pieces before continuing to checkout.</p>
        <a class="btn btn-primary" href="index.html#products">Back to Shop</a>
      </div>
    `;
    checkoutSummaryTotals.innerHTML = `
      <div><span>Subtotal</span><span>${formatCurrency(0)}</span></div>
      <div><span>Shipping</span><span>${formatCurrency(0)}</span></div>
      <div class="summary-grand"><span>Total</span><strong>${formatCurrency(0)}</strong></div>
    `;
    if (checkoutSubmitBtn) {
      checkoutSubmitBtn.disabled = true;
      checkoutSubmitBtn.style.opacity = '0.6';
      checkoutSubmitBtn.textContent = 'Cart is Empty';
    }
    updateCartCount(cart);
    return;
  }

  if (checkoutSubmitBtn) {
    checkoutSubmitBtn.disabled = false;
    checkoutSubmitBtn.style.opacity = '1';
    checkoutSubmitBtn.textContent = 'Place Order & Confirm';
  }

  checkoutSummaryList.innerHTML = items
    .map(item => `
      <div class="summary-item">
        <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async" />
        <div>
          <p>${item.name}</p>
          <span>Qty ${item.qty} · <span class="summary-item-mrp">${formatCurrency(item.mrp)}</span> ${formatCurrency(item.price)}</span>
        </div>
        <strong>${formatCurrency(item.subtotal)}</strong>
      </div>
    `)
    .join('');

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Automatic Coupon Revalidation
  let discountAmount = 0;
  if (appliedCouponCode && VALID_COUPONS[appliedCouponCode]) {
    const coupon = VALID_COUPONS[appliedCouponCode];
    if (subtotal > coupon.minSubtotal) {
      discountPercent = coupon.discount;
      discountAmount = Math.round(subtotal * discountPercent);
      if (coupon.maxDiscount !== undefined && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      const oldCode = appliedCouponCode;
      appliedCouponCode = '';
      discountPercent = 0;
      const couponInput = document.querySelector('#coupon-input');
      const couponMessage = document.querySelector('#coupon-message');
      if (couponInput) couponInput.value = '';
      if (couponMessage) {
        couponMessage.innerHTML = `Coupon <strong>${oldCode}</strong> removed: Requires product subtotal strictly above ${formatCurrency(coupon.minSubtotal)}.`;
        couponMessage.className = 'coupon-message error';
      }
    }
  }

  const totalAmount = subtotal - discountAmount + SHIPPING_FEE;

  let totalsHtml = `
    <div>
      <span>Subtotal</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>
  `;

  if (discountAmount > 0) {
    totalsHtml += `
      <div class="discount-row">
        <span>Discount (${appliedCouponCode})</span>
        <span style="color: #1f6b3b; font-weight: 700;">-${formatCurrency(discountAmount)}</span>
      </div>
    `;
  }

  totalsHtml += `
    <div>
      <span>Shipping Fee</span>
      <span>${formatCurrency(SHIPPING_FEE)}</span>
    </div>
    <div class="summary-grand">
      <span>Total Amount</span>
      <strong>${formatCurrency(totalAmount)}</strong>
    </div>
  `;

  checkoutSummaryTotals.innerHTML = totalsHtml;
  updateCartCount(cart);
};

const handleApplyCoupon = () => {
  const couponInput = document.querySelector('#coupon-input');
  const couponMessage = document.querySelector('#coupon-message');

  if (!couponInput || !couponMessage) return;

  const code = couponInput.value.trim().toUpperCase();

  if (code === '') {
    couponMessage.textContent = 'Please enter a coupon code.';
    couponMessage.className = 'coupon-message error';
    return;
  }

  if (VALID_COUPONS[code]) {
    const coupon = VALID_COUPONS[code];
    const cart = loadCart();
    const items = buildCartItems(cart);
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    if (subtotal > coupon.minSubtotal) {
      appliedCouponCode = code;
      discountPercent = coupon.discount;
      let couponDiscountAmount = Math.round(subtotal * discountPercent);
      if (coupon.maxDiscount !== undefined && couponDiscountAmount > coupon.maxDiscount) {
        couponDiscountAmount = coupon.maxDiscount;
      }
      couponMessage.innerHTML = `✓ Coupon <strong>${code}</strong> applied!<br/>Discount: ${formatCurrency(couponDiscountAmount)}`;
      couponMessage.className = 'coupon-message success';
      renderCheckout();
    } else {
      appliedCouponCode = '';
      discountPercent = 0;
      couponMessage.textContent = `Coupon ${code} requires product subtotal strictly above ${formatCurrency(coupon.minSubtotal)}.`;
      couponMessage.className = 'coupon-message error';
      renderCheckout();
    }
  } else {
    appliedCouponCode = '';
    discountPercent = 0;
    couponMessage.textContent = 'Invalid or expired coupon code.';
    couponMessage.className = 'coupon-message error';
    renderCheckout();
  }
};

const setupCouponListeners = () => {
  const applyCouponBtn = document.querySelector('#apply-coupon-btn');
  const couponInput = document.querySelector('#coupon-input');

  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', handleApplyCoupon);
  }

  if (couponInput) {
    couponInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleApplyCoupon();
      }
    });
  }
};

renderCheckout();
setupCouponListeners();

// Build WhatsApp Pre-filled Message
const buildWhatsAppMessage = (orderId, customer, items, totalAmount, discountAmount = 0, subtotal = 0) => {
  const lines = [];
  lines.push(`*Konaseema CocoCraft - Order Confirmation*`);
  lines.push(`*Order ID:* #${orderId}`);
  lines.push(``);
  lines.push(`*Customer Details:*`);
  lines.push(`• Name: ${customer.name}`);
  lines.push(`• Mobile: ${customer.phone}`);
  lines.push(`• Address: ${customer.address}`);
  if (customer.state) lines.push(`• State: ${customer.state}`);
  lines.push(`• Pincode: ${customer.pincode}`);
  lines.push(``);
  lines.push(`*Items Ordered:*`);

  items.forEach(item => {
    lines.push(`• ${item.name} × ${item.qty} — ${formatCurrency(item.subtotal)}`);
  });

  lines.push(``);
  lines.push(`*Subtotal:* ${formatCurrency(subtotal)}`);
  if (discountAmount > 0) {
    lines.push(`*Discount (${appliedCouponCode || 'Coupon'}):* -${formatCurrency(discountAmount)}`);
  }
  lines.push(`*Shipping:* ${formatCurrency(SHIPPING_FEE)}`);
  lines.push(`*Grand Total: ${formatCurrency(totalAmount)}*`);
  lines.push(``);
  lines.push(`Please confirm availability and dispatch details. Thank you!`);

  return lines.join('\n');
};

// Render Order Confirmation Screen (CRITICAL 2)
const renderOrderConfirmationScreen = (savedData) => {
  const { orderId, customer, items, subtotal, discount, shipping, total } = savedData;
  const checkoutLayout = document.querySelector('#checkout-layout');
  const checkoutHero = document.querySelector('.checkout-hero');

  if (checkoutLayout) checkoutLayout.style.display = 'none';
  if (checkoutHero) checkoutHero.style.display = 'none';
  if (checkoutErrorBanner) checkoutErrorBanner.style.display = 'none';

  if (!orderConfirmationRoot) return;

  const waMessage = buildWhatsAppMessage(orderId, customer, items, total, discount, subtotal);
  const waUrl = `https://wa.me/919542288472?text=${encodeURIComponent(waMessage)}`;

  orderConfirmationRoot.style.display = 'block';
  orderConfirmationRoot.innerHTML = `
    <div class="confirmation-card">
      <div class="confirmation-icon">✓</div>
      <span class="confirmation-eyebrow">ORDER CONFIRMED</span>
      <h2>Thank you for your order, ${customer.name}!</h2>
      <p class="confirmation-order-id">Your Unique Order ID: <strong>#${orderId}</strong></p>
      
      <div class="confirmation-section">
        <h3>Delivery Address</h3>
        <p><strong>${customer.name}</strong> (${customer.phone})</p>
        <p>${customer.address}, ${customer.state} - ${customer.pincode}</p>
      </div>

      <div class="confirmation-section">
        <h3>Order Items</h3>
        <div class="confirmation-items-list">
          ${items.map(item => `
            <div class="confirmation-item-row">
              <span class="item-name">${item.name} × ${item.qty}</span>
              <span class="item-subtotal">${formatCurrency(item.subtotal)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="confirmation-section confirmation-financials">
        <div class="financial-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        ${discount > 0 ? `<div class="financial-row discount"><span>Discount</span><span>-${formatCurrency(discount)}</span></div>` : ''}
        <div class="financial-row"><span>Shipping</span><span>${formatCurrency(shipping)}</span></div>
        <div class="financial-row grand-total"><span>Total Amount</span><strong>${formatCurrency(total)}</strong></div>
      </div>

      <div class="confirmation-actions">
        <a class="btn btn-whatsapp-large" href="${waUrl}" target="_blank" rel="noopener">
          <span>💬 Send Order Details on WhatsApp</span>
        </a>
        <a class="btn btn-ghost" href="index.html#products">Continue Shopping</a>
      </div>

      <div class="confirmation-disclaimer">
        ℹ️ <strong>Note:</strong> Opening WhatsApp allows you to send your order details to our support team for instant confirmation. Opening WhatsApp does not charge your account; payment arrangements will be finalized upon order confirmation. You can reopen this WhatsApp link anytime.
      </div>
    </div>
  `;

  // Scroll to top of confirmation
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Server Order Submission API Call with Mock Fallback (CRITICAL 1 & 2)
const submitOrderToServer = async (payload) => {
  if (USE_MOCK_API) {
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check Mock Idempotency Cache
    const key = payload.idempotencyKey;
    if (mockOrderDatabase.has(key)) {
      return mockOrderDatabase.get(key);
    }

    // Generate Mock Server Order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderId = `KCC-${dateStr}-${mockOrderSeq++}`;

    const items = payload.items.map(it => {
      const prod = productData.find(p => p.id === it.id);
      return {
        id: it.id,
        name: prod ? prod.name : it.id,
        price: prod ? prod.price : 0,
        qty: it.qty,
        subtotal: (prod ? prod.price : 0) * it.qty
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    let discount = 0;
    if (payload.couponCode && VALID_COUPONS[payload.couponCode]) {
      const rule = VALID_COUPONS[payload.couponCode];
      if (subtotal > rule.minSubtotal) {
        discount = Math.round(subtotal * rule.discount);
        if (rule.maxDiscount !== Infinity && discount > rule.maxDiscount) {
          discount = rule.maxDiscount;
        }
      }
    }

    const response = {
      status: 'success',
      success: true,
      orderId: orderId,
      data: {
        orderId: orderId,
        customer: payload.customer,
        items: items,
        subtotal: subtotal,
        discount: discount,
        shipping: SHIPPING_FEE,
        total: subtotal - discount + SHIPPING_FEE,
        couponCode: payload.couponCode
      }
    };

    mockOrderDatabase.set(key, response);
    return response;
  }

  // Live Server Call
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// Checkout Form Submission Handler
if (checkoutForm) {
  checkoutForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (checkoutErrorBanner) {
      checkoutErrorBanner.style.display = 'none';
      checkoutErrorBanner.textContent = '';
    }

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const cart = loadCart();
    const items = buildCartItems(cart);

    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const customer = {
      name: checkoutName ? checkoutName.value.trim() : '',
      phone: checkoutPhone ? checkoutPhone.value.trim() : '',
      address: checkoutAddress ? checkoutAddress.value.trim() : '',
      state: checkoutState ? checkoutState.value.trim() : '',
      pincode: checkoutPincode ? checkoutPincode.value.trim() : ''
    };

    const idempotencyKey = getIdempotencyKey();

    const orderPayload = {
      idempotencyKey: idempotencyKey,
      customer: customer,
      items: cart.map(item => ({ id: item.id, qty: item.qty })),
      couponCode: appliedCouponCode
    };

    // Disable Submit Button & Show Spinner/Processing
    if (checkoutSubmitBtn) {
      checkoutSubmitBtn.disabled = true;
      checkoutSubmitBtn.style.opacity = '0.7';
      checkoutSubmitBtn.textContent = 'Processing order & generating ID...';
    }

    try {
      const responseData = await submitOrderToServer(orderPayload);

      // Validate Server Response strictly
      const isSuccess = responseData && (responseData.status === 'success' || responseData.success === true);
      const savedOrderId = responseData && (responseData.orderId || (responseData.data && responseData.data.orderId));

      if (!isSuccess || !savedOrderId) {
        throw new Error(responseData.message || 'Server did not confirm order saving.');
      }

      const confirmedDetails = responseData.data || {
        orderId: savedOrderId,
        customer: customer,
        items: items,
        subtotal: items.reduce((s, i) => s + i.subtotal, 0),
        discount: 0,
        shipping: SHIPPING_FEE,
        total: items.reduce((s, i) => s + i.subtotal, 0) + SHIPPING_FEE
      };

      // Confirmed Success: Clear Cart & Idempotency Key
      saveCart([]);
      updateCartCount([]);
      clearIdempotencyKey();

      // Render Confirmation / Thank You Screen
      renderOrderConfirmationScreen(confirmedDetails);

      // Automatically open pre-filled WhatsApp message
      const waMessage = buildWhatsAppMessage(
        confirmedDetails.orderId,
        confirmedDetails.customer,
        confirmedDetails.items,
        confirmedDetails.total,
        confirmedDetails.discount || 0,
        confirmedDetails.subtotal
      );
      const waUrl = `https://wa.me/919542288472?text=${encodeURIComponent(waMessage)}`;
      
      // Auto-launch WhatsApp message tab
      try {
        window.open(waUrl, '_blank');
      } catch (e) {
        window.location.href = waUrl;
      }

    } catch (error) {
      // Failure / Error: Keep Cart intact in localStorage, re-enable button, show error
      if (checkoutSubmitBtn) {
        checkoutSubmitBtn.disabled = false;
        checkoutSubmitBtn.style.opacity = '1';
        checkoutSubmitBtn.textContent = 'Retry Placing Order';
      }

      if (checkoutErrorBanner) {
        checkoutErrorBanner.style.display = 'block';
        checkoutErrorBanner.innerHTML = `
          ❌ <strong>Submission Failed:</strong> ${error.message || 'Unable to connect to order server.'}<br/>
          Your cart items are saved. Please check your details and try again.
        `;
        checkoutErrorBanner.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert(`Order submission failed: ${error.message || 'Please try again.'}`);
      }
    }
  });
}

// Policy Modal System
const POLICY_CONTENTS = {
  shipping: {
    title: 'Shipping & Delivery Policy',
    body: `
      <p><strong>Variable Shipping Charges:</strong> Shipping charges vary based on destination distance and total package weight. Final shipping charges will be calculated and confirmed with you on WhatsApp prior to order dispatch.</p>
      <p><strong>Dispatch Timeline:</strong> Orders are processed and dispatched within 2 to 4 business days from Konaseema, Andhra Pradesh.</p>
      <p><strong>Tracking:</strong> Tracking details will be shared directly via WhatsApp once your package is shipped.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy',
    body: `
      <p><strong>Data Usage:</strong> We collect customer details (name, phone number, delivery address) solely to fulfill your order and send confirmation updates.</p>
      <p><strong>No Data Sale:</strong> We never sell, rent, or trade your personal information to third parties.</p>
    `
  },
  terms: {
    title: 'Terms of Service',
    body: `
      <p><strong>Handcrafted Authenticity:</strong> All items listed are subject to raw material availability. Images represent our original handcrafted designs.</p>
      <p><strong>Order Verification:</strong> Orders placed generate a unique Order ID and are verified via WhatsApp for smooth delivery.</p>
    `
  }
};

const openPolicyModal = (policyKey) => {
  const policy = POLICY_CONTENTS[policyKey];
  if (!policy) return;

  const modalRoot = document.querySelector('#policy-modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="policy-modal" id="policy-modal" role="dialog" aria-modal="true">
      <div class="policy-modal-content">
        <button class="modal-close" type="button" aria-label="Close policy">✕</button>
        <h2>${policy.title}</h2>
        <div class="policy-modal-body">${policy.body}</div>
      </div>
    </div>
  `;

  const modal = modalRoot.querySelector('#policy-modal');
  setTimeout(() => modal.classList.add('is-open'), 10);

  const closeBtn = modal.querySelector('.modal-close');
  const closeModal = () => {
    modal.classList.remove('is-open');
    setTimeout(() => { modalRoot.innerHTML = ''; }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
};

document.addEventListener('click', event => {
  const btn = event.target.closest('[data-policy]');
  if (btn) {
    const policyKey = btn.getAttribute('data-policy');
    if (policyKey) openPolicyModal(policyKey);
  }
});
