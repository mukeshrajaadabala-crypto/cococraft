# Konaseema CocoCraft - Neon Database Integration Guide

This guide documents the setup, schema, and API for your **Neon Serverless PostgreSQL Database**.

---

## 1. Database Connection

- **Provider**: Neon Serverless PostgreSQL
- **Host**: `ep-lucky-hall-b5l286ii-pooler.c-7.us-east-2.aws.neon.tech`
- **Database**: `neondb`
- **Environment Variable**: Configured in [`backend/.env`](file:///d:/CocoCraft%20Projects/KCC/cococraft%2011-09-2026/backend/.env)
```env
DATABASE_URL=postgresql://neondb_owner:npg_W3N4aSFyMswj@ep-lucky-hall-b5l286ii-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require
PORT=5000
```

---

## 2. Relational Schema & Tables Created

All tables and indexes are defined in [`backend/schema.sql`](file:///d:/CocoCraft%20Projects/KCC/cococraft%2011-09-2026/backend/schema.sql):
    
### 1. `products`
Stores the complete eco-friendly handcrafted product catalog.
- `sno` (INT, GENERATED ALWAYS AS IDENTITY, UNIQUE) — Auto-incrementing serial number
- `id` (VARCHAR(50), PRIMARY KEY) — e.g. `'WR001'`, `'CCS001'`, `'KC001'`
- `name` (VARCHAR(255))
- `mrp` (NUMERIC(10,2))
- `price` (NUMERIC(10,2))
- `category` (VARCHAR(100)) — `'KeyChains'`, `'EarRings'`, `'Rakhis'`
- `subcategory` (VARCHAR(100)) — `'Coconut shell rakhis'`, `'Wooden rakhis'`
- `tag` (VARCHAR(255))
- `image` (TEXT)
- `images` (JSONB) — Multi-image array for Swiper modal
- `alt` (TEXT)
- `description` (TEXT)
- `in_stock` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### 2. `coupons`
Stores promotional discount rules.
- `sno` (INT, GENERATED ALWAYS AS IDENTITY, UNIQUE) — Auto-incrementing serial number
- `code` (VARCHAR(50), PRIMARY KEY) — `'RUDRANI5'`, `'RUDRANI10'`
- `min_subtotal` (NUMERIC(10,2)) — Minimum required subtotal
- `discount_percent` (NUMERIC(5,4)) — e.g. `0.05` for 5%, `0.10` for 10%
- `max_discount` (NUMERIC(10,2)) — Cap or `NULL` for unlimited
- `description` (TEXT)
- `is_active` (BOOLEAN)

### 3. `orders`
Stores customer orders placed on the website.
- `sno` (INT, GENERATED ALWAYS AS IDENTITY, UNIQUE) — Auto-incrementing serial number
- `id` (VARCHAR(50), PRIMARY KEY) — Unique format `KCC-YYYYMMDD-XXXX`
- `idempotency_key` (VARCHAR(120), UNIQUE) — Prevents duplicate orders on network retries
- `customer_name` (VARCHAR(255))
- `customer_phone` (VARCHAR(50))
- `customer_address` (TEXT)
- `customer_state` (VARCHAR(100))
- `customer_pincode` (VARCHAR(20))
- `subtotal` (NUMERIC(10,2))
- `discount` (NUMERIC(10,2))
- `shipping_fee` (NUMERIC(10,2)) — Default ₹100
- `total_amount` (NUMERIC(10,2))
- `coupon_code` (VARCHAR(50))
- `status` (VARCHAR(50)) — `'confirmed'`, `'dispatched'`, `'delivered'`, `'cancelled'`
- `created_at`, `updated_at` (TIMESTAMP)

### 4. `order_items`
Stores the itemized line items for each order.
- `sno` (INT, GENERATED ALWAYS AS IDENTITY, UNIQUE) — Auto-incrementing serial number
- `id` (SERIAL, PRIMARY KEY)
- `order_id` (VARCHAR(50), FOREIGN KEY -> `orders.id` ON DELETE CASCADE)
- `product_id` (VARCHAR(50), FOREIGN KEY -> `products.id`)
- `product_name` (VARCHAR(255))
- `unit_price` (NUMERIC(10,2))
- `quantity` (INTEGER)
- `subtotal` (NUMERIC(10,2))

---

## 3. How to Run the Backend Server

To start the API server locally:

```powershell
cd "d:\CocoCraft Projects\KCC\cococraft 11-09-2026\backend"
npm start
```
The server will start on `http://localhost:5000`.

### Re-initializing or Re-seeding Tables
To re-run migrations and reload product data:
```powershell
npm run init-db
```

---

## 4. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Neon DB ping & health check |
| `GET` | `/api/products` | Retrieve active product catalog from DB |
| `GET` | `/api/coupons` | Retrieve active discount coupons |
| `POST` | `/api/orders` | Place order (validates items, calculates totals, inserts into `orders` & `order_items` in a transaction) |
| `GET` | `/api/orders/:orderId` | Retrieve order details & line items |

---

## 5. Frontend Integration

In [`logic.mjs`](file:///d:/CocoCraft%20Projects/KCC/cococraft%2011-09-2026/logic.mjs):
- When an order is placed on checkout, `submitOrderToServer()` automatically attempts to save directly to the Neon Database API at `http://localhost:5000/api/orders` (or your deployed API URL via `window.COCOCRAFT_API_URL`).
- If the server is offline or unreachable, it gracefully falls back to Google Apps Script.
