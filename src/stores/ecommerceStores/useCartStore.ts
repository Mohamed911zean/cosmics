import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string | null
  name: string
  price: number
  quantity: number
  image: string
  category: string
  stockQuantity?: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setItems: (items: CartItem[]) => void
  getSubtotal: () => number
  getTax: () => number
  getTotal: () => number
  getItemCount: () => number
  setUser: (user: unknown) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((cartItem) => cartItem.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem,
              ),
            }
          }
          return { items: [...state.items, { ...item, productId: item.productId || item.id, quantity }] }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        })),

      clearCart: () => set({ items: [] }),

      setItems: (items) => set({ items }),

      setUser: () => {},

      getSubtotal: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      getTax: () => 0,

      getTotal: () => get().getSubtotal() + get().getTax(),

      getItemCount: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'majestics-cart',
    },
  ),
)
