/**
 * Konaseema CocoCraft - Google Apps Script Backend (Production Order Handler)
 * 
 * Features:
 * 1. Server-side unique Order ID generation (e.g. KCC-20260917-8492)
 * 2. Idempotency key tracking via CacheService (prevents duplicate orders on retries)
 * 3. Server-side validation of products, quantities, prices, and coupons
 * 4. Itemized calculation of Subtotal, Coupon Discount, Flat Shipping (₹100), and Grand Total
 * 5. Returns explicit JSON response { status: "success", success: true, orderId: "...", data: {...} }
 */

// Trusted Product Catalog
const PRODUCT_CATALOG = {
  'WR001': { name: 'Wooden Rakhi-Packof 1 (WR001)', price: 80 },
  'WR002': { name: 'Wooden Rakhi-Packof 3 (WR002)', price: 198 },
  'CCS001': { name: 'Coconut Shell Rakhi-Packof 1 (CCS001)', price: 99 },
  'CCS002': { name: 'Coconut Shell Rakhi-Packof 1 (CCS002)', price: 99 },
  'KC001': { name: 'Govinda Blessings Keychain-Packof 1 (KC001)', price: 65 },
  'WR003': { name: 'Wooden Rakhi-Packof 1 (WR003)', price: 99 }
};

// Trusted Coupon Rules
const COUPON_RULES = {
  // 'RAKHI5': { minSubtotal: 100, discountPercent: 0.05, maxDiscount: 150 },
  'RUDRANI5': { minSubtotal: 200, discountPercent: 0.05, maxDiscount: Infinity },
  'RUDRANI10': { minSubtotal: 1000, discountPercent: 0.10, maxDiscount: Infinity }
};

const SHIPPING_FEE = 100;

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', success: false, message: 'Invalid payload.' }, 400);
    }

    const payload = JSON.parse(e.postData.contents);
    const idempotencyKey = payload.idempotencyKey || '';

    // Check Idempotency Cache
    if (idempotencyKey) {
      const cache = CacheService.getScriptCache();
      const cachedResponse = cache.get(idempotencyKey);
      if (cachedResponse) {
        return jsonResponse(JSON.parse(cachedResponse), 200);
      }
    }

    // Customer Validation
    const customer = payload.customer || {
      name: payload.name || '',
      phone: payload.phone || '',
      address: payload.address || '',
      state: payload.state || '',
      pincode: payload.pincode || ''
    };

    if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
      return jsonResponse({ status: 'error', success: false, message: 'Missing required customer details.' }, 400);
    }

    // Process & Validate Items
    let items = payload.items || [];
    
    // Fallback if legacy product string was sent
    if (items.length === 0 && payload.products) {
      return jsonResponse({ status: 'error', success: false, message: 'Cart items missing or invalid format.' }, 400);
    }

    let subtotal = 0;
    const validatedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = PRODUCT_CATALOG[item.id];
      if (!product) {
        return jsonResponse({ status: 'error', success: false, message: 'Unrecognized product ID: ' + item.id }, 400);
      }
      const qty = parseInt(item.qty, 10);
      if (isNaN(qty) || qty <= 0) {
        return jsonResponse({ status: 'error', success: false, message: 'Invalid quantity for product: ' + item.id }, 400);
      }
      const itemSubtotal = product.price * qty;
      subtotal += itemSubtotal;
      validatedItems.push({
        id: item.id,
        name: product.name,
        price: product.price,
        qty: qty,
        subtotal: itemSubtotal
      });
    }

    if (validatedItems.length === 0) {
      return jsonResponse({ status: 'error', success: false, message: 'Cannot place an empty order.' }, 400);
    }

    // Validate Coupon
    let discountAmount = 0;
    const couponCode = (payload.couponCode || '').toUpperCase();
    if (couponCode && COUPON_RULES[couponCode]) {
      const rule = COUPON_RULES[couponCode];
      if (subtotal > rule.minSubtotal) {
        discountAmount = Math.round(subtotal * rule.discountPercent);
        if (rule.maxDiscount !== Infinity && discountAmount > rule.maxDiscount) {
          discountAmount = rule.maxDiscount;
        }
      }
    }

    const totalAmount = subtotal - discountAmount + SHIPPING_FEE;

    // Generate Unique Server Order ID
    const today = new Date();
    const dateStr = Utilities.formatDate(today, "Asia/Kolkata", "yyyyMMdd");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `KCC-${dateStr}-${randomSuffix}`;
    const timestamp = Utilities.formatDate(today, "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    // Save to Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const productSummary = validatedItems.map(it => `${it.name} x ${it.qty}`).join(', ');
    const totalQuantity = validatedItems.reduce((sum, it) => sum + it.qty, 0);

    sheet.appendRow([
      orderId,
      customer.name,
      customer.phone,
      customer.address + (customer.state ? `, ${customer.state}` : ''),
      customer.pincode,
      productSummary,
      totalQuantity,
      subtotal,
      discountAmount,
      SHIPPING_FEE,
      totalAmount,
      couponCode,
      timestamp,
      idempotencyKey
    ]);

    const responsePayload = {
      status: 'success',
      success: true,
      orderId: orderId,
      data: {
        orderId: orderId,
        idempotencyKey: idempotencyKey,
        customer: customer,
        items: validatedItems,
        subtotal: subtotal,
        discount: discountAmount,
        shipping: SHIPPING_FEE,
        total: totalAmount,
        couponCode: couponCode,
        createdAt: timestamp
      }
    };

    // Cache Idempotency Result for 6 hours (21,600 seconds)
    if (idempotencyKey) {
      CacheService.getScriptCache().put(idempotencyKey, JSON.stringify(responsePayload), 21600);
    }

    return jsonResponse(responsePayload, 200);

  } catch (error) {
    return jsonResponse({ status: 'error', success: false, message: error.message || 'Server error.' }, 500);
  }
}

function jsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return jsonResponse({ status: 'success', message: 'Konaseema CocoCraft API Endpoint Active.' }, 200);
}
