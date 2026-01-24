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
    getTotalRevenue: () => number
    getOrdersByStatus: (status: Order['status']) => Order[]
    getCustomers: () => Array<{
        email: string
        name: string
        ordersCount: number
        totalSpent: number
    }>
    getBestSellers: () => Array<{
        id: number
        name: string
        category: string
        image: string
        totalSold: number
        revenue: number
    }>
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
            
            getTotalRevenue: () => {
                return get().orders.reduce((sum, order) => sum + order.total, 0)
            },
            
            getOrdersByStatus: (status) => {
                return get().orders.filter((order) => order.status === status)
            },
            
            getCustomers: () => {
                const orders = get().orders
                const customersMap = new Map<string, {
                    email: string
                    name: string
                    ordersCount: number
                    totalSpent: number
                }>()

                orders.forEach((order) => {
                    const { email, firstName, lastName } = order.shippingDetails
                    const name = `${firstName} ${lastName}`

                    if (customersMap.has(email)) {
                        const customer = customersMap.get(email)!
                        customer.ordersCount += 1
                        customer.totalSpent += order.total
                    } else {
                        customersMap.set(email, {
                            email,
                            name,
                            ordersCount: 1,
                            totalSpent: order.total
                        })
                    }
                })

                return Array.from(customersMap.values())
            },
            
            getBestSellers: () => {
                const orders = get().orders
                const productsMap = new Map<number, {
                    id: number
                    name: string
                    category: string
                    image: string
                    totalSold: number
                    revenue: number
                }>()

                orders.forEach((order) => {
                    order.items.forEach((item) => {
                        if (productsMap.has(item.id)) {
                            const product = productsMap.get(item.id)!
                            product.totalSold += item.quantity
                            product.revenue += item.price * item.quantity
                        } else {
                            productsMap.set(item.id, {
                                id: item.id,
                                name: item.name,
                                category: item.category,
                                image: item.image,
                                totalSold: item.quantity,
                                revenue: item.price * item.quantity
                            })
                        }
                    })
                })

                return Array.from(productsMap.values())
                    .sort((a, b) => b.totalSold - a.totalSold)
            },
            
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