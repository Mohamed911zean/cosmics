import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('lumiere-theme')
        if (saved === 'light' || saved === 'dark') return saved
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: getInitialTheme(),

            setTheme: (theme) => {
                const root = window.document.documentElement
                root.classList.remove('light', 'dark')
                root.classList.add(theme)
                set({ theme })
            },

            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light'
                    const root = window.document.documentElement
                    root.classList.remove('light', 'dark')
                    root.classList.add(newTheme)
                    return { theme: newTheme }
                }),
        }),
        {
            name: 'lumiere-theme',
        }
    )
)
