import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'order' | 'info' | 'warning'
  date: number
  read: boolean
  link?: string
}

interface NotificationStore {
  notifications: NotificationItem[]
  unreadCount: number
  addNotification: (notification: Omit<NotificationItem, 'read' | 'date'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => {
        const newItem: NotificationItem = {
          ...notification,
          id: notification.id || Math.random().toString(36).substr(2, 9),
          date: Date.now(),
          read: false
        }
        
        set((state) => ({
          notifications: [newItem, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }))
      },

      markAsRead: (id) => {
        set((state) => {
          const notifications = state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
          const unreadCount = notifications.filter(n => !n.read).length
          return { notifications, unreadCount }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }))
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
      }
    }),
    {
      name: 'dashboard-notifications',
    }
  )
)
