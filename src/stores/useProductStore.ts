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
            "/products/serum-1.jpg",
            "/products/serum-2.jpg",
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
    // New Products
    {
        id: 5,
        name: "Hydrating Rose Water Toner",
        price: 35.0,
        category: "Skincare",
        image: "/elegant_skincare_hero_1766623620773.png",
        description: "A refreshing toner infused with organic rose water to balance pH and hydrate tired skin.",
        rating: 4.6,
        reviews: 78,
        images: ["/elegant_skincare_hero_1766623620773.png"],
    },
    {
        id: 6,
        name: "Midnight Recovery Oil",
        price: 105.0,
        category: "Skincare",
        image: "/luxury-serum-bottle-on-clean-background.jpg",
        description: "An overnight facial oil that restores moisture and repairs skin barrier while you sleep.",
        rating: 4.9,
        reviews: 203,
        images: ["/luxury-serum-bottle-on-clean-background.jpg"],
    },
    {
        id: 7,
        name: "Silky Foundation SPF 30",
        price: 55.0,
        category: "Makeup",
        image: "/face_cream_product_mockup_1766625009300.png",
        description: "A lightweight foundation with buildable coverage and SPF 30 protection for a flawless, natural finish.",
        rating: 4.4,
        reviews: 142,
        images: ["/face_cream_product_mockup_1766625009300.png"],
    },
    {
        id: 8,
        name: "Volumizing Mascara",
        price: 28.0,
        category: "Makeup",
        image: "/eyeshadow_palette_product_mockup_1766625024551.png",
        description: "Intense black mascara that delivers instant volume and length without clumping.",
        rating: 4.7,
        reviews: 310,
        images: ["/eyeshadow_palette_product_mockup_1766625024551.png"],
    },
    {
        id: 9,
        name: "Jasmine & Oud Perfume",
        price: 120.0,
        category: "Fragrance",
        image: "/luxury-serum-bottle-on-clean-background.jpg",
        description: "An exotic blend of jasmine and rich oud wood, creating a scent that is both floral and woody.",
        rating: 4.8,
        reviews: 65,
        images: ["/luxury-serum-bottle-on-clean-background.jpg"],
    },
    {
        id: 10,
        name: "Vanilla Silk Body Lotion",
        price: 45.0,
        category: "Skincare",
        image: "/face_cream_product_mockup_1766625009300.png",
        description: "Wrap your body in the luxurious scent of warm vanilla with this ultra-hydrating lotion.",
        rating: 4.5,
        reviews: 112,
        images: ["/face_cream_product_mockup_1766625009300.png"],
    },
    {
        id: 11,
        name: "Brow Definer Pencil",
        price: 24.0,
        category: "Makeup",
        image: "/elegant-matte-lipstick-on-soft-background.jpg",
        description: "Precise brow pencil for defining and filling brows with natural-looking hair strokes.",
        rating: 4.3,
        reviews: 89,
        images: ["/elegant-matte-lipstick-on-soft-background.jpg"],
    },
    {
        id: 12,
        name: "Citrus Verbena Eau de Toilette",
        price: 85.0,
        category: "Fragrance",
        image: "/elegant_skincare_hero_1766623620773.png",
        description: "A sparkling and refreshing fragrance with notes of lemon, verbena, and cedarwood.",
        rating: 4.7,
        reviews: 54,
        images: ["/elegant_skincare_hero_1766623620773.png"],
    },
    {
        id: 13,
        name: "Exfoliating Coffee Scrub",
        price: 32.0,
        category: "Skincare",
        image: "/face_cream_product_mockup_1766625009300.png",
        description: "Invigorating coffee scrub to exfoliate dead skin cells and reveal smooth, glowing skin.",
        rating: 4.6,
        reviews: 156,
        images: ["/face_cream_product_mockup_1766625009300.png"],
    },
    {
        id: 14,
        name: "Liquid Eyeliner Pen",
        price: 22.0,
        category: "Makeup",
        image: "/elegant-matte-lipstick-on-soft-background.jpg",
        description: "Waterproof liquid eyeliner with a fine tip for precise cat-eyes and definition.",
        rating: 4.5,
        reviews: 201,
        images: ["/elegant-matte-lipstick-on-soft-background.jpg"],
    },
    {
        id: 15,
        name: "Rose Quartz Roller",
        price: 25.0,
        category: "Skincare",
        image: "/products/roller-1.jpg",
        description: "Genuine rose quartz facial roller to reduce puffiness and promote circulation.",
        rating: 4.8,
        reviews: 320,
        images: ["/elegant_skincare_hero_1766623620773.png"],
    },
    {
        id: 16,
        name: "Sandalwood Candle",
        price: 38.0,
        category: "Fragrance",
        image: "/luxury-serum-bottle-on-clean-background.jpg",
        description: "Hand-poured soy candle with the calming warmth of sandalwood and amber.",
        rating: 4.9,
        reviews: 45,
        images: ["/luxury-serum-bottle-on-clean-background.jpg"],
    }
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
        productCount: 7,
        image: "/luxury-skincare-products-minimal-aesthetic.jpg",
    },
    {
        id: 2,
        name: "Makeup",
        productCount: 6,
        image: "/elegant-makeup-products-on-clean-background.jpg",
    },
    {
        id: 3,
        name: "Fragrance",
        productCount: 3,
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
    featuredProducts: featuredProductsData.slice(0, 4), // Only keep first 4 as featured
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
