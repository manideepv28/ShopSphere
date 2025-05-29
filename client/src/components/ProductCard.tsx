import { Star, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id });
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const rating = parseFloat(product.rating);

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group product-card-hover cursor-pointer">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full shadow-sm"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4 text-slate-600 hover:text-red-500 transition-colors" />
          </Button>
          {discountPercent > 0 && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.featured && !discountPercent && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              FEATURED
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-slate-800 mb-2 line-clamp-2">{product.name}</h4>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : i < rating ? 'fill-current opacity-50' : ''}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 ml-2">({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-800">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            {isAuthenticated ? (
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="bg-primary hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            ) : (
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = "/login";
                }}
                className="bg-primary hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Sign In to Buy
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
