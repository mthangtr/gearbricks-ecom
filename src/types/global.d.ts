import { Product } from "./../models/Product";
export type ImageItem = {
  url: string;
  index: number;
};

export type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  slug: string;
  name: string;
  price: number;
  images: ImageItem[];
  inStock: boolean;
  sold: number;
  category: Category;
  colors: string[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  orders?: Order[];
  reviews?: Review[];
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt?: string;
  updatedAt?: string;
  isAdmin?: boolean;
  blindbBoxSpinCount?: number;
};

export type Order = {
  _id: string;
  userId: string;
  items: Product[];
  total: number;
  createdAt: string;
};

export type Blindbox = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  products: {
    product: Product;
    probability: number;
  }[];
  totalOpens: number;
  createdAt: string;
  updatedAt: string;
};

export type SpinRecord = {
  _id: string;
  userId: string;
  blindboxId: string;
  productId?: string;
  success: boolean;
  createdAt: string;
};

export interface CartItem {
  _id?: string;
  product?: string | Product;
  blindbox?: string | Blindbox;
  thumbnailUrl?: string;
  name?: string;
  quantity: number;
  price: number;
  type: "product" | "blindboxProduct" | "blindbox";
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export type SpinResponse = {
  prizeIndex: number;
  prizeProduct: Product;
};
