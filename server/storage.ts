import { 
  users, 
  products, 
  categories, 
  cartItems, 
  orders, 
  orderItems,
  type User, 
  type InsertUser, 
  type UpdateUser,
  type Product, 
  type InsertProduct,
  type Category, 
  type InsertCategory,
  type CartItem, 
  type InsertCartItem,
  type Order, 
  type InsertOrder,
  type OrderItem, 
  type InsertOrderItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<UpdateUser>): Promise<User>;

  // Product operations
  getProducts(categoryId?: number, search?: string): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Cart operations
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getUserOrders(userId: number): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private products: Map<number, Product> = new Map();
  private categories: Map<number, Category> = new Map();
  private cartItems: Map<number, CartItem> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();

  private currentUserId = 1;
  private currentProductId = 1;
  private currentCategoryId = 1;
  private currentCartItemId = 1;
  private currentOrderId = 1;
  private currentOrderItemId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categories = [
      { id: 1, name: "Electronics", slug: "electronics" },
      { id: 2, name: "Clothing", slug: "clothing" },
      { id: 3, name: "Home & Garden", slug: "home-garden" },
      { id: 4, name: "Sports", slug: "sports" },
      { id: 5, name: "Books", slug: "books" },
      { id: 6, name: "Beauty", slug: "beauty" },
    ];

    categories.forEach(cat => {
      this.categories.set(cat.id, cat);
      this.currentCategoryId = Math.max(this.currentCategoryId, cat.id + 1);
    });

    // Initialize products
    const products = [
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
        originalPrice: null,
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
        originalPrice: null,
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
        originalPrice: null,
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
        originalPrice: null,
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
        originalPrice: null,
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
        originalPrice: null,
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

    products.forEach(product => {
      this.products.set(product.id, product);
      this.currentProductId = Math.max(this.currentProductId, product.id + 1);
    });
  }

  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      address: null,
      city: null,
      zipCode: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async updateUser(id: number, updates: Partial<UpdateUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product operations
  async getProducts(categoryId?: number, search?: string): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
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

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return items.map(item => {
      const product = this.products.get(item.productId!);
      if (!product) throw new Error("Product not found");
      return { ...item, product };
    });
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + insertCartItem.quantity };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = {
      ...insertCartItem,
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const item = this.cartItems.get(id);
    if (!item) throw new Error("Cart item not found");
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<void> {
    const userItems = Array.from(this.cartItems.entries()).filter(([, item]) => item.userId === userId);
    userItems.forEach(([id]) => this.cartItems.delete(id));
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getUserOrders(userId: number): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const userOrders = Array.from(this.orders.values()).filter(order => order.userId === userId);
    
    return userOrders.map(order => {
      const items = Array.from(this.orderItems.values())
        .filter(item => item.orderId === order.id)
        .map(item => {
          const product = this.products.get(item.productId!);
          if (!product) throw new Error("Product not found");
          return { ...item, product };
        });
      
      return { ...order, items };
    });
  }

  async getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === order.id)
      .map(item => {
        const product = this.products.get(item.productId!);
        if (!product) throw new Error("Product not found");
        return { ...item, product };
      });

    return { ...order, items };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
