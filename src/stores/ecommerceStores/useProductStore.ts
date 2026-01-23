import { create } from 'zustand'
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
    featuredProducts: Product[]
    categories: Category[]
    services: any[]
    brand: any
    selectedProduct: Product | null
    isLoading: boolean
    setSelectedProduct: (product: Product | null) => void
    getProductById: (id: number) => Product | undefined
    getProductsByCategory: (category: string) => Product[]
    setUser: (user: any) => void
    fetchFromFirestore: () => Promise<void>
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: productsData,
    featuredProducts: productsData.slice(0, 4), // Only keep first 4 as featured
    categories: categoriesData,
    services: siteData.services,
    brand: siteData.brand,
    selectedProduct: null,
    isLoading: false,

    setSelectedProduct: (product) => set({ selectedProduct: product }),

    getProductById: (id) => get().products.find((p) => p.id === id),

    getProductsByCategory: (category) =>
        get().products.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
        ),

    setUser: () => { },

    fetchFromFirestore: async () => { },
}))
