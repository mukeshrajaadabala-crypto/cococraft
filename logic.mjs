document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const target = document.querySelector(anchor.getAttribute('href'));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const productData = [
  {
    id: 'WR001',
    name: 'Wooden Rakhi-Packof 1 (WR001)',
    mrp: 99,
    price: 80,
    category: 'Rakhis',
    subcategory: 'Wooden rakhis',
    tag: 'Eco-Friendly Wooden Rakhi (Packof 1)',
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785352016/Wooden_Rakhis_pack_of_1_je8b6n.png',
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
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785351521/Wooden_Rakhis_Combo_jhlbmz.png',
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
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785931822/CCS001_biiqcs.jpg',
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
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785931837/CCS002_pytuoa.jpg',
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
    id: 'CCS007',
    name: 'Coconut Shell Rakhi-Packof 1 (CCS007)',
    mrp: 199,
    price: 99,
    category: 'Rakhis',
    subcategory: 'Coconut shell rakhis',
    tag: 'Eco-Friendly Hand-Carved Coconut Shell Rakhi',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106432/CCS007_yugwvc.jpg',
    images: [
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106432/CCS007_yugwvc.jpg',
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106440/CCS007.1_ize7u7.jpg',
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1786106446/CCS7.2_f4nk1s.jpg'
    ],
    alt: 'Coconut Shell Rakhi-Packof 1 (CCS007)',
    description: 'A premium hand-crafted coconut shell rakhi featuring fine geometric shapes and detailed concentric circle carving. Sustainable, skin-safe, biodegradable, and bound with high-quality organic threads.'
  }
];

