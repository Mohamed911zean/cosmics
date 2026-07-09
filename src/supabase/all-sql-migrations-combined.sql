-- ============================================================
-- 01_extensions_and_enums.sql
-- Run this FIRST in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "uuid-ossp";
create schema if not exists extensions;
create extension if not exists pg_trgm schema extensions;

create type product_status as enum ('draft', 'active', 'archived');
create type order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type payment_status as enum ('unpaid', 'paid', 'partially_refunded', 'refunded', 'failed');
create type admin_role as enum ('user', 'admin', 'superadmin');
-- ============================================================
-- 02_brands_and_categories.sql
-- ============================================================

create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  description text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categories_active_order on categories (is_active, display_order);
-- ============================================================
-- 03_products_and_variants.sql
-- Stock lives directly on the product (stock_quantity).
-- Admin sets it when creating a product and can edit it any time.
-- ============================================================

create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  category_id uuid references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,

  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) check (original_price is null or original_price >= price),
  currency text not null default 'EGP',

  sku text unique,

  -- STOCK: single source of truth for inventory on the base product.
  -- Admin enters this when adding the product, can edit any time from the dashboard.
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5,

  status product_status not null default 'draft',
  is_new boolean not null default false,
  is_featured boolean not null default false,

  rating_average numeric(2,1) not null default 0 check (rating_average between 0 and 5),
  rating_count integer not null default 0,
  sales_count integer not null default 0,

  ingredients text,
  how_to_use text,
  volume_size text,
  skin_type text[],
  concerns text[],

  meta_title text,
  meta_description text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_status on products (status);
create index idx_products_category on products (category_id);
create index idx_products_brand on products (brand_id);
create index idx_products_price on products (price);
create index idx_products_name_trgm on products using gin (name extensions.gin_trgm_ops);
create index idx_products_new on products (is_new) where is_new = true;
create index idx_products_featured on products (is_featured) where is_featured = true;
create index idx_products_low_stock on products (stock_quantity, low_stock_threshold) where status = 'active';

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_product_images_product on product_images (product_id, display_order);

-- Optional variants (e.g. size/scent). Base product stock is used if no variants exist.
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  sku text unique,
  price_override numeric(10,2) check (price_override is null or price_override >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_product_variants_product on product_variants (product_id);

-- keep updated_at fresh automatically
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at before update on products
for each row execute function set_updated_at();

create trigger trg_categories_updated_at before update on categories
for each row execute function set_updated_at();

create trigger trg_brands_updated_at before update on brands
for each row execute function set_updated_at();
-- ============================================================
-- 04_profiles_and_addresses.sql
-- profiles.role mirrors the existing app's useAuthStore roles:
-- 'user' | 'admin' | 'superadmin'
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role admin_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at before update on profiles
for each row execute function set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

create table addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Home',
  full_name text not null,
  phone text not null,
  governorate text not null,
  city text not null,
  street text not null,
  building text,
  floor text,
  apartment text,
  landmark text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_addresses_user on addresses (user_id);
-- ============================================================
-- 05_orders_and_items.sql
-- Orders carry a customer-visible `status` that drives both the
-- customer-facing tracking UI and the admin dashboard.
-- ============================================================

create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,

  status order_status not null default 'pending',
  payment_status payment_status not null default 'unpaid',
  payment_method text,

  subtotal numeric(10,2) not null default 0,
  discount_total numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  currency text not null default 'EGP',

  shipping_address_id uuid references addresses(id) on delete set null,
  shipping_address_snapshot jsonb,

  customer_name text not null,
  customer_phone text not null,
  customer_email text,

  notes text,
  coupon_code text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user on orders (user_id);
create index idx_orders_status on orders (status);
create index idx_orders_created on orders (created_at desc);

create trigger trg_orders_updated_at before update on orders
for each row execute function set_updated_at();

-- auto-generate a human-friendly order number like ORD-20260709-0001
create sequence if not exists order_number_seq;

create or replace function generate_order_number() returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_number_seq')::text, 4, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_orders_generate_number before insert on orders
for each row execute function generate_order_number();

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,

  product_name text not null,
  product_image text,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) not null,

  created_at timestamptz not null default now()
);

