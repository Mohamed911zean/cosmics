import { create } from 'zustand'

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

// Mock featured products data
const featuredProductsData: Product[] = [
    {
        id: 1,
        name: "Radiant Glow Serum",
        price: 89.0,
        category: "Skincare",
        image: "/luxury-serum-bottle-on-clean-background.jpg",
        description: "Our signature Radiant Glow Serum is a revolutionary formula designed to transform your skin's texture and radiance. Infused with pure botanical extracts and advanced vitamin complexes, it provides deep hydration while targeting fine lines and uneven skin tone.",
        rating: 4.9,
        reviews: 128,
        images: [
            "/face_cream_product_mockup_1766625009300.png",
            "/elegant_skincare_hero_1766623620773.png",
            "/eyeshadow_palette_product_mockup_1766625024551.png",
        ],
    },
    {
        id: 2,
        name: "Velvet Matte Lipstick",
        price: 42.0,
        category: "Makeup",
        image: "/elegant-matte-lipstick-on-soft-background.jpg",
        description: "A luxuriously smooth lipstick that delivers intense, long-lasting color with a sophisticated matte finish. The creamy formula glides on effortlessly and stays comfortable all day.",
        rating: 4.8,
        reviews: 96,
        images: [
            "/elegant-matte-lipstick-on-soft-background.jpg",
        ],
    },
    {
        id: 3,
        name: "Luminous Face Cream",
        price: 95.0,
        category: "Skincare",
        image: "/face_cream_product_mockup_1766625009300.png",
        description: "A rich, nourishing face cream that delivers intense moisture while improving skin elasticity and radiance. Perfect for all skin types.",
        rating: 4.7,
        reviews: 84,
        images: [
            "/face_cream_product_mockup_1766625009300.png",
        ],
    },
    {
        id: 4,
        name: "Natural Glow Palette",
        price: 78.0,
        category: "Makeup",
        image: "/eyeshadow_palette_product_mockup_1766625024551.png",
        description: "A curated collection of universally flattering shades designed to enhance your natural beauty. From subtle everyday looks to dramatic evening glam.",
        rating: 4.9,
        reviews: 156,
        images: [
            "/eyeshadow_palette_product_mockup_1766625024551.png",
        ],
    },
]

// Mock categories data
export interface Category {
    id: number
    name: string
    productCount: number
    image: string
}

const categoriesData: Category[] = [
    {
        id: 1,
        name: "Skincare",
        productCount: 48,
        image: "/luxury-skincare-products-minimal-aesthetic.jpg",
    },
    {
        id: 2,
        name: "Makeup",
        productCount: 72,
        image: "/elegant-makeup-products-on-clean-background.jpg",
    },
    {
        id: 3,
        name: "Fragrance",
        productCount: 24,
        image: "/premium-perfume-bottles-sophisticated.jpg",
    },
]

interface ProductState {
    products: Product[]
    featuredProducts: Product[]
    categories: Category[]
    selectedProduct: Product | null
    isLoading: boolean
    setSelectedProduct: (product: Product | null) => void
    getProductById: (id: number) => Product | undefined
    getProductsByCategory: (category: string) => Product[]
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: featuredProductsData,
    featuredProducts: featuredProductsData,
    categories: categoriesData,
    selectedProduct: null,
    isLoading: false,

    setSelectedProduct: (product) => set({ selectedProduct: product }),

    getProductById: (id) => get().products.find((p) => p.id === id),

    getProductsByCategory: (category) =>
        get().products.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
        ),
}))
