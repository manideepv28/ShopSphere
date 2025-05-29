import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image || ''}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleAddToCart}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs capitalize">
            {product.category}
          </Badge>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center pt-2">
            <span className="text-2xl font-bold text-primary">
              ${product.price}
            </span>
            <Button onClick={handleAddToCart} size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
