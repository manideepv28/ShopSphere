import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check } from "lucide-react";
import { z } from "zod";
import { Link, useLocation } from "wouter";

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date format (MM/YY)"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
});

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingData, setShippingData] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const shippingForm = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    },
  });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardholderName: '',
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderId(`ORD-${data.id}`);
      setOrderConfirmed(true);
      clearCart();
      toast({
        title: "Order confirmed!",
        description: "Thank you for your purchase. You will receive an email confirmation shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if cart is empty or user not logged in
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Please log in</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to complete your purchase.</p>
            <Button onClick={() => setLocation('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = totalPrice;
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (data: z.infer<typeof shippingSchema>) => {
    setShippingData(data);
    setStep('payment');
  };

  const handlePaymentSubmit = (data: z.infer<typeof paymentSchema>) => {
    const orderData = {
      userId: user.id,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
      subtotal: subtotal.toString(),
      tax: tax.toString(),
      shipping: shipping.toString(),
      total: total.toString(),
      shippingAddress: shippingData,
    };

    orderMutation.mutate(orderData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              {/* Progress Steps */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'shipping' ? 'bg-primary text-white' : 'bg-green-500 text-white'
                  }`}>
                    {step === 'payment' ? <Check className="h-4 w-4" /> : '1'}
                  </div>
                  <span className="ml-2 font-medium">Shipping</span>
                </div>
                <div className="flex-1 h-px bg-gray-300 mx-4" />
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'payment' ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className={`ml-2 ${step === 'payment' ? 'font-medium' : 'text-gray-500'}`}>
                    Payment
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {step === 'shipping' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Shipping Information</h3>
                  <Form {...shippingForm}>
                    <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={shippingForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={shippingForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={shippingForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={shippingForm.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Continue to Payment
                      </Button>
                    </form>
                  </Form>
                </div>
              )}

              {step === 'payment' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Payment Information</h3>
                    <Button
                      variant="outline"
                      onClick={() => setStep('shipping')}
                      size="sm"
                    >
                      Back to Shipping
                    </Button>
                  </div>
                  <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                      <FormField
                        control={paymentForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={paymentForm.control}
                          name="expiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={paymentForm.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        size="lg"
                        disabled={orderMutation.isPending}
                      >
                        {orderMutation.isPending ? 'Processing...' : 'Complete Order'}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.cartId} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Dialog open={orderConfirmed} onOpenChange={setOrderConfirmed}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">Order Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Thank you for your purchase. You will receive an email confirmation shortly.
            </p>
            <div>
              <p className="text-sm text-gray-500">Order Number:</p>
              <p className="font-semibold text-lg">{orderId}</p>
            </div>
            <Button 
              onClick={() => {
                setOrderConfirmed(false);
                setLocation('/');
              }}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
