export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  categoryId?: number;
  stock: number;
  featured: boolean;
  rating: string;
  reviewCount: number;
  tags?: string[];
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  zipCode?: string;
  createdAt: Date;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: Date;
}

export interface Order {
  id: number;
  userId: number;
  total: string;
  status: string;
  shippingAddress: any;
  stripePaymentIntentId?: string;
  createdAt: Date;
  items: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: string;
    product: Product;
  }>;
}
