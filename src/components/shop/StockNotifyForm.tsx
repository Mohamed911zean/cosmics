import { useState } from 'react'
import { toast } from 'sonner'
import { createStockNotifyRequest } from '@/lib/restock'
import { useAuthStore } from '@/stores/useAuthStore'

interface StockNotifyFormProps {
  productId: string
  compact?: boolean
  className?: string
}

export function StockNotifyForm({ productId, compact = false, className = '' }: StockNotifyFormProps) {
  const user = useAuthStore((state) => state.user)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = whatsappNumber.trim()

    if (trimmed.length < 8) {
      toast.error('Please enter a valid WhatsApp number')
      return
    }

    setIsSubmitting(true)
    try {
      await createStockNotifyRequest(productId, trimmed, user?.id || null)
      setSubmitted(true)
      setWhatsappNumber('')
      toast.success("We'll reach out on WhatsApp when it's back")
    } catch (error) {
      console.error(error)
      toast.error('Could not save your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <p className={`text-xs font-medium text-[#3b2a60] ${className}`}>
        We'll reach out on WhatsApp when it's back.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex ${compact ? 'flex-col' : 'flex-col sm:flex-row'} gap-2 ${className}`}>
      <input
        type="tel"
        value={whatsappNumber}
        onChange={(event) => setWhatsappNumber(event.target.value)}
        placeholder="WhatsApp number"
        className="min-w-0 flex-1 rounded-full border border-[#3b2a60]/15 bg-white px-3 py-2 text-xs text-[#231933] placeholder:text-[#3b2a60]/35 outline-none focus:border-[#3b2a60]/45"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-[#3b2a60] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4a3777] disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : 'Notify Me'}
      </button>
    </form>
  )
}
