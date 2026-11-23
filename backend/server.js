import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;
const SHIPPING_FEE = 100;

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'Konaseema CocoCraft API & Neon DB active',
      dbTime: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, mrp, price, category, subcategory, tag, image, images, alt, description, in_stock FROM products WHERE in_stock = true ORDER BY created_at ASC'
    );
    res.json({
      status: 'success',
      products: result.rows
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/coupons
app.get('/api/coupons', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT code, min_subtotal, discount_percent, max_discount, description FROM coupons WHERE is_active = true'
    );
    res.json({
      status: 'success',
      coupons: result.rows
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/orders (Production Order Handler with Neon DB)
app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    const { idempotencyKey, customer, items, couponCode } = req.body;

    // 1. Check Idempotency Key
    if (idempotencyKey) {
      const existingOrder = await client.query(
        'SELECT * FROM orders WHERE idempotency_key = $1',
        [idempotencyKey]
      );
      if (existingOrder.rows.length > 0) {
        const order = existingOrder.rows[0];
        const orderItems = await client.query(
          'SELECT product_id as id, product_name as name, unit_price as price, quantity as qty, subtotal FROM order_items WHERE order_id = $1',
          [order.id]
        );
        return res.json({
          status: 'success',
          success: true,
          orderId: order.id,
          data: {
            orderId: order.id,
            idempotencyKey: order.idempotency_key,
            customer: {
              name: order.customer_name,
              phone: order.customer_phone,
              address: order.customer_address,
              state: order.customer_state,
              pincode: order.customer_pincode
            },
            items: orderItems.rows,
            subtotal: parseFloat(order.subtotal),
            discount: parseFloat(order.discount),
            shipping: parseFloat(order.shipping_fee),
            total: parseFloat(order.total_amount),
            couponCode: order.coupon_code,
            createdAt: order.created_at
          }
        });
      }
    }

    // 2. Validate Customer Details
    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.pincode) {
      return res.status(400).json({ status: 'error', success: false, message: 'Missing required customer details.' });
    }

    // 3. Validate Cart Items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: 'error', success: false, message: 'Cart items missing or empty.' });
    }

    // Fetch Product details from Neon DB
    const productIds = items.map(it => it.id);
    const productsResult = await client.query(
      'SELECT id, name, price FROM products WHERE id = ANY($1)',
      [productIds]
    );
    const productMap = new Map(productsResult.rows.map(p => [p.id, p]));

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return res.status(400).json({ status: 'error', success: false, message: `Unrecognized product ID: ${item.id}` });
      }
      const qty = parseInt(item.qty, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ status: 'error', success: false, message: `Invalid quantity for product ${item.id}` });
      }
      const price = parseFloat(product.price);
      const itemSubtotal = price * qty;
      subtotal += itemSubtotal;
      validatedItems.push({
        id: item.id,
        name: product.name,
        price: price,
        qty: qty,
        subtotal: itemSubtotal
      });
    }

    // 4. Validate Coupon
    let discountAmount = 0;
    let validCouponCode = null;

    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      const couponResult = await client.query(
        'SELECT * FROM coupons WHERE code = $1 AND is_active = true',
        [cleanCode]
      );
      if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];
        const minSub = parseFloat(coupon.min_subtotal);
        if (subtotal > minSub) {
          validCouponCode = cleanCode;
          const percent = parseFloat(coupon.discount_percent);
          discountAmount = Math.round(subtotal * percent);
          if (coupon.max_discount !== null) {
            const maxD = parseFloat(coupon.max_discount);
            if (discountAmount > maxD) discountAmount = maxD;
          }
        }
      }
    }

    const totalAmount = subtotal - discountAmount + SHIPPING_FEE;

    // 6. DB Transaction: Insert into orders and order_items
    await client.query('BEGIN');

    // 5. Generate Sequential Server Order ID (KCC-YYYYMMDD-1001, 1002, 1003...)
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const dateStr = formatter.format(today).replace(/-/g, '');
    const prefix = `KCC-${dateStr}-`;

    const existingOrders = await client.query(
      `SELECT id FROM orders WHERE id LIKE $1`,
      [`${prefix}%`]
    );

    let maxSeq = 1000;
    for (const row of existingOrders.rows) {
      const parts = row.id.split('-');
      if (parts.length >= 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }

    let nextSeq = maxSeq + 1;
    while (true) {
      const check = await client.query('SELECT 1 FROM orders WHERE id = $1', [`${prefix}${nextSeq}`]);
      if (check.rows.length === 0) break;
      nextSeq++;
    }
    const orderId = `${prefix}${nextSeq}`;

    await client.query(
      `INSERT INTO orders (
        id, idempotency_key, customer_name, customer_phone, customer_address, customer_state, customer_pincode,
        subtotal, discount, shipping_fee, total_amount, coupon_code, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'confirmed')`,
      [
        orderId,
        idempotencyKey || null,
        customer.name,
        customer.phone,
        customer.address,
        customer.state || '',
        customer.pincode,
        subtotal,
        discountAmount,
        SHIPPING_FEE,
        totalAmount,
        validCouponCode
      ]
    );

    for (const item of validatedItems) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, unit_price, quantity, subtotal
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.id, item.name, item.price, item.qty, item.subtotal]
      );
    }

    await client.query('COMMIT');

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
        couponCode: validCouponCode,
        createdAt: today.toISOString()
      }
    };

    return res.json(responsePayload);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order placement error:', err);
    res.status(500).json({ status: 'error', success: false, message: err.message || 'Server error processing order.' });
  } finally {
    client.release();
  }
});

// GET /api/orders/:orderId
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Order not found.' });
    }
    const order = orderResult.rows[0];
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);

    res.json({
      status: 'success',
      order: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Konaseema CocoCraft API running on http://localhost:${PORT}`);
});