create index idx_order_items_order on order_items (order_id);
create index idx_order_items_product on order_items (product_id);
create index idx_order_items_variant on order_items (variant_id);
-- ============================================================
-- 06_place_order_function.sql
-- This is the ONLY correct way to create an order. It:
--   1. Locks the product rows being ordered (FOR UPDATE)
--   2. Verifies stock is sufficient for every line item
--   3. Decrements stock atomically
--   4. Inserts the order + order_items
--   5. Bumps sales_count on each product
-- If ANY item is out of stock, the whole order fails and nothing
-- is written or decremented (all-or-nothing transaction).
--
-- The frontend must call this via supabase.rpc('place_order', {...})
-- and must NEVER insert into orders/order_items directly, and must
-- NEVER decrement stock_quantity from the client.
-- ============================================================

create type order_item_input as (
  product_id uuid,
  variant_id uuid,
  quantity integer
);

create or replace function place_order(
  p_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_shipping_address_id uuid,
  p_shipping_address_snapshot jsonb,
  p_payment_method text,
  p_shipping_fee numeric,
  p_discount_total numeric,
  p_coupon_code text,
  p_notes text,
  p_items order_item_input[]
) returns orders as $$
declare
  v_order orders;
  v_item order_item_input;
  v_product products%rowtype;
  v_unit_price numeric(10,2);
  v_line_total numeric(10,2);
  v_subtotal numeric(10,2) := 0;
  v_product_name text;
  v_product_image text;
begin
  if array_length(p_items, 1) is null or array_length(p_items, 1) = 0 then
    raise exception 'ORDER_EMPTY: cannot place an order with no items';
  end if;

  -- Pass 1: lock rows and validate stock BEFORE writing anything.
  foreach v_item in array p_items loop
    select * into v_product from products where id = v_item.product_id for update;

    if not found then
      raise exception 'PRODUCT_NOT_FOUND: %', v_item.product_id;
    end if;

    if v_product.status <> 'active' then
      raise exception 'PRODUCT_UNAVAILABLE: % is not active', v_product.name;
    end if;

    if v_product.stock_quantity < v_item.quantity then
      raise exception 'INSUFFICIENT_STOCK: % has % left, requested %',
        v_product.name, v_product.stock_quantity, v_item.quantity;
    end if;
  end loop;

  -- Pass 2: everything validated, now actually decrement + accumulate totals.
  insert into orders (
    user_id, customer_name, customer_phone, customer_email,
    shipping_address_id, shipping_address_snapshot,
    payment_method, shipping_fee, discount_total, coupon_code, notes,
    subtotal, total, status, payment_status
  ) values (
    p_user_id, p_customer_name, p_customer_phone, p_customer_email,
    p_shipping_address_id, p_shipping_address_snapshot,
    p_payment_method, p_shipping_fee, p_discount_total, p_coupon_code, p_notes,
    0, 0, 'pending', 'unpaid'
  ) returning * into v_order;

  foreach v_item in array p_items loop
    select * into v_product from products where id = v_item.product_id;

    v_unit_price := coalesce(
      (select price_override from product_variants where id = v_item.variant_id),
      v_product.price
    );
    v_line_total := v_unit_price * v_item.quantity;
    v_subtotal := v_subtotal + v_line_total;
    v_product_name := v_product.name;
    v_product_image := (select url from product_images where product_id = v_product.id and is_primary = true limit 1);

    insert into order_items (order_id, product_id, variant_id, product_name, product_image, unit_price, quantity, line_total)
    values (v_order.id, v_item.product_id, v_item.variant_id, v_product_name, v_product_image, v_unit_price, v_item.quantity, v_line_total);

    -- Decrement stock atomically (row already locked from pass 1 in this same transaction)
    if v_item.variant_id is not null then
      update product_variants set stock_quantity = stock_quantity - v_item.quantity where id = v_item.variant_id;
    else
      update products set stock_quantity = stock_quantity - v_item.quantity, sales_count = sales_count + v_item.quantity
      where id = v_item.product_id;
    end if;
  end loop;

  update orders
  set subtotal = v_subtotal,
      total = v_subtotal - p_discount_total + p_shipping_fee
  where id = v_order.id
  returning * into v_order;

  return v_order;
