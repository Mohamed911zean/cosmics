// src/stores/useDashboardCacheStore.ts
//
// FIX for: "every time I click a different sidebar link (Categories, Brands,
// Analytics, Add Product edit-mode), the page shows a full loading spinner
// again, even if I was just on that exact page a minute ago."
//
// ROOT CAUSE: Categories.tsx, Brands.tsx, Analytics.tsx, and the edit-mode
// loader in AddProduct.tsx each fetch their own data fresh inside a
// useEffect(() => { ... }, []) that runs on every mount. Since React Router
// unmounts a page component when you navigate away and mounts a brand new
// instance when you navigate back, EVERY navigation to these pages re-runs
// the fetch and re-shows the loading spinner from scratch — even if nothing
// on the server has changed since your last visit seconds ago.
//
// This is different from the earlier "TOKEN_REFRESHED causes a fake reload"
// bug (already fixed in useAuthStore.ts) — that one was a FALSE remount of
// the whole app. This one is real remounting of individual pages, which is
// normal React Router behavior; the fix is to stop re-fetching data that
// hasn't gone stale, the same way Products.tsx/Orders.tsx/Customers.tsx
// already don't flash, because they read from useProductStore/useOrderStore
// which persist in memory across navigations.
//
// THIS STORE gives Categories, Brands, and Analytics the same treatment:
// a shared, in-memory cache that survives across page navigations (as long
// as the user doesn't fully reload the browser tab). Each page checks the
// cache first; if data is already there and still "fresh" (< CACHE_TTL_MS
// old), it renders immediately with no spinner. If it's missing or stale,
// it fetches once and stores the result here for next time.

import { create } from 'zustand'
import {
  fetchCategoriesForDashboard,
  fetchBrandsForDashboard,
  type CategoryRow,
  type BrandRow,
} from '@/lib/products'
import {
  fetchRevenueSummary,
  fetchProductPerformance,
  fetchStockHealth,
  fetchCategoryPerformance,
  fetchCustomerSummary,
  fetchDemandSignals,
  type RevenueSummary,
  type ProductPerformanceRow,
  type StockHealth,
  type CategoryPerformance,
  type CustomerSummary,
  type DemandSignal,
} from '@/lib/analytics'

// How long cached data is considered "fresh" before a background refetch
// happens on next visit. 60s is a reasonable balance for an admin dashboard:
// short enough that stock/order changes show up quickly, long enough that
// clicking between sidebar tabs during one session feels instant.
const CACHE_TTL_MS = 60_000

type CategoryWithCount = CategoryRow & { productCount: number }
type BrandWithCount = BrandRow & { productCount: number }

interface AnalyticsData {
  revenue: RevenueSummary
  products: ProductPerformanceRow[]
  stockHealth: StockHealth
  categories: CategoryPerformance[]
  customers: CustomerSummary
  demand: DemandSignal[]
}

interface DashboardCacheState {
  // Categories
  categories: CategoryWithCount[] | null
  categoriesFetchedAt: number | null
  categoriesLoading: boolean

  // Brands
  brands: BrandWithCount[] | null
  brandsFetchedAt: number | null
  brandsLoading: boolean

  // Analytics
  analytics: AnalyticsData | null
  analyticsFetchedAt: number | null
  analyticsLoading: boolean

  // Actions — each returns a promise so callers can await if needed, but
  // none of them re-fetch if the cache is still fresh, so calling this on
  // every page mount is exactly the intended usage.
  loadCategories: (force?: boolean) => Promise<void>
  loadBrands: (force?: boolean) => Promise<void>
  loadAnalytics: (force?: boolean) => Promise<void>

  // Call these right after a create/update/delete so the NEXT visit to that
  // page (or this one, if you stay) shows the change immediately instead of
  // waiting up to 60s for the cache to naturally go stale.
  invalidateCategories: () => void
  invalidateBrands: () => void
  invalidateAnalytics: () => void
}

function isFresh(fetchedAt: number | null): boolean {
  if (fetchedAt === null) return false
  return Date.now() - fetchedAt < CACHE_TTL_MS
}

export const useDashboardCacheStore = create<DashboardCacheState>((set, get) => ({
  categories: null,
  categoriesFetchedAt: null,
  categoriesLoading: false,

  brands: null,
  brandsFetchedAt: null,
  brandsLoading: false,

  analytics: null,
  analyticsFetchedAt: null,
  analyticsLoading: false,

  loadCategories: async (force = false) => {
    const state = get()
    if (!force && isFresh(state.categoriesFetchedAt)) return // cache hit, no spinner
    if (state.categoriesLoading) return // already in flight, don't duplicate

    set({ categoriesLoading: true })
    try {
      const data = await fetchCategoriesForDashboard()
      set({ categories: data, categoriesFetchedAt: Date.now(), categoriesLoading: false })
    } catch (error) {
      set({ categoriesLoading: false })
      throw error
    }
  },

  loadBrands: async (force = false) => {
    const state = get()
    if (!force && isFresh(state.brandsFetchedAt)) return
    if (state.brandsLoading) return

    set({ brandsLoading: true })
    try {
      const data = await fetchBrandsForDashboard()
      set({ brands: data, brandsFetchedAt: Date.now(), brandsLoading: false })
    } catch (error) {
      set({ brandsLoading: false })
      throw error
    }
  },

  loadAnalytics: async (force = false) => {
    const state = get()
    if (!force && isFresh(state.analyticsFetchedAt)) return
    if (state.analyticsLoading) return

    set({ analyticsLoading: true })
    try {
      const [revenue, products, stockHealth, categories, customers, demand] = await Promise.all([
        fetchRevenueSummary(),
        fetchProductPerformance(),
        fetchStockHealth(),
        fetchCategoryPerformance(),
        fetchCustomerSummary(),
        fetchDemandSignals(),
      ])
      set({
        analytics: { revenue, products, stockHealth, categories, customers, demand },
        analyticsFetchedAt: Date.now(),
        analyticsLoading: false,
      })
    } catch (error) {
      set({ analyticsLoading: false })
      throw error
    }
  },

  invalidateCategories: () => set({ categoriesFetchedAt: null }),
  invalidateBrands: () => set({ brandsFetchedAt: null }),
  invalidateAnalytics: () => set({ analyticsFetchedAt: null }),
}))