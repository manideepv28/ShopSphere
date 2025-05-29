import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "./auth-modal";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { User, Search, ShoppingCart, Menu } from "lucide-react";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/products?category=electronics", label: "Electronics" },
    { href: "/products?category=fashion", label: "Fashion" },
    { href: "/products?category=home", label: "Home & Garden" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer hover:text-blue-700 transition-colors">
                ShopHub
              </h1>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={logout} className="hidden md:flex">
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className="block py-2 text-gray-700 hover:text-primary cursor-pointer"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              {user && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
}
