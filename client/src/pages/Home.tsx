import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";
import { getDemoProducts, getDemoFeaturedProducts } from "@/lib/demo-data";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: selectedCategory, search: searchQuery }],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory.toString());
        if (searchQuery) params.append("search", searchQuery);
        
        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      } catch (error) {
        // Fallback to demo data when API is not available
        return getDemoProducts(selectedCategory, searchQuery);
      }
    },
  });

  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/products/featured");
        if (!response.ok) throw new Error("Failed to fetch featured products");
        return response.json();
      } catch (error) {
        // Fallback to demo data when API is not available
        return getDemoFeaturedProducts();
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onSearch={setSearchQuery} />
      <CategoryNav selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        {!searchQuery && !selectedCategory && (
          <section className="mb-12">
            <div 
              className="relative h-64 md:h-80 rounded-2xl overflow-hidden hero-gradient"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent"></div>
              <div className="relative h-full flex items-center">
                <div className="max-w-lg ml-8 md:ml-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome to ShopHub</h2>
                  <p className="text-lg text-slate-200 mb-6">Discover amazing products at unbeatable prices. Your one-stop shop for everything you need!</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {!searchQuery && !selectedCategory && featuredProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-slate-800">
              {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory ? "Category Products" : "All Products"}
            </h3>
            <span className="text-sm text-slate-500">({products.length} items)</span>
          </div>
        </div>

        {/* Product Grid */}
        <section className="mb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-slate-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No products found</p>
              {searchQuery && (
                <p className="text-slate-400 mt-2">Try searching with different keywords</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">ShopHub</h3>
              <p className="text-slate-300 mb-4">Your one-stop destination for quality products at competitive prices. We deliver excellence with every purchase.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ShopHub. All rights reserved. | Secure payments powered by Stripe</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
