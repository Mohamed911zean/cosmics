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

interface BestSellerProduct {
    id: number
    name: string
    category: string
    image: string
    totalSold: number
    revenue: number
}

interface CustomerData {
    email: string
    name: string
    ordersCount: number
    totalSpent: number
}

interface OrderState {
    orders: Order[]
    allOrders: Order[] // All orders from all users (for admin)
    isLoadingAllOrders: boolean

    addOrder: (order: Order) => void
    setOrders: (orders: Order[]) => void
    getOrders: () => Order[]
    getTotalRevenue: () => number
    getOrdersByStatus: (status: Order['status']) => Order[]
    getCustomers: () => CustomerData[]
    getBestSellers: () => BestSellerProduct[]

    // Admin functions (uses allOrders)
    getAllOrdersTotalRevenue: () => number
    getAllOrdersByStatus: (status: Order['status']) => Order[]
    getAllCustomers: () => CustomerData[]
    getGlobalBestSellers: () => BestSellerProduct[]
    fetchAllOrdersForAdmin: () => Promise<void>

    setUser: (user: unknown) => void
    fetchFromFirestore: () => Promise<void>
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],
            allOrders: [],
            isLoadingAllOrders: false,

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
                const customersMap = new Map<string, CustomerData>()

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
                const productsMap = new Map<string | number, BestSellerProduct>()

                orders.forEach((order) => {
                    if (!order || !order.items) return
                    order.items.forEach((item) => {
                        if (!item || !item.id) return
                        if (productsMap.has(item.id)) {
                            const product = productsMap.get(item.id)!
                            product.totalSold += (Number(item.quantity) || 0)
                            product.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0)
                        } else {
                            productsMap.set(item.id, {
                                id: Number(item.id),
                                name: item.name || 'Unknown Product',
                                category: item.category || 'Uncategorized',
                                image: item.image || '',
                                totalSold: Number(item.quantity) || 0,
                                revenue: (Number(item.price) || 0) * (Number(item.quantity) || 0)
                            })
                        }
                    })
                })

                return Array.from(productsMap.values())
                    .sort((a, b) => b.totalSold - a.totalSold)
            },

            // ===== Admin Functions (use allOrders from all users) =====

            getAllOrdersTotalRevenue: () => {
                return get().allOrders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0)
            },

            getAllOrdersByStatus: (status) => {
                return get().allOrders.filter((order) => order && order.status === status)
            },

            getAllCustomers: () => {
                const orders = get().allOrders
                const customersMap = new Map<string, CustomerData>()

                orders.forEach((order) => {
                    if (!order || !order.shippingDetails) return
                    const { email, firstName, lastName } = order.shippingDetails
                    if (!email) return
                    const name = `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown Customer'

                    if (customersMap.has(email)) {
                        const customer = customersMap.get(email)!
                        customer.ordersCount += 1
                        customer.totalSpent += (Number(order.total) || 0)
                    } else {
                        customersMap.set(email, {
                            email,
                            name,
                            ordersCount: 1,
                            totalSpent: (Number(order.total) || 0)
                        })
                    }
                })

                return Array.from(customersMap.values())
            },

            getGlobalBestSellers: () => {
                const orders = get().allOrders
                const productsMap = new Map<string | number, BestSellerProduct>()

                orders.forEach((order) => {
                    if (!order || !order.items) return
                    order.items.forEach((item) => {
                        if (!item || !item.id) return
                        
                        // Handle potential type mismatch between string/number IDs
                        if (productsMap.has(item.id)) {
                            const product = productsMap.get(item.id)!
                            product.totalSold += (Number(item.quantity) || 0)
                            product.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0)
                        } else {
                            productsMap.set(item.id, {
                                id: Number(item.id),
                                name: item.name || 'Unknown Product',
                                category: item.category || 'Uncategorized',
                                image: item.image || '',
                                totalSold: Number(item.quantity) || 0,
                                revenue: (Number(item.price) || 0) * (Number(item.quantity) || 0)
                            })
                        }
                    })
                })

                return Array.from(productsMap.values())
                    .sort((a, b) => b.totalSold - a.totalSold)
            },

            fetchAllOrdersForAdmin: async () => {
                set({ isLoadingAllOrders: true })
                try {
                    const { getAllOrdersFromFirestore } = await import('@/lib/db')
                    const allOrders = await getAllOrdersFromFirestore()
                    set({ allOrders: allOrders as Order[], isLoadingAllOrders: false })
                } catch (error) {
                    console.error("Error fetching all orders for admin:", error)
                    set({ isLoadingAllOrders: false })
                }
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
            partialize: (state) => ({
                // Don't persist allOrders - always fetch fresh from Firestore
                orders: state.orders,
            }),
        }
    )
)