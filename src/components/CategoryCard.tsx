import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  image: string
  productCount: number
}

export function CategoryCard({ name, image, productCount }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover-lift">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">{name}</h3>
            <p className="text-sm text-white/90">{productCount} Products</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
