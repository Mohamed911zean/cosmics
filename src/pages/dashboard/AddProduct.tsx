import { useState } from "react"
import { Package, Upload, X, Loader2 } from "lucide-react"
import { useProductStore } from "@/stores/ecommerceStores/useProductStore"
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function AddProduct() {
  const { addProduct, categories } = useProductStore()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    price: "",
    category: "",
    description: "",
  })

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string>("")
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + additionalImages.length > 4) {
      toast.error("Maximum 4 additional images allowed")
      return
    }

    setAdditionalImages([...additionalImages, ...files])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setAdditionalPreviews([...additionalPreviews, ...newPreviews])
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
    setAdditionalPreviews(additionalPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mainImage) {
      toast.error("Please upload a main product image")
      return
    }

    if (!formData.brand || !formData.name || !formData.price || !formData.category) {
      toast.error("Please fill all required fields")
      return
    }

    setIsUploading(true)
    try {
      // Upload main image
      const mainImageUrl = await uploadToCloudinary(mainImage)

      // Upload additional images
      let additionalUrls: string[] = []
      if (additionalImages.length > 0) {
        const uploads = await uploadMultipleToCloudinary(additionalImages)
        additionalUrls = uploads.map(upload => upload.secure_url)
      }

      // Add product to store (await ensures Firestore write completes before navigating)
      await addProduct({
        name: `${formData.brand} - ${formData.name}`,
        price: parseFloat(formData.price),
        category: formData.category,
        image: mainImageUrl.secure_url,
        description: formData.description,
        images: additionalUrls.length > 0 ? additionalUrls : undefined,
        rating: 0,
        reviews: 0,
      })

      toast.success("Product added successfully!")
      navigate("/dashboard/products")
    } catch (error) {
      console.error(error)
      toast.error("Failed to add product. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success flex items-center justify-center shadow-lg shadow-emerald-200">
          <Package className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Brand & Product Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Brand Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="e.g. Luminous"
                required
              />
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

          {/* Price & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Price ($) <span className="text-primary">*</span>
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
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-success focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
              {mainImagePreview ? (
                <div className="flex items-center gap-4">
                  <img src={mainImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImage(null)
                      setMainImagePreview("")
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

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Additional Images (Optional, max 4)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {additionalPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`Additional ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {additionalImages.length < 4 && (
                <label className="border-2 border-dashed border-border rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-success transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
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
                Uploading...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}