import { supabase } from '@/lib/supabase'

export type ProductStatus = 'draft' | 'active' | 'archived'

export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'newest'
  | 'best-selling'
  | 'rating'

export interface ProductImageRow {
  id: string
  url: string
  alt_text: string | null
  display_order: number
  is_primary: boolean
}

export interface ProductCategoryRow {
  id: string
  name: string
  slug: string
  image_url?: string | null
}

export interface ProductBrandRow {
  id: string
  name: string
  slug: string
  logo_url?: string | null
}

export interface ProductRow {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  brand_id: string | null
  price: number | string
  original_price: number | string | null
  currency: string
  sku: string | null
  stock_quantity: number
  low_stock_threshold: number
  status: ProductStatus
  is_new: boolean
  is_featured: boolean
  rating_average: number | string
  rating_count: number
  sales_count: number
  ingredients: string | null
  how_to_use: string | null
  volume_size: string | null
  skin_type: string[] | null
  concerns: string[] | null
  created_at: string
  updated_at: string
  categories?: ProductCategoryRow | null
  brands?: ProductBrandRow | null
  product_images?: ProductImageRow[] | null
}

export interface CatalogProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  category: string
  categoryId?: string
  brand?: string
  brandId?: string
  image: string
  description?: string
  shortDescription?: string
  rating: number
  reviews: number
  images: string[]
  sold: number
  sales: number
  stock_quantity: number
  low_stock_threshold: number
  stock: number
  status: ProductStatus
  isNew: boolean
  isFeatured: boolean
  createdAt: number
  sku?: string
  currency: string
}

export interface Category {
  id: string
  name: string
  slug: string
  productCount: number
  image: string
}

export interface FetchProductsFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: SortOption
  page?: number
  pageSize?: number
  includeInactive?: boolean
}

export interface FetchProductsResult {
  products: CatalogProduct[]
  total: number
}

const PRODUCT_SELECT = `
  *,
  categories(id,name,slug,image_url),
  brands(id,name,slug,logo_url),
  product_images(id,url,alt_text,display_order,is_primary)
`

const categoryFilterSelect = `
  *,
  categories!inner(id,name,slug,image_url),
  brands(id,name,slug,logo_url),
  product_images(id,url,alt_text,display_order,is_primary)
`

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return 0
  return typeof value === 'number' ? value : Number(value)
}

export function mapProduct(row: ProductRow): CatalogProduct {
  const orderedImages = [...(row.product_images || [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1
    return a.display_order - b.display_order
  })
  const imageUrls = orderedImages.map((image) => image.url)
  const createdAt = row.created_at ? new Date(row.created_at).getTime() : 0

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: toNumber(row.price),
    originalPrice: row.original_price ? toNumber(row.original_price) : undefined,
    category: row.categories?.name || 'Uncategorized',
    categoryId: row.category_id || undefined,
    brand: row.brands?.name,
    brandId: row.brand_id || undefined,
    image: imageUrls[0] || '',
    description: row.description || undefined,
    shortDescription: row.short_description || undefined,
    rating: toNumber(row.rating_average),
    reviews: row.rating_count,
    images: imageUrls,
    sold: row.sales_count,
    sales: row.sales_count,
    stock_quantity: row.stock_quantity,
    low_stock_threshold: row.low_stock_threshold,
    stock: row.stock_quantity,
    status: row.status,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    createdAt,
    sku: row.sku || undefined,
    currency: row.currency,
  }
}