end;
$$ language plpgsql security definer set search_path = public;

-- Only logged-in or guest checkout callers (anon/authenticated) may call this;
-- it is the ONLY sanctioned write path into orders/order_items/stock.
grant execute on function place_order(uuid, text, text, text, uuid, jsonb, text, numeric, numeric, text, text, order_item_input[]) to anon, authenticated;
-- ============================================================
-- 07_notify_reviews_wishlist.sql
--
-- stock_notify_requests: no automation at all. Any visitor (guest or
-- logged in) can leave their WhatsApp number against an out-of-stock
-- product. This just lands in a table the admin dashboard reads from
-- a dedicated page ("Restock Requests"), so Mohamed's team can message
-- people manually on WhatsApp themselves. No SMS/push/email is sent
-- automatically by the system for this feature.
-- ============================================================

create table stock_notify_requests (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  whatsapp_number text not null,
  user_id uuid references auth.users(id) on delete set null,
  is_contacted boolean not null default false,
  contacted_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notify_requests_product on stock_notify_requests (product_id);
create index idx_notify_requests_uncontacted on stock_notify_requests (is_contacted) where is_contacted = false;

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  order_item_id uuid references order_items(id) on delete set null,

  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  is_verified_purchase boolean not null default false,
  is_published boolean not null default true,

  created_at timestamptz not null default now()
);

create index idx_reviews_product on reviews (product_id, is_published);
create index idx_reviews_user on reviews (user_id);
create unique index idx_reviews_one_per_order_item on reviews (order_item_id) where order_item_id is not null;

create table wishlist_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index idx_wishlist_user on wishlist_items (user_id);
create index idx_wishlist_product on wishlist_items (product_id);

-- Keep rating_average / rating_count on products in sync automatically
create or replace function refresh_product_rating() returns trigger as $$
begin
  update products p
  set rating_average = coalesce((select round(avg(rating)::numeric, 1) from reviews where product_id = coalesce(new.product_id, old.product_id) and is_published = true), 0),
      rating_count = (select count(*) from reviews where product_id = coalesce(new.product_id, old.product_id) and is_published = true)
  where p.id = coalesce(new.product_id, old.product_id);
  return null;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_refresh_rating_ins_upd
after insert or update on reviews
for each row execute function refresh_product_rating();

create trigger trg_refresh_rating_del
after delete on reviews
for each row execute function refresh_product_rating();

revoke execute on function refresh_product_rating() from public;
-- ============================================================
-- 08_rls_public_catalog.sql
-- ============================================================

alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table reviews enable row level security;

create policy "public read brands" on brands for select using (true);
create policy "public read active categories" on categories for select using (is_active = true);
create policy "public read active products" on products for select using (status = 'active');
create policy "public read product images" on product_images for select
  using (exists (select 1 from products p where p.id = product_images.product_id and p.status = 'active'));
create policy "public read product variants" on product_variants for select
  using (exists (select 1 from products p where p.id = product_variants.product_id and p.status = 'active'));
create policy "public read published reviews" on reviews for select using (is_published = true);
-- ============================================================
-- 09_rls_user_data.sql
-- ============================================================

alter table profiles enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table wishlist_items enable row level security;
alter table stock_notify_requests enable row level security;

-- Helper: is the current user an admin or superadmin?
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$ language sql stable security definer set search_path = public;

revoke execute on function is_admin() from public;

-- Helper: is the current user specifically a superadmin?
create or replace function is_superadmin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'superadmin'
  );
$$ language sql stable security definer set search_path = public;

revoke execute on function is_superadmin() from public;

