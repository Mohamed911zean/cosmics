import { supabase } from '@/lib/supabase'

export interface RestockRequest {
  id: string
  productId: string
  productName: string
  whatsappNumber: string
  isContacted: boolean
  contactedAt: string | null
  createdAt: string
}

export async function createStockNotifyRequest(productId: string, whatsappNumber: string, userId?: string | null) {
  const { error } = await supabase.from('stock_notify_requests').insert({
    product_id: productId,
    whatsapp_number: whatsappNumber,
    user_id: userId || null,
  })

  if (error) throw error
}

export async function fetchRestockRequests(): Promise<RestockRequest[]> {
  const { data, error } = await supabase
    .from('stock_notify_requests')
    .select('id,product_id,whatsapp_number,is_contacted,contacted_at,created_at,products(name)')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((request) => {
    const product = request.products as { name?: string } | null
    return {
      id: request.id,
      productId: request.product_id,
      productName: product?.name || 'Unknown product',
      whatsappNumber: request.whatsapp_number,
      isContacted: request.is_contacted,
      contactedAt: request.contacted_at,
      createdAt: request.created_at,
    }
  })
}

export async function markRestockRequestContacted(id: string) {
  const { error } = await supabase
    .from('stock_notify_requests')
    .update({ is_contacted: true, contacted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}
