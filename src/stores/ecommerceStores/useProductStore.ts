import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import siteData from '@/data/data.json'

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

const productsData: Product[] = siteData.products
const categoriesData: Category[] = siteData.categories

interface ProductState {
    products: Product[]
    newProducts: Product[] // المنتجات الجديدة اللي اتضافت
    featuredProducts: Product[]
    categories: Category[]
    services: any[]
    brand: any
    selectedProduct: Product | null
    isLoading: boolean
    setSelectedProduct: (product: Product | null) => void
    addProduct: (product: Omit<Product, 'id'>) => void
    updateProduct: (id: number, product: Partial<Product>) => void
    deleteProduct: (id: number) => void
    getProductById: (id: number) => Product | undefined
    getProductsByCategory: (category: string) => Product[]
    getAllProducts: () => Product[] // دالة جديدة تجيب كل المنتجات (JSON + New)
    setUser: (user: any) => void
    fetchFromFirestore: () => Promise<void>
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: productsData,
            newProducts: [], // هنا هنحفظ المنتجات الجديدة
            featuredProducts: productsData.slice(0, 4),
            categories: categoriesData,
            services: siteData.services,
            brand: siteData.brand,
            selectedProduct: null,
            isLoading: false,

            setSelectedProduct: (product) => set({ selectedProduct: product }),

            addProduct: (product) => {
                const allProducts = get().getAllProducts()
                const newId = Math.max(...allProducts.map(p => p.id), 0) + 1
                const newProduct = { ...product, id: newId, sold: 0 }
                
                set((state) => ({
                    newProducts: [...state.newProducts, newProduct]
                }))
            },

            updateProduct: (id, updates) => {
                const { products, newProducts } = get()
                
                // check if it's from original products
                if (products.find(p => p.id === id)) {
                    set((state) => ({
                        products: state.products.map((p) =>
                            p.id === id ? { ...p, ...updates } : p
                        )
                    }))
                } else {
                    // it's from new products
                    set((state) => ({
                        newProducts: state.newProducts.map((p) =>
                            p.id === id ? { ...p, ...updates } : p
                        )
                    }))
                }
            },

            deleteProduct: (id) => {
                const { products, newProducts } = get()
                
                // check if it's from original products
                if (products.find(p => p.id === id)) {
                    set((state) => ({
                        products: state.products.filter((p) => p.id !== id)
                    }))
                } else {
                    // it's from new products
                    set((state) => ({
                        newProducts: state.newProducts.filter((p) => p.id !== id)
                    }))
                }
            },

            getProductById: (id) => {
                const allProducts = get().getAllProducts()
                return allProducts.find((p) => p.id === id)
            },

            getProductsByCategory: (category) => {
                const allProducts = get().getAllProducts()
                return allProducts.filter(
                    (p) => p.category.toLowerCase() === category.toLowerCase()
                )
            },

            getAllProducts: () => {
                const { products, newProducts } = get()
                return [...products, ...newProducts]
            },

            setUser: () => { },

            fetchFromFirestore: async () => { },
        }),
        {
            name: 'lumiere-products',
            partialize: (state) => ({
                // نحفظ بس المنتجات الجديدة، مش الـ original products
                newProducts: state.newProducts,
            }),
        }
    )
)