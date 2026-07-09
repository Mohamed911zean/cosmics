# MASTER PROMPT — Migrate "Cosmics" from Firebase to Supabase (Full Rewrite)

You are working on an existing React + TypeScript + Vite e-commerce project called **Cosmics** (a luxury skincare brand, repo: `Mohamed911zean/cosmics`). It currently uses **Firebase (Firestore + Auth)** for its backend. Your job is to **completely remove Firebase and replace it with Supabase**, fix several real, confirmed bugs along the way, and add new features. This is a **production project being sold to a real client for $7,000+**, so correctness, security, and no-regressions matter more than speed.

Read this entire document before writing any code. Where this document gives you exact file paths, table names, function names, or column names, use them exactly — do not rename or restructure anything not explicitly asked for.

---

## 0. Ground truth about the current codebase (do not re-derive this — it's already confirmed)

- Firebase is used for **Firestore (database) + Auth only**. Images are hosted on **Cloudinary**, not Firebase Storage — leave all Cloudinary code untouched.
- `src/lib/firebase.ts` initializes Firebase and wires an `onAuthStateChanged` listener that calls `.setUser()` on four Zustand stores.
- `src/lib/firestore.ts` contains ad-hoc helpers (`getUserData`, `updateUserData`, `subscribeToUserData`, `getAllOrdersFromFirestore`, `addProductToFirestore`, `getAllProductsFromFirestore`, `subscribeToProducts`). Note `getAllOrdersFromFirestore` defensively scans **three different possible locations** for orders (a `users/{uid}.orders` array, an `orders` collectionGroup, and a top-level `orders` collection) — this defensive mess is a symptom of the current data model being inconsistent, and it goes away entirely once orders live in one real Postgres table.
- `src/lib/auth.ts` wraps `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithPopup` (Google), `signOut`, `onAuthStateChanged`.
- Zustand stores under `src/stores/`:
  - `useAuthStore.ts` — holds the Firebase `User` plus a `role: 'user' | 'admin' | 'superadmin'` read from custom claims / Firestore.
  - `ecommerceStores/useProductStore.ts` — holds all products in memory, has `addProduct`, `updateProduct`, `deleteProduct`. **Confirmed bug: `updateProduct` and `deleteProduct` only mutate local Zustand state and never write to Firestore at all.** The moment the `subscribeToProducts` snapshot listener fires again, the local edit/delete is silently overwritten/reverted. This is why edit and delete "don't work" in the dashboard.
  - `ecommerceStores/useCartStore.ts`, `ecommerceStores/useWishlistStore.ts`, `ecommerceStores/useOrderStore.ts`, `ecommerceStores/useUIStore.ts`.
  - `src/stores/index.ts` re-exports all of the above.
- `src/components/shop/StoreSynchronizer.tsx` — a mounted component that does full-document bidirectional sync between Zustand and a single `users/{uid}` Firestore document (cart, wishlist, orders all stored as arrays inside one doc). This whole-document read/write pattern is fragile under concurrent writes and is being replaced by real relational tables + targeted queries.
- `src/pages/dashboard/Products.tsx` — the admin products table. **Confirmed bug: the Edit and Delete buttons in the row actions render but have no `onClick` handler at all.** They are visually present but non-functional.
- `src/pages/dashboard/AddProduct.tsx` — the add-product form. It has **no stock quantity field at all** currently.
- `src/pages/shop/Checkout.tsx` — writes a raw order object directly into a top-level Firestore `orders` collection on submit. **Confirmed bug: there is no stock check and no stock decrement anywhere in this flow.** Two customers can buy the last unit of a product simultaneously with no conflict detection.
- `src/pages/dashboard/Orders.tsx`, `OrderDetails.tsx`, `DashboardHome.tsx`, `BestSellers.tsx`, `Customers.tsx` — admin dashboard pages that currently read via `getAllOrdersFromFirestore` / `getAllProductsFromFirestore`. No realtime; the admin must manually refresh to see new orders.
- `src/lib/telegram.ts` — sends a Telegram message when an order is placed. **This works today and must be preserved.** Only the order **data source** changes (it will read the newly-created Postgres order instead of the Firestore doc); the Telegram send logic itself is not being rewritten.
- `src/components/guards/AdminRoute.tsx` and `SuperAdminRoute.tsx` — route guards checking `useAuthStore().role`. Preserve the same two-tier admin/superadmin behavior, just backed by Supabase instead of Firebase custom claims.
- Package manager deps currently include `firebase` and `zustand`; keep `zustand` (all stores are being ported, not deleted, just re-implemented on top of Supabase calls instead of Firestore calls) — remove `firebase` entirely at the very end once everything is confirmed working.
- There is **no existing production data to migrate** — the owner has confirmed Firestore has no real customers/orders yet, so you are building against an **empty Supabase database**. Do not write any "migrate old Firestore data" scripts; that is explicitly out of scope.

