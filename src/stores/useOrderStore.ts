import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from './useCartStore'

export interface OrderItem extends CartItem { }

export interface Order {
    id: string
    date: number
    items: OrderItem[]
    total: number
    status: 'Processing' | 'Shipped' | 'Delivered'
    shippingDetails: {
        firstName: string
        lastName: string
        email: string
        address: string
        city: string
        postalCode: string
    }
}

interface OrderState {
    orders: Order[]
    addOrder: (order: Order) => void
    setOrders: (orders: Order[]) => void
    getOrders: () => Order[]
    setUser: (user: any) => void
    fetchFromFirestore: () => Promise<void>
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            addOrder: (order) => {
                set((state) => ({ orders: [order, ...state.orders] }))
            },
            setOrders: (orders) => set({ orders }),
            getOrders: () => get().orders,
            setUser: (user) => {
                if (!user) {
                    set({ orders: [] })
                }
            },
            fetchFromFirestore: async () => {
                const { auth } = await import('@/lib/firebase')
                const { getUserData } = await import('@/lib/db')
                const user = auth.currentUser
                if (user) {
                    const data = await getUserData(user.uid)
                    if (data?.orders) {
                        set({ orders: data.orders })
                    }
                }
            },
        }),
        {
            name: 'lumiere-orders',
        }
    )
)
