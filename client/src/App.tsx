import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import { CartProvider } from "./lib/cart";
import { Navbar } from "./components/navbar";
import { CartDrawer } from "./components/cart-drawer";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Checkout from "@/pages/checkout";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function CartPage() {
  return <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
    <p className="text-gray-600">Use the cart drawer to view and manage your cart items.</p>
  </div>;
}

function Router() {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/profile" component={Profile} />
        <Route path="/cart" component={CartPage} />
        <Route component={NotFound} />
      </Switch>
      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
