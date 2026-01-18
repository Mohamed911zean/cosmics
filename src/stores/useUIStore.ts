import { create } from 'zustand'

interface UIState {
    isMenuOpen: boolean
    isSearchOpen: boolean
    isCartDrawerOpen: boolean
    searchQuery: string
    setMenuOpen: (open: boolean) => void
    setSearchOpen: (open: boolean) => void
    setCartDrawerOpen: (open: boolean) => void
    setSearchQuery: (query: string) => void
    toggleMenu: () => void
    toggleSearch: () => void
    toggleCartDrawer: () => void
    closeAll: () => void
}

export const useUIStore = create<UIState>((set) => ({
    isMenuOpen: false,
    isSearchOpen: false,
    isCartDrawerOpen: false,
    searchQuery: '',

    setMenuOpen: (open) => set({ isMenuOpen: open }),
    setSearchOpen: (open) => set({ isSearchOpen: open }),
    setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

    closeAll: () =>
        set({
            isMenuOpen: false,
            isSearchOpen: false,
            isCartDrawerOpen: false,
        }),
}))
