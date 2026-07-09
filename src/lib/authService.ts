import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const loginUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) throw new Error(error?.message || 'Login failed')
  return data.user
}

export const signupUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) throw new Error(error?.message || 'Signup failed')
  return data.user
}

export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw new Error(error.message || 'Google sign-in failed')
}

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message || 'Logout failed')
}

export const observeAuthState = (callback: (user: User | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })

  supabase.auth.getUser().then(({ data: userData }) => callback(userData.user))

  return () => data.subscription.unsubscribe()
}
