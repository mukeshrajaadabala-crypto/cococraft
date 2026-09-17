# Google Apps Script Backend Deployment Guide

This guide describes how to update your Google Sheet Apps Script backend to support server-generated order IDs, idempotency key tracking, server-side validation, itemized financial calculations, and secure responses.

## Deployment Steps

1. Open your **Google Sheet** connected to the CocoCraft web orders.
2. Go to **Extensions** > **Apps Script**.
3. Replace the existing script code in `Code.gs` with the code provided in [`google_apps_script_backend.gs`](file:///d:/CocoCraft%20Projects/KCC/cococraft%2011-09-2026/google_apps_script_backend.gs).
4. Ensure your Google Sheet tab has the following header columns (Row 1):
   `Order ID | Name | Mobile | Address | Pincode | Products | Quantity | Subtotal | Discount | Shipping | Total | Coupon | Date | Idempotency Key`
5. Click **Deploy** > **New deployment**.
6. Select type **Web app**.
7. Set **Execute as**: *Me*.
8. Set **Who has access**: *Anyone*.
9. Click **Deploy**, authorize permissions if requested, and copy the **Web app URL**.
10. Update `GOOGLE_APPS_SCRIPT_URL` in [`logic.mjs`](file:///d:/CocoCraft%20Projects/KCC/cococraft%2011-09-2026/logic.mjs) if the endpoint URL has changed.

---

## Security & Reliability Enhancements Included

- **Unique Order IDs**: Format `KCC-YYYYMMDD-XXXX` created on the server to prevent browser-side collisions.
- **Idempotency**: Requests with the same `idempotencyKey` return cached saved order data without writing duplicate rows.
- **Price & Coupon Validation**: Subtotal, discount, shipping (₹100), and totals calculated on the server from trusted product prices and coupon rules.
- **Cart Safety**: Frontend preserves cart contents unless response contains `status: "success"` and valid `orderId`.
