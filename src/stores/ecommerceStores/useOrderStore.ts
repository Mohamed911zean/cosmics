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
    allOrders: Order[]
    isLoadingAllOrders: boolean
    
    addOrder: (order: Order) => void
    setOrders: (orders: Order[]) => void
    getOrders: () => Order[]
    getTotalRevenue: () => number
    getOrdersByStatus: (status: Order['status']) => Order[]
    getCustomers: () => CustomerData[]
    getBestSellers: () => BestSellerProduct[]
    
    getAllOrdersTotalRevenue: () => number
    getAllOrdersByStatus: (status: Order['status']) => Order[]
    getAllCustomers: () => CustomerData[]
    getGlobalBestSellers: () => BestSellerProduct[]
    fetchAllOrdersForAdmin: () => Promise<void>
    
    setUser: (user: any) => void
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
                const productsMap = new Map<number, BestSellerProduct>()

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
            
            // ===== Admin Functions (use allOrders from all users) =====
            
            getAllOrdersTotalRevenue: () => {
                return get().allOrders.reduce((sum, order) => sum + order.total, 0)
            },
            
            getAllOrdersByStatus: (status) => {
                return get().allOrders.filter((order) => order.status === status)
            },
            
            getAllCustomers: () => {
                const orders = get().allOrders
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
            
            getGlobalBestSellers: () => {
                const orders = get().allOrders
                const productsMap = new Map<number, BestSellerProduct>()

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
            
            fetchAllOrdersForAdmin: async () => {
                set({ isLoadingAllOrders: true })
                try {
                    // Wait for auth to be ready
                    const { auth } = await import('@/lib/firebase')
                    
                    // Wait for user to be fully authenticated with role
                    let attempts = 0
                    while (!auth.currentUser && attempts < 10) {
                        await new Promise(resolve => setTimeout(resolve, 200))
                        attempts++
                    }
                    
                    if (!auth.currentUser) {
                        throw new Error('User not authenticated')
                    }
                    
                    // Force token refresh to ensure role is included
                    await auth.currentUser.getIdToken(true)
                    
                    // Small delay to ensure token is propagated
                    await new Promise(resolve => setTimeout(resolve, 300))
                    
                    const { getAllOrdersFromFirestore } = await import('@/lib/db')
                    const allOrders = await getAllOrdersFromFirestore()
                    set({ allOrders: allOrders as Order[], isLoadingAllOrders: false })
                } catch (error) {
                    console.error("Error fetching all orders for admin:", error)
                    set({ isLoadingAllOrders: false })
                    throw error
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
            name: 'majestics-orders',
            partialize: (state) => ({
                orders: state.orders,
            }),
        }
    )
)