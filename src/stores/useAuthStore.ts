import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    type User
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

interface AuthState {
    role: 'user' | 'admin' | 'superadmin' | null
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null
    setUser: (user: User | null, role?: 'user' | 'admin' | 'superadmin' | null) => void
    login: (email: string, password: string) => Promise<boolean>
    signup: (email: string, password: string) => Promise<boolean>
    googleLogin: () => Promise<boolean>
    logout: () => Promise<void>
    clearError: () => void
    initializeAuth: () => () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            role: null,
            user: null,
            isLoading: true,
            isAuthenticated: false,
            error: null,

            setUser: (user, role = null) =>
                set({
                    role,
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                }),

            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password)
                    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
                    const dbRole = userDoc.exists() ? userDoc.data()?.role : 'user'
                    const userRole = dbRole ? String(dbRole).toLowerCase().trim() : 'user'
                    set({
                        user: userCredential.user,
                        role: userRole,
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
                    await setDoc(doc(db, 'users', userCredential.user.uid), {
                        email,
                        role: 'user',
                        cart: []
                    }, { merge: true })
                    set({
                        user: userCredential.user,
                        role: 'user',
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

            googleLogin: async () => {
                set({ isLoading: true, error: null })
                try {
                    const result = await signInWithPopup(auth, new GoogleAuthProvider())
                    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
                    let userRole = 'user'

                    if (userDoc.exists()) {
                        const dbRole = userDoc.data()?.role
                        userRole = dbRole ? String(dbRole).toLowerCase().trim() : 'user'
                    } else {
                        await setDoc(doc(db, 'users', result.user.uid), {
                            email: result.user.email,
                            role: 'user',
                            cart: []
                        })
                    }

                    set({
                        user: result.user,
                        role: userRole as any,
                        isAuthenticated: true,
                        isLoading: false,
                    })
                    return true
                } catch (error) {
                    set({
                        error: 'Google login failed',
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
                        role: null,  
                        isAuthenticated: false,
                        isLoading: false,
                    })
                } catch (error) {
                    set({ isLoading: false })
                }
            },

            clearError: () => set({ error: null }),

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('🔥 onAuthStateChanged fired, user:', user?.uid)
        
        if (user) {
            // Keep loading true while we fetch the role
            set({ isLoading: true })
            
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                const dbRole = userDoc.exists() ? userDoc.data()?.role : 'user'
                const userRole = dbRole ? String(dbRole).toLowerCase().trim() : 'user'
                
                set({
                    role: userRole,
                    user,
                    isAuthenticated: true,
                    isLoading: false,  
                })
            } catch (error) {
                set({
                    role: 'user',
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                })
            }
        } else {
            set({
                user: null,
                role: null,
                isAuthenticated: false,
                isLoading: false,
            })
        }
    })
    return unsubscribe
},
        }),
        {
            name: 'majestics-auth',
            partialize: (state) => ({
                // Only persist role to reduce loading flash
                role: state.role,
            }),
        }
    )
)