---

## 1. What "done" looks like (high-level requirements from the project owner)

1. **Firebase is completely removed** — no `firebase` package, no Firebase env vars, no Firestore/Firebase Auth calls anywhere in the codebase, by the end of this migration.
2. **Supabase is the only backend** — Postgres (via the SQL migrations provided separately, already applied by the owner in the Supabase SQL Editor — do not re-run or re-generate schema SQL, just write application code against it), Supabase Auth, Supabase Realtime.
3. **Admin product management actually works**: Add, **Edit, and Delete** all persist to the database (fixing the confirmed no-op bug).
4. **Every product has a stock quantity.** The admin sets it when creating a product and can edit it at any time from the dashboard. Stock is decremented **atomically on the server** when an order is placed — never computed or written from client-side JavaScript.
5. **Customer-facing stock rules**:
   - When a product's remaining stock is **5 or fewer** (but still > 0), show a "Only X left" style indicator (already implemented visually in the Shop page redesign — just wire it to the real `stock_quantity` / `low_stock_threshold` columns).
   - When stock reaches **0**, the customer **cannot** add it to cart or check out. The "Add to Bag" button is replaced with a **"Notify Me"** action.
   - **"Notify Me" has NO automation.** It is simply a small form that asks the visitor (guest or logged in — no login required) for a WhatsApp number, and inserts a row into `stock_notify_requests`. Nothing is sent automatically. This must surface as a new dashboard page ("Restock Requests") listing all pending requests (product name, WhatsApp number, requested date) with a manual "Mark as Contacted" action, so the team can message people on WhatsApp themselves. Do not integrate any push/SMS/email provider for this feature — it was explicitly decided against.
6. **Realtime admin dashboard**:
   - New orders appear in the dashboard **without a manual refresh**, via a Supabase Realtime subscription on the `orders` table.
   - A **live "new orders" counter/badge** in the dashboard sidebar/nav that increments in realtime as orders come in (and clears/resets when the admin views the Orders page).
   - This must be built with Supabase Realtime channels (`supabase.channel(...).on('postgres_changes', ...)`), not polling.
7. **Realtime order status for the customer**: when the admin changes an order's status (e.g. `processing` → `shipped`), the customer's own order-tracking view updates live (also via Realtime), so they see "Your order is on its way" without refreshing.
8. **Order tracking for the customer, in both places**: a "My Orders" page listing all of the customer's past orders, **and** a dedicated single-order tracking view/page (e.g. `/orders/:id` or `/account/orders/:id`) with a clear step-by-step status indicator. Both must reflect live status changes.
9. **Telegram order notifications keep working**, just fed by the new Postgres order data instead of Firestore.
10. No regressions to Cloudinary image upload/display, fonts, styling, or any other part of the app not explicitly discussed here.

---

## 2. Environment & setup

