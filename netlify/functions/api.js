import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const SHIPPING_FEE = 100;

// Lazy-initialized Pool for Serverless Lifecycle
let pool = null;

function getPool() {
  if (!pool) {
    let connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_W3N4aSFyMswj@ep-lucky-hall-b5l286ii-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';
    connectionString = connectionString.replace(/&?channel_binding=[^&]*/g, '');

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
  }
  return pool;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

function jsonResponse(statusCode, data) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data)
  };
}

export const handler = async (event, context) => {
  // Allow AWS / Netlify to freeze the process without waiting for pool connections to drain
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

  const httpMethod = (event.httpMethod || 'GET').toUpperCase();

  // Handle CORS Preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Normalize path (handle /api/*, /.netlify/functions/api/*)
  const fullPath = event.path || '';
  const cleanPath = fullPath
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '');

  const dbPool = getPool();

  try {
    // 1. Health check: /health or /
    if (cleanPath === '' || cleanPath === '/' || cleanPath === '/health') {
      const result = await dbPool.query('SELECT NOW()');
      return jsonResponse(200, {
        status: 'success',
        message: 'Konaseema CocoCraft Netlify Serverless API & Neon DB active',
        dbTime: result.rows[0].now
      });
    }

    // 2. GET /products: Active product catalog
    if (cleanPath === '/products' && httpMethod === 'GET') {
      const result = await dbPool.query(
        'SELECT id, name, mrp, price, category, subcategory, tag, image, images, alt, description, in_stock FROM products WHERE in_stock = true ORDER BY created_at ASC'
      );
      return jsonResponse(200, {
        status: 'success',
        products: result.rows
      });
    }

    // 3. GET /coupons: Active discount coupons
    if (cleanPath === '/coupons' && httpMethod === 'GET') {
      const result = await dbPool.query(
        'SELECT code, min_subtotal, discount_percent, max_discount, description FROM coupons WHERE is_active = true'
      );
      return jsonResponse(200, {
        status: 'success',
        coupons: result.rows
      });
    }

    // 4. POST /orders: Place order directly into Neon PostgreSQL
    if (cleanPath === '/orders' && httpMethod === 'POST') {
      let payload = {};
      try {
        payload = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
      } catch (err) {
        return jsonResponse(400, { status: 'error', success: false, message: 'Invalid JSON payload.' });
      }

      const { idempotencyKey, customer, items, couponCode } = payload;

      // Validate Customer
      if (!customer || !customer.name || !customer.phone || !customer.address || !customer.pincode) {
        return jsonResponse(400, { status: 'error', success: false, message: 'Missing required customer details.' });
      }

      // Validate Cart Items
      if (!items || !Array.isArray(items) || items.length === 0) {
        return jsonResponse(400, { status: 'error', success: false, message: 'Cart items missing or empty.' });
      }

      const client = await dbPool.connect();
      try {
        // Idempotency Check
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
            return jsonResponse(200, {
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

        // Validate items with DB products table
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
            return jsonResponse(400, { status: 'error', success: false, message: `Unrecognized product ID: ${item.id}` });
          }
          const qty = parseInt(item.qty, 10);
          if (isNaN(qty) || qty <= 0) {
            return jsonResponse(400, { status: 'error', success: false, message: `Invalid quantity for product ${item.id}` });
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

        // Validate Coupon
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

        // Transactional Write
        await client.query('BEGIN');

        // Generate Sequential Server Order ID (KCC-YYYYMMDD-1001, 1002, 1003...)
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

        return jsonResponse(200, {
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
        });

      } catch (dbErr) {
        await client.query('ROLLBACK');
        console.error('Order transaction error:', dbErr);
        return jsonResponse(500, { status: 'error', success: false, message: dbErr.message || 'Error processing order.' });
      } finally {
        client.release();
      }
    }

    // 5. GET /orders/:orderId
    const orderMatch = cleanPath.match(/^\/orders\/([^/]+)$/);
    if (orderMatch && httpMethod === 'GET') {
      const orderId = orderMatch[1];
      const orderResult = await dbPool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
      if (orderResult.rows.length === 0) {
        return jsonResponse(404, { status: 'error', message: 'Order not found.' });
      }
      const order = orderResult.rows[0];
      const itemsResult = await dbPool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);

      return jsonResponse(200, {
        status: 'success',
        order: {
          ...order,
          items: itemsResult.rows
        }
      });
    }

    return jsonResponse(404, { status: 'error', message: `Route not found: ${cleanPath}` });

  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse(500, { status: 'error', message: error.message || 'Internal server error.' });
  }
};

