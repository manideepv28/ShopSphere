import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/lib/types";

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Product not found");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-slate-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
            <p className="text-slate-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ productId: product.id });
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const rating = parseFloat(product.rating);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-slate-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-sm"
            />
            {discountPercent > 0 && (
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.featured && !discountPercent && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                FEATURED
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-current' : i < rating ? 'fill-current opacity-50' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-slate-800">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div>
              <p className="text-sm text-slate-600">
                Stock: <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <Button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              ) : (
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-blue-700 text-white">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Sign In to Buy
                  </Button>
                </Link>
              )}
              
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
