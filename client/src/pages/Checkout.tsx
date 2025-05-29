import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header from "@/components/Header";
import CheckoutForm from "@/components/CheckoutForm";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import MockCheckoutForm from "@/components/MockCheckoutForm";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();
  const { cartItems, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (cartItems.length === 0) {
      setLocation("/");
      return;
    }

    // Create payment intent only if Stripe is configured
    if (stripePromise) {
      const createPaymentIntent = async () => {
        try {
          const tax = cartTotal * 0.08;
          const total = cartTotal + tax;
          
          const response = await apiRequest("POST", "/api/create-payment-intent", {
            amount: total,
            currency: "usd",
          });
          
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Error creating payment intent:", error);
          // Fall back to mock checkout
          setClientSecret("mock");
        }
      };

      createPaymentIntent();
    } else {
      // Use mock checkout when Stripe is not configured
      setClientSecret("mock");
    }
  }, [cartItems, cartTotal, isAuthenticated, setLocation]);

  const handleSuccess = () => {
    setLocation("/orders");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Your cart is empty</h1>
            <p className="text-slate-600">Add some items to your cart before checking out.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-600">Setting up checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            {clientSecret === "mock" ? (
              <MockCheckoutForm onSuccess={handleSuccess} />
            ) : stripePromise && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={handleSuccess} />
              </Elements>
            ) : (
              <MockCheckoutForm onSuccess={handleSuccess} />
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.product.name}</h4>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-slate-200 pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
