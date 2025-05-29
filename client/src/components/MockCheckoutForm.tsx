import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { apiRequest } from "@/lib/queryClient";

interface MockCheckoutFormProps {
  onSuccess: () => void;
}

export default function MockCheckoutForm({ onSuccess }: MockCheckoutFormProps) {
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
    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const orderResponse = await apiRequest("POST", "/api/orders", {
        total: (cartTotal + cartTotal * 0.08).toFixed(2), // Include tax
        status: "completed",
        shippingAddress: shippingData,
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
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "An error occurred while processing your order.",
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

      {/* Mock Payment Information */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Information</h3>
        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
          <div className="text-center text-slate-600">
            <p className="mb-2">💳 Demo Mode</p>
            <p className="text-sm">This is a demonstration checkout. No real payment will be processed.</p>
            <p className="text-sm">Click "Complete Order" to simulate a successful purchase.</p>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isProcessing}
        className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3"
      >
        {isProcessing ? "Processing..." : `Complete Order - $${(cartTotal + cartTotal * 0.08).toFixed(2)}`}
      </Button>
    </form>
  );
}