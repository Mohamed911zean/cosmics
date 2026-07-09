import { create } from 'zustand'
import {
  fetchAllOrdersForAdmin as fetchAdminOrders,
  fetchOrdersForUser,
  type Order,
  type OrderItem,
} from '@/lib/orders'
import { useAuthStore } from '@/stores/useAuthStore'

export type { Order, OrderItem }

interface BestSellerProduct {
  id: string
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
  isLoadingOrders: boolean
  isLoadingAllOrders: boolean

  addOrder: (order: Order) => void
  setOrders: (orders: Order[]) => void
  setAllOrders: (orders: Order[]) => void
  getOrders: () => Order[]
  getTotalRevenue: () => number
  getOrdersByStatus: (status: Order['status']) => Order[]
  getCustomers: () => CustomerData[]
  getBestSellers: () => BestSellerProduct[]

  getAllOrdersTotalRevenue: () => number
  getAllOrdersByStatus: (status: Order['status']) => Order[]
  getAllCustomers: () => CustomerData[]
  getGlobalBestSellers: () => BestSellerProduct[]
  fetchOrdersForCurrentUser: () => Promise<void>
  fetchAllOrdersForAdmin: () => Promise<void>

  setUser: (user: unknown) => void
}

function getCustomerName(order: Order) {
  return `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`.trim() || order.shippingDetails.email
}

function buildCustomers(orders: Order[]) {
  const customersMap = new Map<string, CustomerData>()

  orders.forEach((order) => {
    const email = order.shippingDetails.email || order.id
    const name = getCustomerName(order)

    if (customersMap.has(email)) {
      const customer = customersMap.get(email)!
      customer.ordersCount += 1
      customer.totalSpent += order.total
    } else {
      customersMap.set(email, {
        email,
        name,
        ordersCount: 1,
        totalSpent: order.total,
      })
    }
  })

  return Array.from(customersMap.values())
}

function buildBestSellers(orders: Order[]) {
  const productsMap = new Map<string, BestSellerProduct>()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const id = item.productId || item.id
      const existing = productsMap.get(id)
      if (existing) {
        existing.totalSold += item.quantity
        existing.revenue += item.price * item.quantity
      } else {
        productsMap.set(id, {
          id,
          name: item.name,
          category: item.category,
          image: item.image,
          totalSold: item.quantity,
          revenue: item.price * item.quantity,
        })
      }
    })
  })

  return Array.from(productsMap.values()).sort((a, b) => b.totalSold - a.totalSold)
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  allOrders: [],
  isLoadingOrders: false,
  isLoadingAllOrders: false,

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
      allOrders: [order, ...state.allOrders.filter((item) => item.id !== order.id)],
    }))
  },

  setOrders: (orders) => set({ orders }),
  setAllOrders: (orders) => set({ allOrders: orders }),

  getOrders: () => get().orders,

  getTotalRevenue: () => get().orders.reduce((sum, order) => sum + order.total, 0),

  getOrdersByStatus: (status) => get().orders.filter((order) => order.status === status),

  getCustomers: () => buildCustomers(get().orders),

  getBestSellers: () => buildBestSellers(get().orders),

  getAllOrdersTotalRevenue: () => get().allOrders.reduce((sum, order) => sum + order.total, 0),

  getAllOrdersByStatus: (status) => get().allOrders.filter((order) => order.status === status),

  getAllCustomers: () => buildCustomers(get().allOrders),

  getGlobalBestSellers: () => buildBestSellers(get().allOrders),

  fetchOrdersForCurrentUser: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ orders: [] })
      return
    }

    set({ isLoadingOrders: true })
    try {
      const orders = await fetchOrdersForUser(user.id)
      set({ orders, isLoadingOrders: false })
    } catch (error) {
      set({ isLoadingOrders: false })
      throw error
    }
  },

  fetchAllOrdersForAdmin: async () => {
    set({ isLoadingAllOrders: true })
    try {
      const allOrders = await fetchAdminOrders()
      set({ allOrders, isLoadingAllOrders: false })
    } catch (error) {
      set({ isLoadingAllOrders: false })
      throw error
    }
  },

  setUser: (user) => {
    if (!user) set({ orders: [] })
  },
}))
