// src/pages/dashboard/Categories.tsx
import { useEffect, useState } from "react"
import { Layers, Plus, Edit, Trash2, Loader2, Upload, X, ImageOff, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadToCloudinary } from "@/lib/cloudinary"
import {
  fetchCategoriesForDashboard,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryRow,
} from "@/lib/products"

type CategoryWithCount = CategoryRow & { productCount: number }

interface FormState {
  name: string
  description: string
  displayOrder: string
  isActive: boolean
}

const emptyForm: FormState = {
  name: "",
  description: "",
  displayOrder: "0",
  isActive: true,
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [existingImageUrl, setExistingImageUrl] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const data = await fetchCategoriesForDashboard()
      setCategories(data)
    } catch (error) {
      console.error("Failed to load categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openAddModal = () => {
    setEditingCategory(null)
    setForm({ ...emptyForm, displayOrder: String(categories.length) })
    setImageFile(null)
    setImagePreview("")
    setExistingImageUrl("")
    setIsModalOpen(true)
  }

  const openEditModal = (category: CategoryWithCount) => {
    setEditingCategory(category)
    setForm({
      name: category.name,
      description: category.description || "",
      displayOrder: String(category.display_order),
      isActive: category.is_active,
    })
    setImageFile(null)
    setImagePreview("")
    setExistingImageUrl(category.image_url || "")
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setExistingImageUrl("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error("Category name is required")
      return
    }

    setIsSaving(true)
    try {
      let imageUrl = existingImageUrl

      if (imageFile) {
        const uploaded = await uploadToCloudinary(imageFile)
        imageUrl = uploaded.secure_url
      }

      const input = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        imageUrl: imageUrl || undefined,
        displayOrder: Number(form.displayOrder) || 0,
        isActive: form.isActive,
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, input)
        toast.success("Category updated")
      } else {
        await createCategory(input)
        toast.success("Category created")
      }

      closeModal()
      await loadCategories()
    } catch (error: any) {
      console.error("Failed to save category:", error)
      toast.error(error.message || "Failed to save category")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (category: CategoryWithCount) => {
    const confirmMessage =
      category.productCount > 0
        ? `"${category.name}" has ${category.productCount} product(s) linked to it. Deleting it will NOT delete those products — they'll just become "Uncategorized" until you reassign them. Continue?`
        : `Are you sure you want to delete "${category.name}"?`

    if (!window.confirm(confirmMessage)) return

    setDeletingId(category.id)
    try {
      await deleteCategory(category.id)
      toast.success("Category deleted")
      await loadCategories()
    } catch (error: any) {
      console.error("Failed to delete category:", error)
      toast.error(error.message || "Failed to delete category")
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActive = async (category: CategoryWithCount) => {
    try {
      await updateCategory(category.id, { isActive: !category.is_active })
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, is_active: !c.is_active } : c))
      )
      toast.success(category.is_active ? "Category hidden from shop" : "Category now visible in shop")
    } catch (error) {
      toast.error("Failed to update category")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the categories customers browse by in the Shop page.
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Layers className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-foreground font-medium mb-1">No categories yet</p>
            <p className="text-sm text-muted-foreground mb-5">
              Add your first category so products can be organized in the Shop.
            </p>
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium w-14"></th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Products</th>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Visible</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-muted-foreground/40">
                      <GripVertical className="w-4 h-4" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                            <ImageOff className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground">{category.productCount}</td>
                    <td className="px-5 py-3 text-muted-foreground">{category.display_order}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(category)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          category.is_active ? "bg-primary" : "bg-muted-foreground/20"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            category.is_active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          aria-label={`Edit ${category.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          aria-label={`Delete ${category.name}`}
                        >
                          {deletingId === category.id ? (
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
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category Image</label>
                {imagePreview || existingImageUrl ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border">
                    <img
                      src={imagePreview || existingImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
                    <span className="text-xs text-muted-foreground">Click to upload image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Serums"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown on the category card (optional)"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Display order */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers show first in the category list.
                </p>
              </div>

              {/* Visible toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Visible in Shop</p>
                  <p className="text-xs text-muted-foreground">Hidden categories won't appear to customers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isActive ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isActive ? "translate-x-6" : "translate-x-1"
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
                  {editingCategory ? "Save Changes" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}