-- profiles
create policy "user reads own profile" on profiles for select using ((select auth.uid()) = id or is_admin());
create policy "user updates own profile" on profiles for update using ((select auth.uid()) = id);
create policy "admin updates any profile role" on profiles for update using (is_superadmin());

-- addresses: owned by user; admins can read for fulfillment
create policy "user manages own addresses" on addresses for all
  using ((select auth.uid()) = user_id or is_admin())
  with check ((select auth.uid()) = user_id);

-- orders: user reads own; admin reads/updates all; guest checkout allowed (user_id null)
create policy "user reads own orders" on orders for select using ((select auth.uid()) = user_id or is_admin());
create policy "admin updates orders" on orders for update using (is_admin());

-- order_items: readable if you can read the parent order
create policy "read order items via order" on order_items for select
  using (exists (select 1 from orders o where o.id = order_items.order_id and (o.user_id = (select auth.uid()) or is_admin())));

-- wishlist: strictly own rows, must be logged in
create policy "user manages own wishlist" on wishlist_items for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- reviews: users write their own; admins moderate
create policy "user creates own review" on reviews for insert with check ((select auth.uid()) = user_id);
create policy "user updates own review" on reviews for update using ((select auth.uid()) = user_id or is_admin());
create policy "user deletes own review" on reviews for delete using ((select auth.uid()) = user_id or is_admin());

-- stock notify requests: ANYONE (including guests via anon key) can insert.
-- Only admins can read the list (shown in the dashboard "Restock Requests" page).
create policy "anyone can request restock notify" on stock_notify_requests for insert with check (true);
create policy "admin reads notify requests" on stock_notify_requests for select using (is_admin());
create policy "admin updates notify requests" on stock_notify_requests for update using (is_admin());
-- ============================================================
-- 10_rls_admin_catalog_writes.sql
-- This is what makes Add/Edit/Delete product actually work from
-- the dashboard. Only rows where profiles.role is admin/superadmin
-- can insert/update/delete catalog data. No public writes anywhere.
-- ============================================================

create policy "admin insert brands" on brands for insert with check (is_admin());
create policy "admin update brands" on brands for update using (is_admin());
create policy "admin delete brands" on brands for delete using (is_admin());

create policy "admin insert categories" on categories for insert with check (is_admin());
create policy "admin update categories" on categories for update using (is_admin());
create policy "admin delete categories" on categories for delete using (is_admin());

create policy "admin insert products" on products for insert with check (is_admin());
create policy "admin update products" on products for update using (is_admin());
create policy "admin delete products" on products for delete using (is_admin());

create policy "admin insert product images" on product_images for insert with check (is_admin());
create policy "admin update product images" on product_images for update using (is_admin());
create policy "admin delete product images" on product_images for delete using (is_admin());

create policy "admin insert product variants" on product_variants for insert with check (is_admin());
create policy "admin update product variants" on product_variants for update using (is_admin());
create policy "admin delete product variants" on product_variants for delete using (is_admin());
-- ============================================================
-- 11_dashboard_views_and_realtime.sql
-- ============================================================

create view v_low_stock_products as
select id, name, sku, stock_quantity, low_stock_threshold, category_id
from products
where status = 'active' and stock_quantity <= low_stock_threshold
order by stock_quantity asc;

create view v_daily_sales as
select
  date_trunc('day', created_at) as day,
  count(*) as order_count,
  sum(total) filter (where payment_status = 'paid') as revenue,
  sum(total) as gross_total
from orders
where status <> 'cancelled'
group by 1
order by 1 desc;

create view v_best_sellers as
select p.id, p.name, p.category_id, p.sales_count, p.rating_average, p.stock_quantity
from products p
where p.status = 'active'
order by p.sales_count desc;

alter view v_low_stock_products set (security_invoker = true);
alter view v_daily_sales set (security_invoker = true);
alter view v_best_sellers set (security_invoker = true);

-- ============================================================
-- REALTIME: enable Postgres change broadcasts for the tables the
-- dashboard and the customer order-tracking UI subscribe to.
-- Supabase's `supabase_realtime` publication must include these.
-- ============================================================
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
alter publication supabase_realtime add table products;