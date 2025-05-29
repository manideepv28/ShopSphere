import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@shared/schema";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Check, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = parseInt(params?.id || '0');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    enabled: !!productId,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to make a purchase.",
        variant: "destructive",
      });
      return;
    }
    
    handleAddToCart();
    // Navigate to checkout would be handled by the router
    window.location.href = '/checkout';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-xl" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded" />
              <div className="bg-gray-200 h-4 rounded w-3/4" />
              <div className="bg-gray-200 h-6 rounded w-1/2" />
              <div className="bg-gray-200 h-20 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image || ''}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2 capitalize">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(128 reviews)</span>
                </div>
                <div className="text-4xl font-bold text-primary mb-4">
                  ${product.price}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>

              <Separator />

              {/* Product Features */}
              <div>
                <h3 className="font-semibold mb-3">Product Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Premium Quality Materials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Free Shipping on Orders Over $50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm">1 Year Warranty</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="h-4 w-4 text-green-500" />
                    <span className="text-sm">30-Day Return Policy</span>
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-600 font-medium">
                  In Stock ({product.inStock} available)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
