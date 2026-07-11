import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type UserRole = 'user' | 'admin' | 'superadmin' | null

interface AuthState {
  role: UserRole
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  setUser: (user: User | null, role?: UserRole) => void
  fetchRole: (userId: string) => Promise<UserRole>
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  googleLogin: () => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
  initializeAuth: () => () => void
}

function normalizeRole(role: unknown): UserRole {
  if (role === 'admin' || role === 'superadmin') return role
  return 'user'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      role: null,
      user: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      setUser: (user, role = null) =>
        set({
          role,
          user,
          isAuthenticated: Boolean(user),
          isLoading: false,
        }),

      fetchRole: async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle()

        if (error) {
          console.warn('Failed to fetch profile role:', error.message)
          return 'user'
        }

        return normalizeRole(data?.role)
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error || !data.user) {
          set({ error: 'Invalid email or password', isLoading: false })
          return false
        }

        const role = await get().fetchRole(data.user.id)
        set({
          user: data.user,
          role,
          isAuthenticated: true,
          isLoading: false,
        })
        return true
      },

      signup: async (email, password) => {
        set({ isLoading: true, error: null })
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
            },
          },
        })

        if (error) {
          set({ error: error.message || 'Failed to create account', isLoading: false })
          return false
        }

        const user = data.user
        if (!user) {
          set({ isLoading: false })
          return true
        }

        const role = await get().fetchRole(user.id)
        set({
          user,
          role,
          isAuthenticated: true,
          isLoading: false,
        })
        return true
      },

      googleLogin: async () => {
        set({ isLoading: true, error: null })
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              prompt: 'select_account',
            },
          },
        })

        if (error) {
          set({ error: error.message || 'Google login failed', isLoading: false })
          return false
        }

        return true
      },

      logout: async () => {
        set({ isLoading: true })
        const { error } = await supabase.auth.signOut()
        if (error) {
          set({ isLoading: false, error: error.message })
          throw error
        }

        set({
          user: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      clearError: () => set({ error: null }),

      initializeAuth: () => {
        let active = true

        supabase.auth.getUser().then(async ({ data }) => {
          if (!active) return
          const user = data.user
          if (!user) {
            set({ user: null, role: null, isAuthenticated: false, isLoading: false })
            return
          }

          const role = await get().fetchRole(user.id)
          if (!active) return
          set({ user, role, isAuthenticated: true, isLoading: false })
        })

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          const user = session?.user || null

          // A real sign-out (or a session that's gone for any reason):
          // always clear everything, regardless of which event fired.
          if (!user) {
            set({ user: null, role: null, isAuthenticated: false, isLoading: false })
            return
          }

          // TOKEN_REFRESHED fires automatically whenever the browser tab
          // regains focus/visibility, even though the logged-in user
          // hasn't changed at all. Treating it like a fresh login (flipping
          // isLoading, re-fetching the role, etc.) is what caused the whole
          // dashboard to "reload" every time the tab was switched and come
          // back to. We just quietly refresh the `user` object (in case the
          // token/claims changed) without touching isLoading or re-fetching
          // the role, so nothing downstream re-renders or unmounts.
          if (event === 'TOKEN_REFRESHED') {
            const current = get()
            if (current.user?.id === user.id) {
              set({ user })
            }
            return
          }

          // INITIAL_SESSION on a tab that already has the same user loaded:
          // confirm quietly, no loading flash.
          if (event === 'INITIAL_SESSION') {
            const current = get()
            if (current.user?.id === user.id && current.role) {
              set({ user, isAuthenticated: true, isLoading: false })
              return
            }
          }

          // Real auth changes: SIGNED_IN, USER_UPDATED, or a genuinely
          // different user. These are the only cases that should show a
          // loading state and re-fetch the role from the database.
          set({ isLoading: true })
          window.setTimeout(async () => {
            const role = await get().fetchRole(user.id)
            set({ user, role, isAuthenticated: true, isLoading: false })
          }, 0)
        })

        return () => {
          active = false
          data.subscription.unsubscribe()
        }
      },
    }),
    {
      name: 'majestics-auth',
      partialize: (state) => ({
        role: state.role,
      }),
    },
  ),
)