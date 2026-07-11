// src/pages/dashboard/Brands.tsx
import { useEffect, useState } from "react"
import { Award, Plus, Edit, Trash2, Loader2, Upload, X, ImageOff, Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadToCloudinary } from "@/lib/cloudinary"
import {
  fetchBrandsForDashboard,
  createBrand,
  updateBrand,
  deleteBrand,
  type BrandRow,
} from "@/lib/products"

type BrandWithCount = BrandRow & { productCount: number }

interface FormState {
  name: string
  description: string
  isFeatured: boolean
}

const emptyForm: FormState = {
  name: "",
  description: "",
  isFeatured: false,
}

export default function Brands() {
  const [brands, setBrands] = useState<BrandWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<BrandWithCount | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [existingLogoUrl, setExistingLogoUrl] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadBrands = async () => {
    setIsLoading(true)
    try {
      const data = await fetchBrandsForDashboard()
      setBrands(data)
    } catch (error) {
      console.error("Failed to load brands:", error)
      toast.error("Failed to load brands")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const openAddModal = () => {
    setEditingBrand(null)
    setForm(emptyForm)
    setLogoFile(null)
    setLogoPreview("")
    setExistingLogoUrl("")
    setIsModalOpen(true)
  }

  const openEditModal = (brand: BrandWithCount) => {
    setEditingBrand(brand)
    setForm({
      name: brand.name,
      description: brand.description || "",
      isFeatured: brand.is_featured,
    })
    setLogoFile(null)
    setLogoPreview("")
    setExistingLogoUrl(brand.logo_url || "")
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBrand(null)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview("")
    setExistingLogoUrl("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error("Brand name is required")
      return
    }

    setIsSaving(true)
    try {
      let logoUrl = existingLogoUrl

      if (logoFile) {
        const uploaded = await uploadToCloudinary(logoFile)
        logoUrl = uploaded.secure_url
      }

      const input = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        logoUrl: logoUrl || undefined,
        isFeatured: form.isFeatured,
      }

      if (editingBrand) {
        await updateBrand(editingBrand.id, input)
        toast.success("Brand updated")
      } else {
        await createBrand(input)
        toast.success("Brand created")
      }

      closeModal()
      await loadBrands()
    } catch (error: any) {
      console.error("Failed to save brand:", error)
      toast.error(error.message || "Failed to save brand")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (brand: BrandWithCount) => {
    const confirmMessage =
      brand.productCount > 0
        ? `"${brand.name}" has ${brand.productCount} product(s) linked to it. Deleting it will NOT delete those products — they'll just lose their brand until you reassign them. Continue?`
        : `Are you sure you want to delete "${brand.name}"?`

    if (!window.confirm(confirmMessage)) return

    setDeletingId(brand.id)
    try {
      await deleteBrand(brand.id)
      toast.success("Brand deleted")
      await loadBrands()
    } catch (error: any) {
      console.error("Failed to delete brand:", error)
      toast.error(error.message || "Failed to delete brand")
    } finally {
      setDeletingId(null)
    }
  }

  const toggleFeatured = async (brand: BrandWithCount) => {
    try {
      await updateBrand(brand.id, { isFeatured: !brand.is_featured })
      setBrands((prev) =>
        prev.map((b) => (b.id === brand.id ? { ...b, is_featured: !b.is_featured } : b))
      )
      toast.success(brand.is_featured ? "Removed from featured brands" : "Marked as featured brand")
    } catch (error) {
      toast.error("Failed to update brand")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Brands
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the brands your products are linked to. Every product must belong to a brand.
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Award className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-foreground font-medium mb-1">No brands yet</p>
            <p className="text-sm text-muted-foreground mb-5">
              Add your first brand so products can be linked to it.
            </p>
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Brand
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Brand</th>
                  <th className="px-5 py-3 font-medium">Products</th>
                  <th className="px-5 py-3 font-medium">Featured</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {brand.logo_url ? (
                          <img
                            src={brand.logo_url}
                            alt={brand.name}
                            className="w-10 h-10 rounded-lg object-cover border border-border bg-white"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                            <ImageOff className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{brand.name}</p>
                          <p className="text-xs text-muted-foreground">{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground">{brand.productCount}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleFeatured(brand)}
                        aria-label={brand.is_featured ? "Unmark as featured" : "Mark as featured"}
                        className="p-1"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            brand.is_featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          aria-label={`Edit ${brand.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand)}
                          disabled={deletingId === brand.id}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          aria-label={`Delete ${brand.name}`}
                        >
                          {deletingId === brand.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={closeModal}>
          <div
            className="bg-surface rounded-2xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">
                {editingBrand ? "Edit Brand" : "Add Brand"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Brand Logo</label>
                {logoPreview || existingLogoUrl ? (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border bg-white">
                    <img
                      src={logoPreview || existingLogoUrl}
                      alt="Preview"
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground text-center px-1">Upload logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  </label>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">Optional — brand still works without a logo.</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Luminous"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the brand (optional)"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Featured Brand</p>
                  <p className="text-xs text-muted-foreground">Highlighted brands can be shown prominently in the shop.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isFeatured ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isFeatured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="flex-1 gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBrand ? "Save Changes" : "Create Brand"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}