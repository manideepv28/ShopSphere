import { Product, Category } from "./types";

export const demoCategories: Category[] = [
  { id: 1, name: "Electronics", slug: "electronics" },
  { id: 2, name: "Clothing", slug: "clothing" },
  { id: 3, name: "Home & Garden", slug: "home-garden" },
  { id: 4, name: "Sports", slug: "sports" },
  { id: 5, name: "Books", slug: "books" },
  { id: 6, name: "Beauty", slug: "beauty" },
];

export const demoProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: "149.99",
    originalPrice: "199.99",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 1,
    stock: 50,
    featured: true,
    rating: "4.5",
    reviewCount: 124,
    tags: ["wireless", "audio", "noise-cancelling"],
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring",
    price: "299.99",
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 1,
    stock: 30,
    featured: true,
    rating: "5.0",
    reviewCount: 89,
    tags: ["fitness", "smart", "health"],
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Urban Travel Backpack",
    description: "Durable and stylish backpack for urban adventures",
    price: "89.99",
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 3,
    stock: 75,
    featured: false,
    rating: "4.0",
    reviewCount: 67,
    tags: ["travel", "backpack", "urban"],
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Professional DSLR Camera",
    description: "Professional camera for photography enthusiasts",
    price: "899.99",
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 1,
    stock: 20,
    featured: true,
    rating: "5.0",
    reviewCount: 156,
    tags: ["camera", "photography", "professional"],
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Premium Skincare Set",
    description: "Luxury skincare products for daily routine",
    price: "129.99",
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 6,
    stock: 40,
    featured: true,
    rating: "4.5",
    reviewCount: 203,
    tags: ["skincare", "beauty", "premium"],
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Athletic Running Shoes",
    description: "Comfortable running shoes for everyday wear",
    price: "159.99",
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 4,
    stock: 60,
    featured: false,
    rating: "5.0",
    reviewCount: 312,
    tags: ["shoes", "running", "athletic"],
    createdAt: new Date(),
  },
  {
    id: 7,
    name: "Ergonomic Office Desk",
    description: "Modern office desk with storage solutions",
    price: "449.99",
    originalPrice: undefined,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 3,
    stock: 15,
    featured: false,
    rating: "4.0",
    reviewCount: 78,
    tags: ["desk", "office", "ergonomic"],
    createdAt: new Date(),
  },
  {
    id: 8,
    name: "Home Decor Collection",
    description: "Beautiful home decor items for interior styling",
    price: "79.99",
    originalPrice: "99.99",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    categoryId: 3,
    stock: 25,
    featured: false,
    rating: "4.5",
    reviewCount: 145,
    tags: ["decor", "home", "styling"],
    createdAt: new Date(),
  },
];

export function getDemoProducts(categoryId?: number, search?: string): Product[] {
  let products = [...demoProducts];
  
  if (categoryId) {
    products = products.filter(p => p.categoryId === categoryId);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  return products;
}

export function getDemoFeaturedProducts(): Product[] {
  return demoProducts.filter(p => p.featured);
}

export function getDemoProductById(id: number): Product | undefined {
  return demoProducts.find(p => p.id === id);
}
