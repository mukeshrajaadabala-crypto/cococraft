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
    id: 'bowl',
    name: 'Coconut Shell Bowl',
    price: 299,
    tag: 'Hand-polished',
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/q_auto/f_auto/v1778856533/bowl_f2ra5t.webp',
    alt: 'Coconut shell bowl'
  },
  {
    id: 'earrings',
    name: 'Coconut Shell Earrings',
    price: 199,
    tag: 'Lightweight',
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/q_auto/f_auto/v1778856589/earrings.avif',
    alt: 'Coconut shell earrings'
  },
  {
    id: 'rakhi',
    name: 'Coconut Shell Rakhi',
    price: 199,
    tag: 'Eco-friendly',
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/q_auto/f_auto/v1778856578/coconut_shell_rakhi_bsygwv.jpg',
    alt: 'Coconut shell rakhi'
  },
  {
    id: 'lamp',
    name: 'Coconut Shell Lamp',
    price: 699,
    tag: 'Ambient glow',
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/q_auto/f_auto/v1778856618/lamp_tbnou0.webp',
    alt: 'Coconut shell lamp'
  },
  {
    id: 'cup',
    name: 'Coconut Shell Cup',
    price: 249,
    tag: 'Natural finish',
    image:
      'https://res.cloudinary.com/dd1d5fhl4/image/upload/q_auto/f_auto/v1778856591/cup_cuibyf.jpg',
    alt: 'Coconut shell cup'
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

const renderProducts = () => {
  if (!productsGrid) {
    return;
  }

  const cart = loadCart();
  const cartIds = new Set(cart.map(item => item.id));

  productsGrid.innerHTML = productData
    .map(product => {
      const inCart = cartIds.has(product.id);
      const buttonLabel = inCart ? 'Go to Cart' : 'Add to Cart';
      const buttonClass = `product-btn${inCart ? ' is-in-cart' : ''}`;

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.alt}" loading="lazy" decoding="async" />
          </div>
          <div class="product-body">
            <h3>${product.name}</h3>
            <div class="product-meta">
              <span>${product.tag}</span>
              <span class="product-price">₹${product.price}</span>
            </div>
            <button class="${buttonClass}" type="button" data-in-cart="${inCart}">${buttonLabel}</button>
          </div>
        </article>
      `;
    })
    .join('');
};

renderProducts();

updateCartCount(loadCart());

if (productsGrid) {
  productsGrid.addEventListener('click', event => {
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
            <span class="cart-item-price">${formatCurrency(item.price)}</span>
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
            <span>Qty ${item.qty} · ${formatCurrency(item.price)}</span>
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

  checkoutSummaryTotals.innerHTML = `
    <div>
      <span>Subtotal</span>
      <span>${formatCurrency(totals.price)}</span>
    </div>
    <div>
      <span>Shipping</span>
      <span>${formatCurrency(SHIPPING_FEE)}</span>
    </div>
    <div class="summary-grand">
      <span>Total</span>
      <strong>${formatCurrency(totals.price + SHIPPING_FEE)}</strong>
    </div>
  `;

  updateCartCount(cart);
};

renderCheckout();

const generateOrderId = () => {
  const raw = window.localStorage.getItem(ORDER_COUNTER_KEY);
  const lastNumber = Number.parseInt(raw, 10);
  const nextNumber = Number.isFinite(lastNumber) && lastNumber > 0 ? lastNumber + 1 : 1;

  window.localStorage.setItem(ORDER_COUNTER_KEY, nextNumber.toString());

  return `CCK${String(nextNumber).padStart(5, '0')}`;
};

const buildWhatsAppMessage = (orderId, customer, items, total) => {
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
    const totalAmount = totals.price + SHIPPING_FEE;
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

      const message = buildWhatsAppMessage(orderId, customer, items, totalAmount);
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
