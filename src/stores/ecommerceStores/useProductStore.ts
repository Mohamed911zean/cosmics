import { create } from 'zustand'
import siteData from '@/data/data.json'
import {
  createProduct,
  deleteProduct as deleteProductRow,
  fetchCategories as fetchCatalogCategories,
  fetchProductById as fetchCatalogProductById,
  fetchProducts as fetchCatalogProducts,
  updateProduct as updateProductRow,
  updateProductStock,
  type CatalogProduct,
  type Category,
  type FetchProductsFilters,
  type UpsertProductInput,
} from '@/lib/products'

export type Product = CatalogProduct
export type { Category }

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

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  categories: Category[]
  services: Service[]
  brand: Brand
  selectedProduct: Product | null
  isLoading: boolean
  error: string | null
  totalCount: number
  lastFilters: FetchProductsFilters

  setSelectedProduct: (product: Product | null) => void
  fetchProducts: (filters?: FetchProductsFilters) => Promise<void>
  refreshProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchProductById: (id: string) => Promise<Product | null>
  addProduct: (product: UpsertProductInput) => Promise<Product>
  updateProduct: (id: string, product: Partial<UpsertProductInput>) => Promise<Product>
  updateStock: (id: string, stockQuantity: number) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  getAllProducts: () => Product[]
  setUser: (user: unknown) => void
}

function selectFeatured(products: Product[]) {
  const featured = products.filter((product) => product.isFeatured)
  return (featured.length ? featured : products).slice(0, 4)
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  services: siteData.services as Service[],
  brand: siteData.brand as Brand,
  selectedProduct: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  lastFilters: { page: 1, pageSize: 24 },

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  fetchProducts: async (filters = {}) => {
    const mergedFilters = { page: 1, pageSize: 24, ...filters }
    set({ isLoading: true, error: null, lastFilters: mergedFilters })
    try {
      const { products, total } = await fetchCatalogProducts(mergedFilters)
      set({
        products,
        featuredProducts: selectFeatured(products),
        totalCount: total,
        isLoading: false,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load products'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  refreshProducts: async () => {
    await get().fetchProducts(get().lastFilters)
  },

  fetchCategories: async () => {
    const categories = await fetchCatalogCategories()
    set({ categories })
  },

  fetchProductById: async (id) => {
    const existing = get().getProductById(id)
    if (existing) return existing

    const product = await fetchCatalogProductById(id)
    if (product) {
      set((state) => {
        const products = state.products.some((item) => item.id === product.id)
          ? state.products.map((item) => (item.id === product.id ? product : item))
          : [product, ...state.products]
        return {
          products,
          featuredProducts: selectFeatured(products),
          selectedProduct: product,
        }
      })
    }
    return product
  },

  addProduct: async (product) => {
    const created = await createProduct(product)
    await get().refreshProducts()
    return created
  },

  updateProduct: async (id, product) => {
    const updated = await updateProductRow(id, product)
    set((state) => {
      const products = state.products.map((item) => (item.id === id ? updated : item))
      return {
        products,
        featuredProducts: selectFeatured(products),
        selectedProduct: state.selectedProduct?.id === id ? updated : state.selectedProduct,
      }
    })
    return updated
  },

  updateStock: async (id, stockQuantity) => {
    await updateProductStock(id, stockQuantity)
    set((state) => {
      const products = state.products.map((item) =>
        item.id === id
          ? { ...item, stock_quantity: stockQuantity, stock: stockQuantity }
          : item,
      )
      return {
        products,
        featuredProducts: selectFeatured(products),
      }
    })
  },

  deleteProduct: async (id) => {
    await deleteProductRow(id)
    set((state) => {
      const products = state.products.filter((item) => item.id !== id)
      return {
        products,
        featuredProducts: selectFeatured(products),
        selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
      }
    })
  },

  getProductById: (id) => get().products.find((product) => product.id === id),

  getProductsByCategory: (category) =>
    get().products.filter((product) => product.category.toLowerCase() === category.toLowerCase()),

  getAllProducts: () => get().products,

  setUser: () => {},
}))
