import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
    category: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    getSubtotal: () => number
    getTax: () => number
    getTotal: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id)
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                        }
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }] }
                }),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                })),

            clearCart: () => set({ items: [] }),

            getSubtotal: () =>
                get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

            getTax: () => get().getSubtotal() * 0.1,

            getTotal: () => get().getSubtotal() + get().getTax(),

            getItemCount: () =>
                get().items.reduce((acc, item) => acc + item.quantity, 0),
        }),
        {
            name: 'lumiere-cart',
        }
    )
)
