import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

interface CheckoutFormProps {
  onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { user } = useAuth();
  const { cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
          receipt_email: shippingData.email,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create order
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            total: (cartTotal + cartTotal * 0.08).toFixed(2), // Include tax
            status: "completed",
            shippingAddress: shippingData,
          }),
        });

        if (orderResponse.ok) {
          toast({
            title: "Order Placed Successfully!",
            description: "Thank you for your purchase. You will receive a confirmation email shortly.",
          });
          onSuccess();
        } else {
          throw new Error("Failed to create order");
        }
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Shipping Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={shippingData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={shippingData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={shippingData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={shippingData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={shippingData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={shippingData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Information</h3>
        <div className="p-4 border border-slate-200 rounded-lg">
          <PaymentElement />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3"
      >
        {isProcessing ? "Processing..." : `Pay $${(cartTotal + cartTotal * 0.08).toFixed(2)}`}
      </Button>
    </form>
  );
}
