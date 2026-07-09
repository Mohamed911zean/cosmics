import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { mapProduct, type ProductRow } from '@/lib/products'
import { useAuthStore } from '@/stores/useAuthStore'

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  category: string
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  addItem: (item: WishlistItem) => Promise<void>
  removeItem: (id: string) => Promise<void>
  toggleItem: (item: WishlistItem) => Promise<void>
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  setItems: (items: WishlistItem[]) => void
  getItemCount: () => number
  setUser: (user: unknown) => void
  fetchWishlist: () => Promise<void>
}

const wishlistSelect = `
  product_id,
  products(
    *,
    categories(id,name,slug,image_url),
    brands(id,name,slug,logo_url),
    product_images(id,url,alt_text,display_order,is_primary)
  )
`

function requireUserId() {
  const user = useAuthStore.getState().user
  if (!user) throw new Error('SIGN_IN_REQUIRED')
  return user.id
}

function toWishlistItem(product: ReturnType<typeof mapProduct>): WishlistItem {
  return {
    id: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
  }
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  isLoading: false,

  addItem: async (item) => {
    const userId = requireUserId()
    const exists = get().items.some((wishlistItem) => wishlistItem.id === item.id)
    if (exists) return

    const { error } = await supabase.from('wishlist_items').insert({
      user_id: userId,
      product_id: item.productId || item.id,
    })

    if (error) throw error
    set((state) => ({ items: [...state.items, item] }))
  },

  removeItem: async (id) => {
    const userId = requireUserId()
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', id)

    if (error) throw error
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
  },

  toggleItem: async (item) => {
    const exists = get().items.some((wishlistItem) => wishlistItem.id === item.id)
    if (exists) {
      await get().removeItem(item.id)
    } else {
      await get().addItem(item)
    }
  },

  isInWishlist: (id) => get().items.some((item) => item.id === id),

  clearWishlist: () => set({ items: [] }),

  setItems: (items) => set({ items }),

  getItemCount: () => get().items.length,

  setUser: (user) => {
    if (!user) set({ items: [] })
  },

  fetchWishlist: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ items: [] })
      return
    }

    set({ isLoading: true })
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(wishlistSelect)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      set({ isLoading: false })
      throw error
    }

    const items = (data || [])
      .map((row) => row.products)
      .filter(Boolean)
      .map((product) => toWishlistItem(mapProduct(product as unknown as ProductRow)))

    set({ items, isLoading: false })
  },
}))
