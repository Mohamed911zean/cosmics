import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
    id: number
    name: string
    price: number
    image: string
    category: string
}

interface WishlistState {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (id: number) => void
    toggleItem: (item: WishlistItem) => void
    isInWishlist: (id: number) => boolean
    clearWishlist: () => void
    getItemCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) =>
                set((state) => {
                    const exists = state.items.some((i) => i.id === item.id)
                    if (exists) return state
                    return { items: [...state.items, item] }
                }),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            toggleItem: (item) => {
                const exists = get().items.some((i) => i.id === item.id)
                if (exists) {
                    get().removeItem(item.id)
                } else {
                    get().addItem(item)
                }
            },

            isInWishlist: (id) => get().items.some((item) => item.id === id),

            clearWishlist: () => set({ items: [] }),

            getItemCount: () => get().items.length,
        }),
        {
            name: 'lumiere-wishlist',
        }
    )
)
