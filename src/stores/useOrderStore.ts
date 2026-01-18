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
    getOrders: () => Order[]
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
            getOrders: () => get().orders,
        }),
        {
            name: 'lumiere-orders',
        }
    )
)
