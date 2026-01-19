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
    setItems: (items: WishlistItem[]) => void
    getItemCount: () => number
    setUser: (user: any) => void
    fetchFromFirestore: () => Promise<void>
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

            setItems: (items) => set({ items }),

            getItemCount: () => get().items.length,

            setUser: (user) => {
                if (!user) {
                    set({ items: [] })
                }
            },

            fetchFromFirestore: async () => {
                const { auth } = await import('@/lib/firebase')
                const { getUserData } = await import('@/lib/db')
                const user = auth.currentUser
                if (user) {
                    const data = await getUserData(user.uid)
                    if (data?.wishlist) {
                        set({ items: data.wishlist })
                    }
                }
            },
        }),
        {
            name: 'lumiere-wishlist',
        }
    )
)