- The Supabase project has already been created by the project owner (org: "brands", project: "cosmitics brand"). The SQL schema migrations have already been run by the owner directly in the Supabase SQL Editor — **do not write or run any `CREATE TABLE` / schema DDL yourself.** Assume the following already exist in the `public` schema exactly as named below (ask the project owner to confirm connection details — project URL and anon key — if you don't have them; do not guess or fabricate them):

  **Enums**: `product_status` (`draft`,`active`,`archived`), `order_status` (`pending`,`confirmed`,`processing`,`shipped`,`delivered`,`cancelled`,`refunded`), `payment_status` (`unpaid`,`paid`,`partially_refunded`,`refunded`,`failed`), `admin_role` (`user`,`admin`,`superadmin`).

  **Tables**: `brands`, `categories`, `products` (includes `stock_quantity` and `low_stock_threshold` columns — this is the stock system), `product_images`, `product_variants`, `profiles` (has a `role` column of type `admin_role`, auto-created on signup via a trigger), `addresses`, `orders` (has `status`, `payment_status`, auto-generated `order_number`), `order_items`, `reviews`, `wishlist_items`, `stock_notify_requests` (columns: `product_id`, `whatsapp_number`, `user_id` nullable, `is_contacted`, `contacted_at`).

  **Views**: `v_low_stock_products`, `v_daily_sales`, `v_best_sellers`.

  **RPC function**: `place_order(...)` — **this is the only sanctioned way to create an order.** It takes user/customer/shipping/payment info plus an array of `{product_id, variant_id, quantity}` items, locks the relevant product rows, validates stock, decrements stock atomically, inserts the order + order_items, and bumps `sales_count`. It raises a Postgres exception (with a clear error code prefix like `INSUFFICIENT_STOCK:`, `PRODUCT_UNAVAILABLE:`, `PRODUCT_NOT_FOUND:`, `ORDER_EMPTY:`) if anything is invalid, and the whole transaction rolls back — no partial writes. **Your checkout code must call `supabase.rpc('place_order', {...})` and must never insert into `orders`/`order_items` directly, and must never decrement `stock_quantity` from client-side code.**

  **RLS is already configured**: public/anon can read active products, categories, brands, published reviews. Only rows where the calling user's `profiles.role` is `admin` or `superadmin` can write to catalog tables. Users can only read/write their own orders, addresses, wishlist. Anyone (including guests, via the anon key) can insert into `stock_notify_requests`; only admins can read that table.

  **Realtime**: the `orders`, `order_items`, and `products` tables are already added to the `supabase_realtime` publication.

- Install `@supabase/supabase-js`. Remove `firebase` from `package.json` only in the final cleanup step (Section 8), not before, so you can compare behavior while migrating incrementally.
- Create `.env` variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (ask the project owner for these values — do not fabricate placeholder-looking real-looking keys). Create a `.env.example` with empty placeholders for these two, and remove the old `VITE_FIREBASE_*` entries from `.env.example` once Firebase is fully removed.
- Create `src/lib/supabase.ts` exporting a single `supabase` client instance (persistSession: true, autoRefreshToken: true). This replaces `src/lib/firebase.ts`.

---

## 3. Migration plan — do this in order, and confirm each phase works before moving to the next

### Phase 1 — Auth
- Replace `src/lib/auth.ts` (Firebase) with Supabase Auth equivalents: `supabase.auth.signInWithPassword`, `supabase.auth.signUp`, `supabase.auth.signInWithOAuth({ provider: 'google' })`, `supabase.auth.signOut`, `supabase.auth.onAuthStateChange`.
- Update `src/context/authContext.tsx` and `src/stores/useAuthStore.ts` to source the user and `role` from Supabase: the user comes from `supabase.auth.getUser()` / the auth state change listener; the `role` comes from querying the `profiles` table (`select role from profiles where id = auth.uid()`) rather than Firebase custom claims.
- Update `src/pages/auth/Login.tsx` and `Signup.tsx` to call the new functions. Keep the same UI/UX; only the backend calls change.
- Update `src/components/guards/AdminRoute.tsx` and `SuperAdminRoute.tsx` to check `role === 'admin' || role === 'superadmin'` and `role === 'superadmin'` respectively, sourced from the profile.
- **Do not remove `firebase` from package.json yet.**

### Phase 2 — Products (catalog) read path
- Create `src/lib/products.ts` with functions: `fetchProducts(filters)` (server-side search/category/price/sort/pagination via Supabase query builder — do not fetch everything and filter in JS), `fetchCategories()`, `fetchProductBySlug(slug)`. Products should be joined with `categories`, `brands`, and `product_images` in the same query (use Supabase's nested select syntax) so the UI never needs a second round-trip per product.
- Replace `subscribeToProducts` / `getAllProductsFromFirestore` usage in `useProductStore.ts` and the Shop/ProductPage components with calls into `src/lib/products.ts`.
- The Shop page must show real `stock_quantity`: "Only X left" when `0 < stock_quantity <= low_stock_threshold`, "Out of Stock" + "Notify Me" button when `stock_quantity === 0` (disable "Add to Bag" in that case).

### Phase 3 — Admin product management (fixes the confirmed Add/Edit/Delete bug)
- Rewrite `src/pages/dashboard/AddProduct.tsx`:
  - Add a **required "Stock Quantity" number field** (and keep/add a "Low stock threshold" field, default 5) to the form. This did not exist before.
  - On submit, insert into `products` via `supabase.from('products').insert(...)`, then insert associated rows into `product_images` for each uploaded Cloudinary URL.
- Rewrite `src/pages/dashboard/Products.tsx`:
  - Wire the **Edit** button to open an edit form/modal (can reuse the AddProduct form in "edit mode") that calls `supabase.from('products').update(...).eq('id', productId)`. This is the fix for the confirmed no-op bug.
  - Wire the **Delete** button to a confirmation dialog, then `supabase.from('products').delete().eq('id', productId)`.
  - Add a **direct inline "Edit Stock" control** in the products table (e.g. a small number input or a "+/-" stepper right in the row) so the admin can adjust `stock_quantity` at any time without opening the full edit form — this was explicitly requested as a fast path for restocking.
  - After any insert/update/delete, don't rely on an in-memory Zustand array staying in sync manually — either refetch or, better, subscribe to `postgres_changes` on the `products` table so the table view updates live too (nice-to-have, not the primary requirement, but consistent with the rest of the realtime work).

### Phase 4 — Cart & Wishlist
- `useCartStore.ts`: cart itself can remain **client-side only** (localStorage-backed via Zustand persist, or in-memory) up until checkout — there is no requirement to persist an in-progress cart to Supabase. Do not over-engineer this; the important server-side guarantee is at order-placement time (Phase 5).
- `useWishlistStore.ts`: replace Firestore-backed wishlist with a Supabase-backed one. Wishlist requires login (`wishlist_items` RLS enforces `auth.uid() = user_id`). If a guest tries to wishlist something, prompt sign-in (don't silently fail).
- Remove wishlist/cart persistence logic from `StoreSynchronizer.tsx` (see Phase 7) since there's no longer a single `users/{uid}` document to bidirectionally sync — Supabase queries replace that pattern entirely.

### Phase 5 — Checkout & Orders (the critical correctness fix)
- Rewrite `src/pages/shop/Checkout.tsx` so that on submit it calls:
  ```ts
  const { data: order, error } = await supabase.rpc('place_order', {
    p_user_id: user?.id ?? null,
    p_customer_name, p_customer_phone, p_customer_email,
    p_shipping_address_id, p_shipping_address_snapshot,
    p_payment_method, p_shipping_fee, p_discount_total,
    p_coupon_code, p_notes,
    p_items: cartItems.map(i => ({ product_id: i.productId, variant_id: i.variantId ?? null, quantity: i.quantity })),
  });
  ```
- Handle the RPC's error cases explicitly and show the customer a clear message — in particular `INSUFFICIENT_STOCK` should say something like "Sorry, only N left of [product] — please adjust your cart," not a generic error.
- On success, clear the cart, navigate to `OrderSuccess.tsx` using the real `order.order_number` / `order.id`, and trigger the existing Telegram notification (pass it the new order's data instead of the old Firestore shape — the Telegram message content/format should stay the same, only the data source changes).
- Never manually decrement `stock_quantity` from the frontend anywhere else in the app — that field is only ever changed by `place_order` (on order) or by an admin's explicit stock edit (Phase 3).

### Phase 6 — Customer order tracking
- Update `src/pages/account/Orders.tsx` ("My Orders") to fetch the logged-in user's orders from Supabase (`orders` joined with `order_items`), ordered by `created_at desc`.
- Add a **dedicated single-order tracking view** (new route, e.g. `/account/orders/:orderId`) showing a step-by-step status indicator across `pending → confirmed → processing → shipped → delivered` (with a distinct visual treatment if `cancelled` or `refunded`).
- Both the list and the single-order view must **subscribe to Realtime updates** on that user's orders (`supabase.channel('orders-user-' + userId).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: 'user_id=eq.' + userId }, callback)`), so a status change made by the admin appears live without the customer refreshing.
- Add the "Notify Me" UI on out-of-stock products (Shop page and ProductPage): a small inline form asking for a WhatsApp number, inserting into `stock_notify_requests` with `product_id`, `whatsapp_number`, and `user_id` (nullable — allow guests). Show a simple confirmation ("We'll reach out on WhatsApp when it's back") — no further automation.

### Phase 7 — Admin dashboard realtime
- Rewrite the data-fetching in `src/pages/dashboard/DashboardHome.tsx`, `Orders.tsx`, `OrderDetails.tsx`, `BestSellers.tsx`, `Customers.tsx` to query Supabase instead of `getAllOrdersFromFirestore` (use `v_daily_sales`, `v_best_sellers`, `v_low_stock_products` views where they fit).
- In `Orders.tsx` (and/or a shared dashboard layout/nav component), subscribe to `postgres_changes` (`event: 'INSERT'`) on the `orders` table with no filter (admins can see all orders per RLS) and:
  - Prepend new orders to the list live.
  - Increment a **"new orders" badge/counter** in the sidebar/nav (persist the "seen" state in local component state or localStorage — reset the counter to 0 when the admin opens the Orders page).
- In `OrderDetails.tsx`, add the ability for the admin to change `orders.status` via a dropdown/buttons, calling `supabase.from('orders').update({ status: newStatus }).eq('id', orderId)`. This is what the customer's realtime tracking view (Phase 6) reacts to.
- Add a **new dashboard page "Restock Requests"** reading from `stock_notify_requests` (join to `products` for the product name), with a "Mark as Contacted" button that sets `is_contacted = true, contacted_at = now()`.
- Update `src/lib/telegram.ts` call sites only to pass in the new Postgres order shape — do not rewrite the Telegram sending logic itself unless the data shape genuinely requires it.
- Rewrite `src/components/shop/StoreSynchronizer.tsx`: remove the Firestore `users/{uid}` whole-document sync entirely. Whatever legitimate role it played (initializing store state on login, clearing on logout) should instead be handled by each store's own Supabase-backed fetch on auth state change. It's fine for this component to shrink dramatically or be deleted if nothing meaningful remains.

### Phase 8 — Cleanup
- Search the entire codebase for `firebase`, `firestore`, `firebase/auth`, `firebase/app`, `VITE_FIREBASE_` and remove every remaining reference.
- Delete `src/lib/firebase.ts` and `src/lib/firestore.ts` (or repurpose the file with the Supabase client, but do not leave dead Firebase code behind).
- Remove the `firebase` dependency from `package.json` and run the package manager's install/lock update.
- Do a final full read-through of `src/App.tsx` and `src/main.tsx` to make sure no Firebase initialization call remains anywhere in the app's boot sequence.

---

## 4. Non-negotiable correctness rules

- **Never** trust client-side stock math. All stock decrements happen only inside `place_order` (server-side, atomic, transactional). If you find yourself writing `product.stock_quantity - quantity` anywhere in a `.tsx`/`.ts` file outside of read-only display logic, stop — that's a bug.
- **Never** insert directly into `orders` or `order_items` from the frontend. Always go through the `place_order` RPC.
- Treat any Supabase RLS error (`new row violates row-level security policy`, `permission denied`) as a signal that either the wrong table/column is being written to, or the user's role wasn't fetched correctly — do not "fix" it by trying to bypass RLS with a service role key in frontend code. The service role key must never appear in any frontend bundle or `VITE_`-prefixed env var.
- Keep all existing Cloudinary upload code as-is; only the metadata (URLs) now gets stored in `product_images` rows instead of inline in a Firestore product doc.
- Preserve existing route paths and page names unless a change is explicitly required above (e.g. adding a new `/account/orders/:orderId` route is required; renaming `/shop` is not).
- Match the existing code style (this project uses Zustand for client state, Tailwind for styling, Framer Motion for animation, `sonner` for toasts) — don't introduce a different state management or styling approach.

---

## 5. Questions you (the AI doing this work) must ask the project owner before proceeding, if any of these aren't already answered in your context

- The Supabase project URL and anon public key (for `.env`).
- Whether Google OAuth needs to be reconfigured in the new Supabase project's Auth settings (it was previously configured in Firebase Auth and does not carry over automatically).
- Whether any existing Cloudinary upload preset / folder structure needs to be referenced by name.
- Confirmation of exact route paths preferred for the new order-tracking page if `/account/orders/:orderId` conflicts with existing routing conventions in `src/App.tsx`.

Do not guess at any of the above — ask explicitly and wait for an answer rather than fabricating a plausible-looking value (especially for API keys/URLs).