export async function fetchProducts(filters: FetchProductsFilters = {}): Promise<FetchProductsResult> {
  const page = filters.page || 1
  const pageSize = filters.pageSize || 24
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const hasCategory = Boolean(filters.category && filters.category !== 'All')

  let query = supabase
    .from('products')
    .select(hasCategory ? categoryFilterSelect : PRODUCT_SELECT, { count: 'exact' })

  if (!filters.includeInactive) {
    query = query.eq('status', 'active')
  }

  if (filters.search?.trim()) {
    const search = filters.search.trim().replace(/[%_]/g, '')
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`)
  }

  if (hasCategory && filters.category) {
    query = query.eq('categories.name', filters.category)
  }

  if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice)

  switch (filters.sort) {
    case 'price-low':
      query = query.order('price', { ascending: true })
      break
    case 'price-high':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'best-selling':
      query = query.order('sales_count', { ascending: false })
      break
    case 'rating':
      query = query.order('rating_average', { ascending: false })
      break
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      break
  }

  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  return {
    products: ((data || []) as ProductRow[]).map(mapProduct),
    total: count || 0,
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id,name,slug,image_url')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error

  return (data || []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    productCount: 0,
    image: category.image_url || '',
  }))
}

export async function fetchProductById(id: string): Promise<CatalogProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapProduct(data as ProductRow) : null
}

export async function fetchProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ? mapProduct(data as ProductRow) : null
}

async function ensureBrand(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return null

  const slug = slugify(trimmed)
  const { data: existing, error: lookupError } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (lookupError) throw lookupError
  if (existing) return existing.id as string

  const { data, error } = await supabase
    .from('brands')
    .insert({ name: trimmed, slug })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

export interface UpsertProductInput {
  name: string
  brandName?: string
  categoryId?: string
  description?: string
  price: number
  stockQuantity: number
  lowStockThreshold: number
  imageUrls?: string[]
  status?: ProductStatus
  isFeatured?: boolean
  isNew?: boolean
}

export async function createProduct(input: UpsertProductInput): Promise<CatalogProduct> {
  const brandId = input.brandName ? await ensureBrand(input.brandName) : null
  const slug = `${slugify(input.name)}-${Date.now()}`

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      slug,
      description: input.description || null,
      category_id: input.categoryId || null,
      brand_id: brandId,
      price: input.price,
      stock_quantity: input.stockQuantity,
      low_stock_threshold: input.lowStockThreshold,
      status: input.status || 'active',
      is_featured: Boolean(input.isFeatured),
      is_new: input.isNew ?? true,
    })
    .select('id')
    .single()

  if (error) throw error

  if (input.imageUrls?.length) {
    const { error: imageError } = await supabase.from('product_images').insert(
      input.imageUrls.map((url, index) => ({
        product_id: data.id,
        url,
        alt_text: input.name,
        display_order: index,
        is_primary: index === 0,
      })),
    )
    if (imageError) throw imageError
  }

  const product = await fetchProductById(data.id)
  if (!product) throw new Error('Product was created but could not be loaded')
  return product
}

export async function updateProduct(id: string, input: Partial<UpsertProductInput>): Promise<CatalogProduct> {
  const brandId = input.brandName !== undefined ? await ensureBrand(input.brandName) : undefined
  const updates: Record<string, unknown> = {}

  if (input.name !== undefined) updates.name = input.name
  if (input.description !== undefined) updates.description = input.description || null
  if (input.categoryId !== undefined) updates.category_id = input.categoryId || null
  if (brandId !== undefined) updates.brand_id = brandId
  if (input.price !== undefined) updates.price = input.price
  if (input.stockQuantity !== undefined) updates.stock_quantity = input.stockQuantity
  if (input.lowStockThreshold !== undefined) updates.low_stock_threshold = input.lowStockThreshold
  if (input.status !== undefined) updates.status = input.status
  if (input.isFeatured !== undefined) updates.is_featured = input.isFeatured
  if (input.isNew !== undefined) updates.is_new = input.isNew

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from('products').update(updates).eq('id', id)
    if (error) throw error
  }

  if (input.imageUrls !== undefined) {
    const { error: deleteError } = await supabase.from('product_images').delete().eq('product_id', id)
    if (deleteError) throw deleteError

    if (input.imageUrls.length) {
      const { error: imageError } = await supabase.from('product_images').insert(
        input.imageUrls.map((url, index) => ({
          product_id: id,
          url,
          alt_text: input.name || null,
          display_order: index,
          is_primary: index === 0,
        })),
      )
      if (imageError) throw imageError
    }
  }

  const product = await fetchProductById(id)
  if (!product) throw new Error('Product was updated but could not be loaded')
  return product
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function updateProductStock(id: string, stockQuantity: number) {
  const { error } = await supabase
    .from('products')
    .update({ stock_quantity: stockQuantity })
    .eq('id', id)

  if (error) throw error
}
