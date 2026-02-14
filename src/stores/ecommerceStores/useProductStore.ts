import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import siteData from '@/data/data.json'

/* =======================
   Types
======================= */

export interface Product {
    id: number
    name: string
    price: number
    category: string
    image: string
    description?: string
    rating?: number
    reviews?: number
    images?: string[]
    sold?: number
}

export interface Category {
    id: number
    name: string
    productCount: number
    image: string
}

export interface BrandLinks {
    email: string
    support: string
    address: string
}

export interface Brand {
    name: string
    tagline: string
    description: string
    links: BrandLinks
}

export interface Service {
    id: number
    title: string
    description: string
    icon: string
    image: string
}

/* =======================
   Data
======================= */

const productsData: Product[] = siteData.products
const categoriesData: Category[] = siteData.categories

/* =======================
   Store Interface
======================= */

interface ProductState {
    products: Product[]
    newProducts: Product[]
    featuredProducts: Product[]
    categories: Category[]
    services: Service[]
    brand: Brand
    selectedProduct: Product | null
    isLoading: boolean

    setSelectedProduct: (product: Product | null) => void
    addProduct: (product: Omit<Product, 'id' | 'sold'>) => Promise<void>
    updateProduct: (id: number, product: Partial<Product>) => void
    deleteProduct: (id: number) => void
    getProductById: (id: number) => Product | undefined
    getProductsByCategory: (category: string) => Product[]
    getAllProducts: () => Product[]
    setUser: (user: unknown) => void
    fetchFromFirestore: () => Promise<void>
}

/* =======================
   Store
======================= */

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: productsData,
            newProducts: [],
            featuredProducts: productsData.slice(0, 4),
            categories: categoriesData,
            services: siteData.services as Service[],
            brand: siteData.brand as Brand,
            selectedProduct: null,
            isLoading: false,

            /* -------- Actions -------- */

            setSelectedProduct: (product) =>
                set({ selectedProduct: product }),

            addProduct: async (product) => {
                const newProduct: Product = {
                    ...product,
                    id: Date.now(),
                    sold: 0,
                }

                // Update local state immediately so the UI reflects the new product
                set((state) => ({
                    newProducts: [...state.newProducts, newProduct],
                }))

                // Then persist to Firestore
                try {
                    const { addProductToFirestore } = await import('@/lib/db')
                    await addProductToFirestore(newProduct)
                } catch (error) {
                    console.error('Failed to save product to Firestore:', error)
                    // Product is still in local state via newProducts
                }
            },

            updateProduct: (id, updates) => {
                const { products } = get()

                if (products.some((p) => p.id === id)) {
                    set((state) => ({
                        products: state.products.map((p) =>
                            p.id === id ? { ...p, ...updates } : p
                        ),
                    }))
                } else {
                    set((state) => ({
                        newProducts: state.newProducts.map((p) =>
                            p.id === id ? { ...p, ...updates } : p
                        ),
                    }))
                }
            },

            deleteProduct: (id) => {
                const { products } = get()

                if (products.some((p) => p.id === id)) {
                    set((state) => ({
                        products: state.products.filter((p) => p.id !== id),
                    }))
                } else {
                    set((state) => ({
                        newProducts: state.newProducts.filter((p) => p.id !== id),
                    }))
                }
            },

            getProductById: (id) => {
                return get().getAllProducts().find((p) => p.id === id)
            },

            getProductsByCategory: (category) => {
                return get()
                    .getAllProducts()
                    .filter(
                        (p) => p.category.toLowerCase() === category.toLowerCase()
                    )
            },

            getAllProducts: () => {
                const { products, newProducts } = get()
                const map = new Map<number, Product>()
                for (const p of products) {
                    map.set(p.id, p)
                }
                for (const p of newProducts) {
                    if (!map.has(p.id)) {
                        map.set(p.id, p)
                    }
                }
                return Array.from(map.values())
            },

            setUser: async () => {
                const { subscribeToProducts, getAllProductsFromFirestore, addProductToFirestore } = await import('@/lib/db')
                set({ isLoading: true })

                // Capture newProducts BEFORE subscribing, because the subscription
                // callback will clear them when the first snapshot arrives
                const pendingNewProducts = [...get().newProducts]

                const unsubscribe = subscribeToProducts((items) => {
                    const mapped = items.map((p: any) => {
                        const numericId = typeof p.id === 'string' ? Number(p.id) : p.id
                        return {
                            ...p,
                            id: isNaN(numericId) ? Date.now() + Math.random() : numericId,
                        }
                    })

                    // Merge Firestore products with static data
                    const mergedMap = new Map<number, Product>()
                    // Add static products first
                    for (const p of productsData) {
                        mergedMap.set(p.id, p)
                    }
                    // Override/add with Firestore products
                    for (const p of mapped) {
                        mergedMap.set(p.id, p as Product)
                    }

                    const allProducts = Array.from(mergedMap.values())
                    set({
                        products: allProducts,
                        featuredProducts: allProducts.slice(0, 4),
                        isLoading: false,
                        newProducts: [],
                    })
                })
                    ; (window as any).__productsUnsub__ = unsubscribe

                // Reconcile: push any locally-stored products that aren't yet in Firestore
                try {
                    const existing = await getAllProductsFromFirestore()
                    const existingIds = new Set(
                        existing.map((p: any) =>
                            typeof p.id === 'string' ? Number(p.id) : p.id
                        )
                    )
                    for (const p of pendingNewProducts) {
                        const pid = typeof p.id === 'string' ? Number(p.id) : p.id
                        if (!existingIds.has(pid)) {
                            await addProductToFirestore(p)
                        }
                    }
                } catch {
                }
            },

            fetchFromFirestore: async () => {
                const { getAllProductsFromFirestore } = await import('@/lib/db')
                set({ isLoading: true })
                const items = await getAllProductsFromFirestore()
                const mapped = items.map((p: any) => {
                    const numericId = typeof p.id === 'string' ? Number(p.id) : p.id
                    return {
                        ...p,
                        id: isNaN(numericId) ? Date.now() + Math.random() : numericId,
                    }
                })

                // Merge with static data
                const mergedMap = new Map<number, Product>()
                for (const p of productsData) {
                    mergedMap.set(p.id, p)
                }
                for (const p of mapped) {
                    mergedMap.set(p.id, p as Product)
                }

                const allProducts = Array.from(mergedMap.values())
                set({
                    products: allProducts,
                    featuredProducts: allProducts.slice(0, 4),
                    isLoading: false,
                })
            },
        }),
        {
            name: 'majestics-products',
            partialize: (state) => ({
                newProducts: state.newProducts,
            }),
        }
    )
)
