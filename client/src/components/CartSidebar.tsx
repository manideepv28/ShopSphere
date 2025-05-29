import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, isUpdatingQuantity, isRemovingFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isOpen || !isAuthenticated) return null;

  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + tax;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Shopping Cart</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">Your cart is empty</p>
                <Button onClick={onClose} className="mt-4">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{item.product.name}</h4>
                      <p className="text-sm text-slate-500">${item.product.price}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                            disabled={isUpdatingQuantity || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity({ id: item.id, quantity: item.quantity + 1 })}
                            disabled={isUpdatingQuantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold text-slate-800">
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isRemovingFromCart}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary and Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 p-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping:</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax:</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link href="/checkout">
                <Button 
                  className="w-full bg-primary hover:bg-blue-700 text-white font-semibold mb-3" 
                  onClick={onClose}
                >
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