if (typeof Swiper !== 'undefined') {
  new Swiper('.hero-swiper', {
    loop: true,
    speed: 900,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
}

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

const CART_KEY = 'kc_cart';
const ORDER_COUNTER_KEY = 'kc_order_counter';
const SHIPPING_FEE = 100;
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhSPSEFz44FcxDVNsLqgHeKqR6BQyfBJE9lty_dqJc_4sjOPJvhcJ1jYk-_6mp8sSJ3g/exec';
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

const loadCart = () => {
  const raw = window.localStorage.getItem(CART_KEY);

  if (!raw) {
    return [];
  }

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
  if (!cartCount) {
    return;
  }

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

let activeCategory = 'all';
let activeSubcategory = 'all';

const renderProducts = () => {
  if (!productsGrid) {
    return;
  }

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
    .sort((a, b) => b.price - a.price);

  if (filteredProducts.length === 0) {
    let categoryLabel = activeCategory;
    if (categoryLabel === 'KeyChains') categoryLabel = 'Keychains';
    if (categoryLabel === 'EarRings') categoryLabel = 'Earrings';

    productsGrid.innerHTML = `
      <div class="coming-soon-card">
        <h3>Crafting in Progress...</h3>
        <p>We are hand-carving new, eco-friendly ${categoryLabel.toLowerCase()} from natural coconut shells. Stay tuned for our next launch!</p>
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

  if (!categoryTabsContainer) {
    return;
  }

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
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      });
    }
  }, 10);

  const closeBtn = modal.querySelector('.modal-close');
  const closeModal = () => {
    modal.classList.remove('is-open');
    setTimeout(() => {
      modalRoot.innerHTML = '';
    }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
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
    if (rakhisTab) {
      rakhisTab.click();
    }
    const productsSec = document.querySelector('#products');
    if (productsSec) {
      productsSec.scrollIntoView({ behavior: 'smooth' });
    }
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

    if (!button) {
      return;
    }

    event.preventDefault();

    if (button.getAttribute('data-in-cart') === 'true') {
      window.location.href = 'cart.html';
      return;
    }

    const card = button.closest('.product-card');

    if (card) {
      const productId = card.getAttribute('data-product-id');

      if (productId) {
        addToCart(productId);
      }
    }

    button.setAttribute('data-in-cart', 'true');
    button.textContent = 'Go to Cart';
    button.classList.add('is-added', 'is-in-cart');

    setTimeout(() => {
      button.classList.remove('is-added');
    }, 600);
  });
}

const formatCurrency = value => `₹${value.toLocaleString('en-IN')}`;

const buildCartItems = cart => {
  const items = cart
    .map(item => {
      const product = productData.find(entry => entry.id === item.id);

      if (!product) {
        return null;
      }

      return {
        ...product,
        qty: item.qty,
        subtotal: product.price * item.qty
      };
    })
    .filter(Boolean);

  return items;
};

const renderCart = () => {
  if (!cartItemsRoot || !cartSummaryRoot) {
    return;
  }

  const cart = loadCart();
  const items = buildCartItems(cart);

  if (items.length === 0) {
    cartItemsRoot.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is currently empty.</h3>
        <p>Add artisan pieces to bring Konaseema CocoCraft to your home.</p>
        <a class="btn btn-primary" href="index.html#products">Start shopping</a>
      </div>
    `;
    cartSummaryRoot.innerHTML = `
      <div class="summary-row">
        <span>Total Items</span>
        <strong>0</strong>
      </div>
      <div class="summary-row">
        <span>Total Price</span>
        <strong>${formatCurrency(0)}</strong>
      </div>
      <a class="btn btn-primary" href="checkout.html" aria-disabled="true">Checkout</a>
      <a class="btn btn-ghost" href="index.html#products">Continue Shopping</a>
    `;
    updateCartCount(cart);
    return;
  }

  cartItemsRoot.innerHTML = items
    .map(item => {
      return `
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
      `;
    })
    .join('');

  const totals = items.reduce(
    (acc, item) => {
      acc.items += item.qty;
      acc.price += item.subtotal;
      return acc;
    },
    { items: 0, price: 0 }
  );

  cartSummaryRoot.innerHTML = `
    <div class="summary-row">
      <span>Total Items</span>
      <strong>${totals.items}</strong>
    </div>
    <div class="summary-row">
      <span>Total Price</span>
      <strong>${formatCurrency(totals.price)}</strong>
    </div>
    <a class="btn btn-primary" href="checkout.html">Checkout</a>
    <a class="btn btn-ghost" href="index.html#products">Continue Shopping</a>
  `;

  updateCartCount(cart);
};

const updateCartItem = (productId, action) => {
  const cart = loadCart();
  const target = cart.find(item => item.id === productId);

  if (!target) {
    return;
  }

  if (action === 'increase') {
    target.qty += 1;
  }

  if (action === 'decrease') {
    target.qty = Math.max(1, target.qty - 1);
  }

  if (action === 'remove') {
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

    if (!actionButton) {
      return;
    }

    const cartItem = actionButton.closest('.cart-item');

    if (!cartItem) {
      return;
    }

    const productId = cartItem.getAttribute('data-product-id');
    const action = actionButton.getAttribute('data-action');

    if (!productId || !action) {
      return;
    }

    updateCartItem(productId, action);
  });
}

renderCart();

const VALID_COUPONS = {
  'RUDRANI5': { minSubtotal: 200, discount: 0.05, maxDiscount: Infinity },
  'RUDRANI10': { minSubtotal: 1000, discount: 0.10, maxDiscount: Infinity },
  // 'COCO10': { minSubtotal: 100, discount: 0.10, maxDiscount: 150 },
  'RAKHI5': { minSubtotal: 100, discount: 0.05, maxDiscount: 150 }
};

let appliedCouponCode = '';
let discountPercent = 0;

const renderCheckout = () => {
  if (!checkoutSummaryList || !checkoutSummaryTotals) {
    return;
  }

  const cart = loadCart();
  const items = buildCartItems(cart);

  if (items.length === 0) {
    checkoutSummaryList.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty.</h3>
        <p>Add artisan pieces before continuing to checkout.</p>
        <a class="btn btn-primary" href="index.html#products">Back to shop</a>
      </div>
    `;
    checkoutSummaryTotals.innerHTML = `
      <div>
        <span>Subtotal</span>
        <span>${formatCurrency(0)}</span>
      </div>
      <div>
        <span>Shipping</span>
        <span>${formatCurrency(SHIPPING_FEE)}</span>
      </div>
      <div class="summary-grand">
        <span>Total</span>
        <strong>${formatCurrency(SHIPPING_FEE)}</strong>
      </div>
    `;
    updateCartCount(cart);
    return;
  }

  checkoutSummaryList.innerHTML = items
    .map(item => {
      return `
        <div class="summary-item">
          <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async" />
          <div>
            <p>${item.name}</p>
            <span>Qty ${item.qty} · <span class="summary-item-mrp">${formatCurrency(item.mrp)}</span> ${formatCurrency(item.price)}</span>
          </div>
          <strong>${formatCurrency(item.subtotal)}</strong>
        </div>
      `;
    })
    .join('');

  const totals = items.reduce(
    (acc, item) => {
      acc.items += item.qty;
      acc.price += item.subtotal;
      return acc;
    },
    { items: 0, price: 0 }
  );

  const subtotal = totals.price;

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
      appliedCouponCode = '';
      discountPercent = 0;
      const couponInput = document.querySelector('#coupon-input');
      const couponMessage = document.querySelector('#coupon-message');
      if (couponInput) couponInput.value = '';
      if (couponMessage) {
        couponMessage.textContent = `This coupon is only applicable for orders above ${formatCurrency(coupon.minSubtotal)}.`;
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
        <span>Discount (${Math.round(discountPercent * 100)}%)</span>
        <span style="color: #1f6b3b;">-${formatCurrency(discountAmount)}</span>
      </div>
    `;
  }

  totalsHtml += `
    <div>
      <span>Shipping</span>
      <span>${formatCurrency(SHIPPING_FEE)}</span>
    </div>
    <div class="summary-grand">
      <span>Total</span>
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
      couponMessage.innerHTML = `✓ Coupon <strong>${code}</strong> applied<br/>${Math.round(discountPercent * 100)}% discount<br/>Discount: ${formatCurrency(couponDiscountAmount)}`;
      couponMessage.className = 'coupon-message success';
      renderCheckout();
    } else {
      appliedCouponCode = '';
      discountPercent = 0;
      couponMessage.textContent = `This coupon is only applicable for orders above ${formatCurrency(coupon.minSubtotal)}.`;
      couponMessage.className = 'coupon-message error';
      renderCheckout();
    }
  } else {
    appliedCouponCode = '';
    discountPercent = 0;
    couponMessage.textContent = 'Invalid or unavailable coupon code.';
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

const generateOrderId = () => {
  const raw = window.localStorage.getItem(ORDER_COUNTER_KEY);
  const lastNumber = Number.parseInt(raw, 10);
  const nextNumber = Number.isFinite(lastNumber) && lastNumber > 0 ? lastNumber + 1 : 1;

  window.localStorage.setItem(ORDER_COUNTER_KEY, nextNumber.toString());

  return `CCK${String(nextNumber).padStart(5, '0')}`;
};

const buildWhatsAppMessage = (orderId, customer, items, total, discountAmount = 0) => {
  const lines = [];

  lines.push(`*New order #${orderId}*`);
  lines.push('from CocoCraft storefront');
  lines.push('');
  lines.push(`*Customer:* ${customer.name}`);
  lines.push(`*Mobile:* ${customer.phone}`);
  lines.push(`*Address:* ${customer.address}`);
  lines.push(`*State:* ${customer.state}`);
  lines.push(`*Pincode:* ${customer.pincode}`);
  lines.push('');
  lines.push('*Items:*');

  items.forEach(item => {
    lines.push(`• ${item.name} × ${item.qty} — ${formatCurrency(item.subtotal)}`);
  });

  lines.push('');
  if (discountAmount > 0) {
    const pct = discountPercent > 0 ? Math.round(discountPercent * 100) : 5;
    lines.push(`*Discount (${pct}%):* -${formatCurrency(discountAmount)}`);
  }
  lines.push(`*Shipping:* ${formatCurrency(SHIPPING_FEE)}`);
  lines.push(`*Total: ${formatCurrency(total)}*`);

  return lines.join('\n');
};

if (checkoutForm) {
  checkoutForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const cart = loadCart();
    const items = buildCartItems(cart);

    if (items.length === 0) {
      return;
    }

    const totals = items.reduce(
      (acc, item) => {
        acc.price += item.subtotal;
        return acc;
      },
      { price: 0 }
    );

    const customer = {
      name: checkoutName ? checkoutName.value.trim() : '',
      phone: checkoutPhone ? checkoutPhone.value.trim() : '',
      address: checkoutAddress ? checkoutAddress.value.trim() : '',
      state: checkoutState ? checkoutState.value.trim() : '',
      pincode: checkoutPincode ? checkoutPincode.value.trim() : ''
    };

    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    const orderId = generateOrderId();

    const subtotal = totals.price;
    let discountAmount = 0;
    if (appliedCouponCode && VALID_COUPONS[appliedCouponCode]) {
      const coupon = VALID_COUPONS[appliedCouponCode];
      if (subtotal > coupon.minSubtotal) {
        discountAmount = Math.round(subtotal * coupon.discount);
        if (coupon.maxDiscount !== undefined && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      }
    }
    const totalAmount = subtotal - discountAmount + SHIPPING_FEE;
    const orderDate = new Date().toISOString();

    const orderPayload = {
      orderId,
      name: customer.name,
      phone: customer.phone,
      address: customer.state ? `${customer.address}, ${customer.state}` : customer.address,
      pincode: customer.pincode,
      products: items.map(item => `${item.name} x ${item.qty}`).join(', '),
      quantity: items.reduce((sum, item) => sum + item.qty, 0),
      amount: totalAmount,
      date: orderDate
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Placing order...';
    }

    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false || (data.status && data.status !== 'success')) {
        throw new Error(data.message || 'Unable to place the order.');
      }

      saveCart([]);
      updateCartCount([]);

      const message = buildWhatsAppMessage(orderId, customer, items, totalAmount, discountAmount);
      const encodedMessage = encodeURIComponent(message);

      window.location.href = `https://wa.me/9542288472?text=${encodedMessage}`;
    } catch (error) {
      alert(error.message || 'We could not submit your order. Please try again.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Place order & send on WhatsApp';
      }
    }
  });
}

