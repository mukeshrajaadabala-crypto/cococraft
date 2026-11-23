import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialProducts = [
  {
    id: 'WR001',
    name: 'Wooden Rakhi-Packof 1 (WR001)',
    mrp: 99,
    price: 80,
    category: 'Rakhis',
    subcategory: 'Wooden rakhis',
    tag: 'Eco-Friendly Wooden Rakhi (Packof 1)',
    image: 'https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785352016/Wooden_Rakhis_pack_of_1_je8b6n.png',
    images: ['https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785352016/Wooden_Rakhis_pack_of_1_je8b6n.png'],
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
    images: ['https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785351521/Wooden_Rakhis_Combo_jhlbmz.png'],
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
    images: ['https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785931822/CCS001_biiqcs.jpg'],
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
    images: ['https://res.cloudinary.com/dd1d5fhl4/image/upload/v1785931837/CCS002_pytuoa.jpg'],
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

const initialCoupons = [
  {
    code: 'RUDRANI5',
    min_subtotal: 200,
    discount_percent: 0.05,
    max_discount: null,
    description: '5% discount on product subtotal above ₹200.',
    is_active: false
  },
  {
    code: 'RUDRANI10',
    min_subtotal: 1000,
    discount_percent: 0.10,
    max_discount: null,
    description: '10% discount on product subtotal above ₹1000.',
    is_active: true
  }
];

async function initializeDatabase() {
  console.log('Connecting to Neon PostgreSQL database...');
  const client = await pool.connect();

  try {
    console.log('Executing schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('Schema tables created successfully (products, coupons, orders, order_items).');

    // Seed Products
    console.log('Seeding products...');
    for (const prod of initialProducts) {
      await client.query(
        `INSERT INTO products (id, name, mrp, price, category, subcategory, tag, image, images, alt, description, in_stock)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           mrp = EXCLUDED.mrp,
           price = EXCLUDED.price,
           category = EXCLUDED.category,
           subcategory = EXCLUDED.subcategory,
           tag = EXCLUDED.tag,
           image = EXCLUDED.image,
           images = EXCLUDED.images,
           alt = EXCLUDED.alt,
           description = EXCLUDED.description,
           updated_at = CURRENT_TIMESTAMP`,
        [
          prod.id,
          prod.name,
          prod.mrp,
          prod.price,
          prod.category,
          prod.subcategory,
          prod.tag,
          prod.image,
          JSON.stringify(prod.images || [prod.image]),
          prod.alt,
          prod.description
        ]
      );
    }
    console.log(`Seeded ${initialProducts.length} products.`);

    // Seed Coupons
    console.log('Seeding coupons...');
    for (const c of initialCoupons) {
      await client.query(
        `INSERT INTO coupons (code, min_subtotal, discount_percent, max_discount, description, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (code) DO UPDATE SET
           min_subtotal = EXCLUDED.min_subtotal,
           discount_percent = EXCLUDED.discount_percent,
           max_discount = EXCLUDED.max_discount,
           description = EXCLUDED.description,
           is_active = EXCLUDED.is_active`,
        [c.code, c.min_subtotal, c.discount_percent, c.max_discount, c.description, c.is_active ?? true]
      );
    }
    console.log(`Seeded ${initialCoupons.length} coupons.`);

    // Verify
    const prodRes = await client.query('SELECT COUNT(*) FROM products');
    const couponRes = await client.query('SELECT COUNT(*) FROM coupons');
    const orderRes = await client.query('SELECT COUNT(*) FROM orders');

    console.log('\n--- Neon Database Status ---');
    console.log(`Products in DB: ${prodRes.rows[0].count}`);
    console.log(`Coupons in DB:  ${couponRes.rows[0].count}`);
    console.log(`Orders in DB:   ${orderRes.rows[0].count}`);
    console.log('----------------------------\n');
    console.log('Neon Database initialization completed successfully!');

  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

initializeDatabase();
