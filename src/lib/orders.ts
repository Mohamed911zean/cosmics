import { supabase } from '@/lib/supabase'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'unpaid'
  | 'paid'
  | 'partially_refunded'
  | 'refunded'
  | 'failed'

export interface OrderItem {
  id: string
  productId: string | null
  variantId: string | null
  name: string
  image: string
  price: number
  quantity: number
  lineTotal: number
  category: string
}

export interface Order {
  id: string
  orderNumber: string
  date: number
  createdAt: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  discountTotal: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  shippingDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
}

interface OrderItemRow {
  id: string
  product_id: string | null
  variant_id: string | null
  product_name: string
  product_image: string | null
  unit_price: number | string
  quantity: number
  line_total: number | string
}

interface OrderRow {
  id: string
  order_number: string
  user_id: string | null
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: string | null
  subtotal: number | string
  discount_total: number | string
  shipping_fee: number | string
  total: number | string
  shipping_address_snapshot: Record<string, unknown> | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  created_at: string
  order_items?: OrderItemRow[] | null
}

export interface PlaceOrderInput {
  userId: string | null
  customerName: string
  customerPhone: string
  customerEmail: string
  shippingAddressId: string | null
  shippingAddressSnapshot: Record<string, unknown>
  paymentMethod: string
  shippingFee: number
  discountTotal: number
  couponCode: string | null
  notes: string | null
  items: Array<{ product_id: string; variant_id: string | null; quantity: number }>
}

const ORDER_SELECT = `
  *,
  order_items(id,product_id,variant_id,product_name,product_image,unit_price,quantity,line_total)
`

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return 0
  return typeof value === 'number' ? value : Number(value)
}

function snapshotString(snapshot: Record<string, unknown> | null, key: string) {
  const value = snapshot?.[key]
  return typeof value === 'string' ? value : ''
}

export function formatStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function mapOrder(row: OrderRow): Order {
  const snapshot = row.shipping_address_snapshot
  const nameParts = row.customer_name.trim().split(/\s+/)
  const firstName = snapshotString(snapshot, 'firstName') || nameParts[0] || row.customer_name
  const lastName = snapshotString(snapshot, 'lastName') || nameParts.slice(1).join(' ')

  return {
    id: row.id,
    orderNumber: row.order_number,
    date: new Date(row.created_at).getTime(),
    createdAt: row.created_at,
    items: (row.order_items || []).map((item) => ({
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      name: item.product_name,
      image: item.product_image || '',
      price: toNumber(item.unit_price),
      quantity: item.quantity,
      lineTotal: toNumber(item.line_total),
      category: '',
    })),
    subtotal: toNumber(row.subtotal),
    shippingFee: toNumber(row.shipping_fee),
    discountTotal: toNumber(row.discount_total),
    total: toNumber(row.total),
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method || undefined,
    shippingDetails: {
      firstName,
      lastName,
      email: snapshotString(snapshot, 'email') || row.customer_email || '',
      phone: snapshotString(snapshot, 'phone') || row.customer_phone,
      address: snapshotString(snapshot, 'address'),
      city: snapshotString(snapshot, 'city'),
      postalCode: snapshotString(snapshot, 'postalCode'),
    },
  }
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapOrder(data as OrderRow) : null
}

export async function fetchOrdersForUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data || []) as OrderRow[]).map(mapOrder)
}

export async function fetchAllOrdersForAdmin(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data || []) as OrderRow[]).map(mapOrder)
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const { data, error } = await supabase.rpc('place_order', {
    p_user_id: input.userId,
    p_customer_name: input.customerName,
    p_customer_phone: input.customerPhone,
    p_customer_email: input.customerEmail,
    p_shipping_address_id: input.shippingAddressId,
    p_shipping_address_snapshot: input.shippingAddressSnapshot,
    p_payment_method: input.paymentMethod,
    p_shipping_fee: input.shippingFee,
    p_discount_total: input.discountTotal,
    p_coupon_code: input.couponCode,
    p_notes: input.notes,
    p_items: input.items,
  })

  if (error) throw error

  const created = data as OrderRow
  const order = await fetchOrderById(created.id)
  if (!order) throw new Error('Order was placed but could not be loaded')
  return order
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

export function subscribeToUserOrders(userId: string, onChange: () => void) {
  return supabase
    .channel(`orders-user-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
      onChange,
    )
    .subscribe()
}

export function subscribeToAdminOrderInserts(onInsert: (orderId: string) => void) {
  return supabase
    .channel('orders-admin-inserts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        const row = payload.new as { id?: string }
        if (row.id) onInsert(row.id)
      },
    )
    .subscribe()
}

export function subscribeToOrderUpdates(orderId: string, onChange: () => void) {
  return supabase
    .channel(`orders-order-${orderId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
      onChange,
    )
    .subscribe()
}
