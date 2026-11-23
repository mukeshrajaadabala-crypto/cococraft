import { pool } from './db.js';

async function testOrder() {
  const client = await pool.connect();
  try {
    console.log('Testing Neon DB order insertion...');
    const orderId = `KCC-TEST-${Date.now()}`;
    const idempotencyKey = `test_idemp_${Date.now()}`;

    await client.query('BEGIN');

    await client.query(
      `INSERT INTO orders (
        id, idempotency_key, customer_name, customer_phone, customer_address, customer_state, customer_pincode,
        subtotal, discount, shipping_fee, total_amount, coupon_code, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'confirmed')`,
      [
        orderId,
        idempotencyKey,
        'Test Artisan Patron',
        '+91 9542288472',
        'Beach Road, Konaseema',
        'Andhra Pradesh',
        '533001',
        179.00,
        0,
        100.00,
        279.00,
        null
      ]
    );

    await client.query(
      `INSERT INTO order_items (
        order_id, product_id, product_name, unit_price, quantity, subtotal
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, 'WR001', 'Wooden Rakhi-Packof 1 (WR001)', 80.00, 1, 80.00]
    );

    await client.query(
      `INSERT INTO order_items (
        order_id, product_id, product_name, unit_price, quantity, subtotal
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, 'CCS001', 'Coconut Shell Rakhi-Packof 1 (CCS001)', 99.00, 1, 99.00]
    );

    await client.query('COMMIT');
    console.log(`Successfully created test order: ${orderId}`);

    // Read back
    const res = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const itemsRes = await client.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);

    console.log('Fetched Order:', res.rows[0]);
    console.log('Fetched Items:', itemsRes.rows);

    // Clean up test order
    await client.query('DELETE FROM orders WHERE id = $1', [orderId]);
    console.log('Cleaned up test order. Neon DB verification complete and working 100%!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Test order failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testOrder();
