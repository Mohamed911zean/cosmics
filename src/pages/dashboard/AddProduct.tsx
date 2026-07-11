import { useState, useEffect } from "react"
import { Package, Upload, X, Loader2 } from "lucide-react"
import { useProductStore } from "@/stores/ecommerceStores/useProductStore"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { toast } from "sonner"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  createProduct,
  updateProduct,
  fetchProductById,
  fetchBrandsForDropdown,
  type UpsertProductInput,
  type ProductStatus,
  type BrandRow,
} from "@/lib/products"

export default function AddProduct() {
  const { categories, fetchCategories } = useProductStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get("id")
  const isEditMode = !!productId

  const [formData, setFormData] = useState({
    brandId: "",
    name: "",
    price: "",
    categoryId: "",
    description: "",
    stockQuantity: "10",
    lowStockThreshold: "5",
  })

  const [brands, setBrands] = useState<BrandRow[]>([])
  const [isLoadingBrands, setIsLoadingBrands] = useState(true)
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>("")
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  // Load categories from Supabase on mount. Without this, the dropdown
  // below is permanently empty because the store starts with categories: []
  // and nothing else on this page ever populates it.
  useEffect(() => {
    setIsLoadingCategories(true)
    fetchCategories()
      .catch((error) => {
        console.error("Failed to load categories:", error)
        toast.error("Failed to load categories")
      })
      .finally(() => setIsLoadingCategories(false))
  }, [fetchCategories])

  // Load brands from Supabase on mount. Every product must be linked to a
  // real brand row now (brand_id), not a free-text name.
  useEffect(() => {
    setIsLoadingBrands(true)
    fetchBrandsForDropdown()
      .then(setBrands)
      .catch((error) => {
        console.error("Failed to load brands:", error)
        toast.error("Failed to load brands")
      })
      .finally(() => setIsLoadingBrands(false))
  }, [])

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      setIsLoadingProduct(true)
      const loadProduct = async () => {
        try {
          const product = await fetchProductById(productId)
          if (product) {
            setFormData({
              brandId: product.brandId || "",
              name: product.name,
              price: product.price.toString(),
              categoryId: product.categoryId || "",
              description: product.description || "",
              stockQuantity: product.stock_quantity.toString(),
              lowStockThreshold: product.low_stock_threshold.toString(),
            })
            setExistingMainImageUrl(product.image)
          }
        } catch (error) {
          console.error("Failed to load product:", error)
          toast.error("Failed to load product data")
        } finally {
          setIsLoadingProduct(false)
        }
      }
      loadProduct()
    }
  }, [isEditMode, productId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
      setExistingMainImageUrl("") // Clear existing if user selects a new one
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If no new main image selected and no existing one, show error
    if (!mainImage && !existingMainImageUrl) {
      toast.error("Please upload a main product image")
      return
    }

    if (!formData.brandId || !formData.name || !formData.price || !formData.categoryId) {
      toast.error("Please fill all required fields")
      return
    }

    setIsUploading(true)
    try {
      let mainImageUrl = existingMainImageUrl

      // Upload main image if a new one was selected
      if (mainImage) {
        const uploaded = await uploadToCloudinary(mainImage)
        mainImageUrl = uploaded.secure_url
      }

      const productData: UpsertProductInput = {
        name: formData.name,
        brandId: formData.brandId,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        description: formData.description,
        imageUrls: [mainImageUrl],
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        status: "active" as ProductStatus,
        isFeatured: false,
        isNew: true,
      }

      if (isEditMode && productId) {
        await updateProduct(productId, productData)
        toast.success("Product updated successfully!")
      } else {
        await createProduct(productData)
        toast.success("Product added successfully!")
      }

      navigate("/dashboard/products")
    } catch (error) {
      console.error(error)
      toast.error(`Failed to ${isEditMode ? "update" : "add"} product. Please try again.`)
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading product data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success flex items-center justify-center shadow-lg shadow-emerald-200">
          <Package className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-sm text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Brand & Product Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Brand <span className="text-primary">*</span>
              </label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all disabled:opacity-50"
                disabled={isLoadingBrands}
                required
              >
                <option value="">
                  {isLoadingBrands ? "Loading brands..." : "Select Brand"}
                </option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {!isLoadingBrands && brands.length === 0 && (
                <p className="text-xs text-destructive mt-1.5">
                  No brands found. Add one from Dashboard → Brands first.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Product Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="e.g. Glow Serum"
                required
              />
            </div>
          </div>

          {/* Price, Category, Stock, Low Stock Threshold */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Price (EGP) <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Category <span className="text-primary">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all disabled:opacity-50"
                disabled={isLoadingCategories}
                required
              >
                <option value="">
                  {isLoadingCategories ? "Loading categories..." : "Select Category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {!isLoadingCategories && categories.length === 0 && (
                <p className="text-xs text-destructive mt-1.5">
                  No categories found. Add one from Dashboard → Categories first.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Stock Quantity <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="5"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
              placeholder="Product description..."
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Main Product Image <span className="text-primary">*</span>
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-success transition-colors">
              {mainImagePreview || existingMainImageUrl ? (
                <div className="flex items-center gap-4">
                  <img src={mainImagePreview || existingMainImageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImage(null)
                      setMainImagePreview("")
                      setExistingMainImageUrl("")
                    }}
                    className="text-primary hover:text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload main image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-soft border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="px-6 py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-success to-success text-primary-foreground font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditMode ? "Updating..." : "Uploading..."}
              </>
            ) : (
              isEditMode ? "Update Product" : "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}