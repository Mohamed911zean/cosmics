import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null
    setUser: (user: User | null) => void
    login: (email: string, password: string) => Promise<boolean>
    signup: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    clearError: () => void
    initializeAuth: () => () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,
            error: null,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                }),

            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password)
                    set({
                        user: userCredential.user,
                        isAuthenticated: true,
                        isLoading: false,
                    })
                    return true
                } catch (error) {
                    set({
                        error: 'Invalid email or password',
                        isLoading: false,
                    })
                    return false
                }
            },

            signup: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                    set({
                        user: userCredential.user,
                        isAuthenticated: true,
                        isLoading: false,
                    })
                    return true
                } catch (error) {
                    set({
                        error: 'Failed to create account',
                        isLoading: false,
                    })
                    return false
                }
            },

            logout: async () => {
                set({ isLoading: true })
                try {
                    await signOut(auth)
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    })
                } catch (error) {
                    set({ isLoading: false })
                }
            },

            clearError: () => set({ error: null }),

            initializeAuth: () => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    set({
                        user,
                        isAuthenticated: !!user,
                        isLoading: false,
                    })
                })
                return unsubscribe
            },
        }),
        {
            name: 'lumiere-auth',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
